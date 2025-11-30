module prediction_market::prediction_market {
    
    struct Market has key {
        id: u64,
        question: vector<u8>,
        admin: address,
    }
    
    public entry fun create_market(
        admin: &signer,
        question: vector<u8>,
        commit_duration_secs: u64,
        reveal_duration_secs: u64,
    ) {
        // Simplified version for fast compilation
        let market = Market {
            id: 1,
            question,
            admin: @prediction_market,
        };
        move_to(admin, market);
    }
}