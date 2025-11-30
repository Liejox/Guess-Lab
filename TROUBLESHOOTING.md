# Troubleshooting Simulation Errors

## Issues Fixed

### 1. Function Name Mismatch ✅
**Problem**: Frontend was calling wrong function names
- Called: `commit_prediction`, `reveal_prediction`, `claim`
- Actual: `commit_bet`, `reveal_bet`, `claim_reward`

**Solution**: Updated `use-prediction-actions.ts` with correct function names.

### 2. Hashing Algorithm Mismatch ✅
**Problem**: Frontend used SHA3-256, Move contract uses SHA2-256
**Solution**: Updated `hashing.ts` to use SHA2-256 (Web Crypto API).

### 3. Missing Contract Initialization ⚠️
**Problem**: Contract needs `init_registry` call before use
**Solution**: Created `scripts/init-contract.js` to initialize.

## Steps to Fix Remaining Issues

### Step 1: Install Dependencies
```bash
npm install aptos
```

### Step 2: Initialize Contract
```bash
node scripts/init-contract.js
```

### Step 3: Test Contract
```bash
node scripts/test-contract.js
```

### Step 4: Update Environment Variables
Make sure your `.env.local` has:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xce3ebc6f453c5152f10be089a252c3703764daa0a0edb17c653f3a4820e134b3
NEXT_PUBLIC_PHOTON_API_KEY=your_photon_key
NEXT_PUBLIC_REWARDED_CAMPAIGN_ID=your_campaign_id
NEXT_PUBLIC_UNREWARDED_CAMPAIGN_ID=your_campaign_id
```

## Common Simulation Errors

### "Resource not found"
- Contract not deployed or initialized
- Run initialization script

### "Function not found"
- Wrong function name in payload
- Check Move contract for exact names

### "Invalid arguments"
- Wrong argument types or order
- Verify payload matches Move function signature

### "Insufficient balance"
- User doesn't have enough APT
- Use faucet to get testnet tokens

## Testing Checklist

- [ ] Contract deployed at correct address
- [ ] Contract initialized with `init_registry`
- [ ] Function names match Move contract
- [ ] Hash algorithm matches (SHA2-256)
- [ ] User has sufficient APT balance
- [ ] Wallet connected to testnet

## Debug Commands

Check contract resource:
```bash
curl "https://fullnode.testnet.aptoslabs.com/v1/accounts/0xce3ebc6f453c5152f10be089a252c3703764daa0a0edb17c653f3a4820e134b3/resource/0xce3ebc6f453c5152f10be089a252c3703764daa0a0edb17c653f3a4820e134b3::prediction_market::Markets"
```

Get account balance:
```bash
curl "https://fullnode.testnet.aptoslabs.com/v1/accounts/YOUR_ADDRESS/resource/0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
```