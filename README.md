# 🚀 GuessLab — Darkpool Prediction Market on Aptos
**Private. Fair. Gamified On-Chain Predictions.**

**🌐 Live Demo: [https://guess-lab.vercel.app/](https://guess-lab.vercel.app/)**

GuessLab is a next-generation prediction market built on the Aptos blockchain, designed for fairness, privacy, and fun.
Unlike traditional platforms where bets are public, GuessLab uses a **Darkpool Commit–Reveal System** to keep predictions hidden until the reveal phase — eliminating manipulation and copy-trading.

*Built for the Build on Aptos Hackathon (IBW).*

## 🌑 Why GuessLab?

Existing Aptos prediction platforms (like Panana) expose user bets publicly:

❌ Anyone can see your bet  
❌ Whales manipulate markets  
❌ No privacy  
❌ No game mechanics  

GuessLab fixes all of this with:

### 🔥 Darkpool Prediction Logic
- **Private commitments** (hashed bets)
- **Anonymous positions** during commit phase
- **Zero-knowledge-style privacy** without heavy ZK
- **Fair reveal** for everyone at the same time

### 🎮 Photon Gamification
- **XP** rewards
- **PAT token** rewards
- **User progression**
- **Embedded wallet** support
- **Event-based reward** triggers

### 📈 Pyth Oracle Crypto Resolution
- **Real-time BTC/ETH** price feeds
- **Automated resolution** for crypto markets

## 🧠 Architecture Overview

### 🟣 Move Smart Contract (Aptos)

**Contract Address:** `0xce3ebc6f453c5152f10be089a252c3703764daa0a0edb17c653f3a4820e134b3`

Core on-chain logic includes:

**✔ Features**
- `init_registry()`
- `create_market()`
- `commit_bet()`
- `reveal_bet()`
- `close_commit_phase()`
- `resolve_market()`
- `claim_reward()`
- Strong commit–reveal hashing
- AptosCoin escrow system
- Per-user commitment storage

### 🔒 Darkpool Logic

Commitments are stored as secure SHA-256 hashes:
```
hash(user_addr | market_id | side | amount | salt)
```

**No observer can guess:**
- ✔ Bet side
- ✔ Bet amount  
- ✔ User strategy

*This is GuessLab's core innovation.*

### 🎨 Frontend (Next.js + TypeScript)

**✔ Features**
- Real Petra Wallet integration
- Full devnet connectivity
- Create/Commit/Reveal/Resolve/Claim flows
- Market timers
- Private commit UI
- Photon reward triggers
- Pyth price display for crypto markets

**Pages**
- `/` → Market list
- `/create` → Create Market
- `/market/[id]` → Commit/Reveal/Resolve
- `/profile` → Photon XP display (coming soon)

## 💎 Photon Integration (XP + PAT Tokens)

GuessLab integrates Photon's identity & reward engine.

**Rewards Triggered:**
- **Commit** → XP (unrewarded event)
- **Reveal** → PAT tokens (rewarded event)
- **Resolve** → Achievement XP
- **Completion streaks** → Level rewards

*Photon makes GuessLab sticky, competitive, and fun.*

## 📡 Pyth Oracle Integration

Used for crypto markets to guarantee fairness.

**Capabilities:**
- Live BTC/ETH feeds
- Check market condition at reveal end
- Automatically set winner side
- Eliminates admin bias

*This makes GuessLab trustless, not just decentralized.*

## 📦 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js, TypeScript, Tailwind, ShadCN |
| **Smart Contract** | Move (Aptos) |
| **Wallet** | Petra Wallet Adapter |
| **Oracle** | Pyth Aptos SDK |
| **Gamification** | Photon API |
| **Network** | Aptos Devnet |

## 🛠 Setup Instructions

### 1. Clone repo
```bash
git clone https://github.com/Liejox/Guess-Lab.git
cd Guess-Lab
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure env
Create `.env.local`:
```env
NEXT_PUBLIC_NETWORK=devnet
NEXT_PUBLIC_CONTRACT_ADDRESS=0xce3ebc6f453c5152f10be089a252c3703764daa0a0edb17c653f3a4820e134b3
NEXT_PUBLIC_PHOTON_API_URL=https://stage-api.getstan.app
NEXT_PUBLIC_PHOTON_API_KEY=YOUR_KEY
```

### 4. Start frontend
```bash
npm run dev
```

### 5. Deploy Move contract
```bash
aptos move publish --profile pred_market
```

## 🎯 User Flow

**Step 1 — Create Market**  
Admin sets question + commit/reveal windows.

**Step 2 — Commit Phase (Darkpool)**  
Users commit hashed predictions, completely private.

**Step 3 — Reveal Phase**  
Users reveal actual bet + salt.  
Market updates public totals.

**Step 4 — Resolution**  
Admin or Pyth oracle resolves.

**Step 5 — Claim Rewards**  
Winners receive payouts based on proportional stake.

**Step 6 — Photon XP Rewards**  
Gamified progression, streaks, and PAT tokens.

## 🏆 Why GuessLab Beats Panana

| Feature | Panana | GuessLab |
|---------|--------|----------|
| **Bet Privacy** | ❌ Public | ✅ Darkpool Commit |
| **Commit–Reveal** | ❌ No | ✅ Yes |
| **Whale Manipulation** | ❌ Possible | ✅ Impossible |
| **Oracle Support** | ❌ Limited | ✅ Pyth Price Feeds |
| **Gamification** | ❌ None | ✅ Photon XP + PAT |
| **Fairness** | Medium | Very High |

## 🚀 Roadmap

- [ ] ZK predictions (future upgrade)
- [ ] Social prediction rooms
- [ ] Group prediction pools
- [ ] Daily XP challenges
- [ ] On-chain leaderboards
- [ ] Multi-chain expansion

## 🔗 Links

- **🌐 Live Demo**: https://guess-lab.vercel.app/
- **Repository**: https://github.com/Liejox/Guess-Lab
- **Contract Explorer**: https://explorer.aptoslabs.com/account/0xce3ebc6f453c5152f10be089a252c3703764daa0a0edb17c653f3a4820e134b3?network=devnet
- **Photon SDK**: https://photon.so

---

*Built with ❤️ on Aptos blockchain for IBW Hackathon*