module prediction_market::prediction_market {
use std::signer;
use std::vector;
use aptos_framework::coin::{Self, Coin};
use aptos_framework::aptos_coin::AptosCoin;
use aptos_framework::timestamp;
use aptos_std::table::{Self as Table, Table};
use aptos_std::hash;
use aptos_std::bcs;

/// YES = 1, NO = 2, UNKNOWN = 0
const SIDE_UNKNOWN: u8 = 0;
const SIDE_YES: u8 = 1;
const SIDE_NO: u8 = 2;

/// Market phases
const PHASE_COMMIT: u8 = 0;
const PHASE_REVEAL: u8 = 1;
const PHASE_RESOLVED: u8 = 2;

/// One user's commitment inside a market
struct Commitment has store {
    committed: bool,
    commitment: vector<u8>, // hash provided by frontend
    amount: u64,
    revealed: bool,
    side: u8,
    claimed: bool,
}

/// Market resource
struct Market has store {
    id: u64,
    admin: address,
    question: vector<u8>, // could be UTF-8 text
    commit_end_ts: u64,
    reveal_end_ts: u64,
    phase: u8,
    winner_side: u8,
    total_yes: u64,
    total_no: u64,
    // all locked funds
    pot: Coin<AptosCoin>,
    // per-user commitments
    commitments: Table<address, Commitment>,
}

/// Global registry of markets
struct Markets has key {
    next_id: u64,
    markets: Table<u64, Market>,
}

/// Initialize global Markets resource (call once after deploy)
public entry fun init_registry(admin: &signer) {
    let addr = signer::address_of(admin);
    if (!exists<Markets>(addr)) {
        let markets = Markets {
            next_id: 1,
            markets: Table::new<u64, Market>(),
        };
        move_to(admin, markets);
    }
}

/// Create a new market
/// - question: text description
/// - commit_duration_secs: how long commit phase lasts from now
/// - reveal_duration_secs: how long reveal phase lasts AFTER commit
public entry fun create_market(
    admin: &signer,
    question: vector<u8>,
    commit_duration_secs: u64,
    reveal_duration_secs: u64,
) acquires Markets {
    let admin_addr = signer::address_of(admin);
    
    // Auto-initialize if not exists
    if (!exists<Markets>(admin_addr)) {
        let markets = Markets {
            next_id: 1,
            markets: Table::new<u64, Market>(),
        };
        move_to(admin, markets);
    };
    
    let markets = borrow_global_mut<Markets>(admin_addr);
    let id = markets.next_id;
    markets.next_id = id + 1;

    let now = timestamp::now_seconds();
    let commit_end = now + commit_duration_secs;
    let reveal_end = commit_end + reveal_duration_secs;

    let market = Market {
        id,
        admin: admin_addr,
        question,
        commit_end_ts: commit_end,
        reveal_end_ts: reveal_end,
        phase: PHASE_COMMIT,
        winner_side: SIDE_UNKNOWN,
        total_yes: 0,
        total_no: 0,
        pot: coin::zero<AptosCoin>(),
        commitments: Table::new<address, Commitment>(),
    };

    Table::add(&mut markets.markets, id, market);
}

/// User commits a bet:
/// - frontend pre-computes commitment = sha256(user, market_id, side, amount, salt)
/// - user sends (market_id, commitment, amount)
/// We *DO NOT* store side yet → darkpool.
public entry fun commit_bet(
    user: &signer,
    market_owner: address,
    market_id: u64,
    commitment: vector<u8>,
    amount: u64,
) acquires Markets {
    let user_addr = signer::address_of(user);
    let markets = borrow_global_mut<Markets>(market_owner);
    let market = Table::borrow_mut<u64, Market>(&mut markets.markets, market_id);

    let now = timestamp::now_seconds();
    assert!(market.phase == PHASE_COMMIT, 2);
    assert!(now <= market.commit_end_ts, 3);
    assert!(!Table::contains<address, Commitment>(&market.commitments, user_addr), 4);
    assert!(amount > 0, 5);

    // withdraw from user into pot
    let payment = coin::withdraw<AptosCoin>(user, amount);
    coin::merge(&mut market.pot, payment);

    let c = Commitment {
        committed: true,
        commitment,
        amount,
        revealed: false,
        side: SIDE_UNKNOWN,
        claimed: false,
    };
    Table::add<address, Commitment>(&mut market.commitments, user_addr, c);
}

/// Move market from COMMIT to REVEAL phase
public entry fun close_commit_phase(
    admin: &signer,
    market_owner: address,
    market_id: u64,
) acquires Markets {
    let admin_addr = signer::address_of(admin);
    let markets = borrow_global_mut<Markets>(market_owner);
    let market = Table::borrow_mut<u64, Market>(&mut markets.markets, market_id);

    assert!(admin_addr == market.admin, 6);
    let now = timestamp::now_seconds();
    assert!(now >= market.commit_end_ts, 7);
    assert!(market.phase == PHASE_COMMIT, 8);

    market.phase = PHASE_REVEAL;
}

/// Reveal bet:
/// - user provides side + salt
/// - contract recomputes hash and checks equality
/// - side is then recorded and pool totals updated
public entry fun reveal_bet(
    user: &signer,
    market_owner: address,
    market_id: u64,
    side: u8,                // 1 = YES, 2 = NO
    salt: vector<u8>,
) acquires Markets {
    let user_addr = signer::address_of(user);
    let markets = borrow_global_mut<Markets>(market_owner);
    let market = Table::borrow_mut<u64, Market>(&mut markets.markets, market_id);

    let now = timestamp::now_seconds();
    assert!(market.phase == PHASE_REVEAL, 9);
    assert!(now <= market.reveal_end_ts, 10);
    assert!(side == SIDE_YES || side == SIDE_NO, 11);

    let commitment_ref = Table::borrow_mut<address, Commitment>(&mut market.commitments, user_addr);
    assert!(commitment_ref.committed, 12);
    assert!(!commitment_ref.revealed, 13);

    let amount = commitment_ref.amount;

    // recompute hash: hash(user_addr, market_id, side, amount, salt)
    let expected = compute_commitment(user_addr, market_id, side, amount, &salt);
    assert!(vector::length(&expected) == vector::length(&commitment_ref.commitment), 14);
    assert!(expected == commitment_ref.commitment, 15);

    commitment_ref.revealed = true;
    commitment_ref.side = side;

    if (side == SIDE_YES) {
        market.total_yes = market.total_yes + amount;
    } else {
        market.total_no = market.total_no + amount;
    }
}

/// After reveal window, admin resolves market with winner side
public entry fun resolve_market(
    admin: &signer,
    market_owner: address,
    market_id: u64,
    winner_side: u8, // 1 = YES, 2 = NO
) acquires Markets {
    let admin_addr = signer::address_of(admin);
    let markets = borrow_global_mut<Markets>(market_owner);
    let market = Table::borrow_mut<u64, Market>(&mut markets.markets, market_id);

    assert!(admin_addr == market.admin, 16);
    let now = timestamp::now_seconds();
    assert!(now >= market.reveal_end_ts, 17);
    assert!(market.phase == PHASE_REVEAL, 18);
    assert!(winner_side == SIDE_YES || winner_side == SIDE_NO, 19);

    market.phase = PHASE_RESOLVED;
    market.winner_side = winner_side;
}

/// Resolve crypto market using Pyth oracle price
public entry fun resolve_market_with_oracle(
    admin: &signer,
    market_owner: address,
    market_id: u64,
    target_price: u64,
    current_price: u64,
) acquires Markets {
    let admin_addr = signer::address_of(admin);
    let markets = borrow_global_mut<Markets>(market_owner);
    let market = Table::borrow_mut<u64, Market>(&mut markets.markets, market_id);

    assert!(admin_addr == market.admin, 25);
    let now = timestamp::now_seconds();
    assert!(now >= market.reveal_end_ts, 26);
    assert!(market.phase == PHASE_REVEAL, 27);

    let winner_side = if (current_price >= target_price) {
        SIDE_YES
    } else {
        SIDE_NO
    };

    market.phase = PHASE_RESOLVED;
    market.winner_side = winner_side;
}

/// Winners claim their share:
/// payout = user_amount + (user_amount / total_winner_pool) * loser_pool
public entry fun claim_reward(
    user: &signer,
    market_owner: address,
    market_id: u64,
) acquires Markets {
    let user_addr = signer::address_of(user);
    let markets = borrow_global_mut<Markets>(market_owner);
    let market = Table::borrow_mut<u64, Market>(&mut markets.markets, market_id);

    assert!(market.phase == PHASE_RESOLVED, 20);
    assert!(market.winner_side == SIDE_YES || market.winner_side == SIDE_NO, 21);

    let commitment_ref = Table::borrow_mut<address, Commitment>(&mut market.commitments, user_addr);
    assert!(commitment_ref.revealed, 22);
    assert!(!commitment_ref.claimed, 23);
    assert!(commitment_ref.side == market.winner_side, 24);

    let user_amount = commitment_ref.amount;
    let (winner_pool, loser_pool) = if (market.winner_side == SIDE_YES) {
        (market.total_yes, market.total_no)
    } else {
        (market.total_no, market.total_yes)
    };

    // user_share = user_amount + (user_amount * loser_pool / winner_pool)
    let bonus = if (winner_pool > 0) {
        user_amount * loser_pool / winner_pool
    } else {
        0
    };
    let payout = user_amount + bonus;

    // take from pot and send to user
    let payout_coin = coin::extract<AptosCoin>(&mut market.pot, payout);
    coin::deposit<AptosCoin>(user_addr, payout_coin);

    commitment_ref.claimed = true;
}

/// Get market data (VIEW FUNCTION)
#[view]
public fun get_market(market_owner: address, market_id: u64): (u8, u64, u64, u8, u64, u64) acquires Markets {
    let markets = borrow_global<Markets>(market_owner);
    let market = Table::borrow<u64, Market>(&markets.markets, market_id);
    
    (
        market.phase,
        market.commit_end_ts,
        market.reveal_end_ts,
        market.winner_side,
        market.total_yes,
        market.total_no
    )
}

/// Get market question (VIEW FUNCTION)
#[view]
public fun get_market_question(market_owner: address, market_id: u64): vector<u8> acquires Markets {
    let markets = borrow_global<Markets>(market_owner);
    let market = Table::borrow<u64, Market>(&markets.markets, market_id);
    market.question
}

/// Check if user has committed (VIEW FUNCTION)
#[view]
public fun has_committed(market_owner: address, market_id: u64, user: address): bool acquires Markets {
    let markets = borrow_global<Markets>(market_owner);
    let market = Table::borrow<u64, Market>(&markets.markets, market_id);
    Table::contains<address, Commitment>(&market.commitments, user)
}

/// Helper: compute the commitment hash (must match frontend)
/// hash( bcs(user_addr) || bcs(market_id) || bcs(side) || bcs(amount) || salt )
fun compute_commitment(
    user_addr: address,
    market_id: u64,
    side: u8,
    amount: u64,
    salt: &vector<u8>,
): vector<u8> {
    let data = bcs::to_bytes(&user_addr);
    let m = bcs::to_bytes(&market_id);
    let s = bcs::to_bytes(&side);
    let a = bcs::to_bytes(&amount);

    vector::append(&mut data, m);
    vector::append(&mut data, s);
    vector::append(&mut data, a);
    vector::append(&mut data, *salt);

    hash::sha2_256(data)
}

}
