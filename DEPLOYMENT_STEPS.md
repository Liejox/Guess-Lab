# 🚀 DEPLOYMENT STEPS

## 1. Install Aptos CLI
```bash
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
```

## 2. Initialize Aptos Account
```bash
aptos init --network devnet
```

## 3. Deploy Contract
```bash
cd move
aptos move publish --named-addresses prediction_market=default
```

## 4. Update Contract Address
Copy the deployed address and update `lib/constants.ts`:
```typescript
export const CONTRACT_ADDRESS = "0xce3ebc6f453c5152f10be089a252c3703764daa0a0edb17c653f3a4820e134b3"
```

## 5. Initialize Contract
1. Connect Petra wallet to devnet
2. Get devnet APT from faucet
3. Click "Init Contract" button in header

## 6. Test Flow
1. Create market via `/create`
2. Commit bet (hidden)
3. Reveal bet (shows prediction)
4. Resolve market
5. Claim rewards

## 7. Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_address
NEXT_PUBLIC_PHOTON_API_KEY=your_photon_key
NEXT_PUBLIC_REWARDED_CAMPAIGN_ID=your_campaign_id
NEXT_PUBLIC_UNREWARDED_CAMPAIGN_ID=your_campaign_id
```

## ✅ Ready to Deploy
Your contract is now ready for deployment. All major issues have been fixed.