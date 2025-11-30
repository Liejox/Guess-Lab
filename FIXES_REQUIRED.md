# 🚨 CRITICAL FIXES REQUIRED

## ✅ COMPLETED FIXES

1. **Move Contract**: Added `resolve_market_with_oracle` function
2. **Phase Constants**: Fixed PHASE constants to match Move (0,1,2)
3. **Function Arguments**: Fixed commit_bet/reveal_bet arguments
4. **Photon Events**: Fixed reveal to use REWARDED event
5. **Dependencies**: Added @pythnetwork/pyth-aptos-js
6. **Network**: Changed to devnet
7. **Pyth Hook**: Created usePythOracle hook
8. **JWT Onboarding**: Created Photon registration component

## ❌ STILL REQUIRED

### 1. Install Dependencies
```bash
npm install @pythnetwork/pyth-aptos-js
```

### 2. Deploy Contract to Devnet
```bash
cd move
aptos init --network devnet
aptos move publish --named-addresses prediction_market=default
```

### 3. Update CONTRACT_ADDRESS
Replace in `lib/constants.ts` with your deployed address

### 4. Add Init Contract Button
```typescript
// Add to header or create page
const initContract = async () => {
  const payload = {
    type: "entry_function_payload",
    function: `${CONTRACT_ADDRESS}::prediction_market::init_registry`,
    type_arguments: [],
    arguments: [],
  };
  await signAndSubmitTransaction(payload);
};
```

### 5. Environment Variables
Add to `.env.local`:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_address
NEXT_PUBLIC_PHOTON_API_KEY=your_photon_key
NEXT_PUBLIC_REWARDED_CAMPAIGN_ID=your_campaign_id
NEXT_PUBLIC_UNREWARDED_CAMPAIGN_ID=your_campaign_id
```

### 6. Fix Market Details Page
Update phase checks to use new constants (0,1,2)

### 7. Add Pyth Price Display
Use `usePythOracle` hook in market components

### 8. Test Complete Flow
1. Deploy contract
2. Initialize registry
3. Create market
4. Commit bet
5. Reveal bet
6. Resolve with oracle
7. Claim rewards

## 🎯 PRIORITY ORDER
1. Deploy contract ⚡
2. Update CONTRACT_ADDRESS ⚡
3. Add init button ⚡
4. Test basic flow ⚡
5. Add Pyth integration
6. Test Photon events