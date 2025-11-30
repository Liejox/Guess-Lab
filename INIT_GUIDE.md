# Contract Initialization Guide

## Quick Setup (Recommended)

### Step 1: Get Testnet APT
1. Go to https://faucet.testnet.aptoslabs.com
2. Enter your Petra wallet address
3. Click "Fund Account"

### Step 2: Initialize Contract via Frontend
Add this to your app to initialize the contract:

```typescript
// Add to your app/page.tsx or create a separate init page
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

### Step 3: Check Status
Run: `node scripts/init-contract.js`

## Alternative: Manual CLI

If you have a funded private key:

```javascript
// Update init-contract.js with your private key
const adminPrivateKey = "YOUR_PRIVATE_KEY_HERE";
const admin = new AptosAccount(Buffer.from(adminPrivateKey.slice(2), "hex"));
```

## Troubleshooting

- **Faucet Error**: Use the web faucet instead of API
- **Resource not found**: Contract needs initialization
- **Insufficient funds**: Get more APT from faucet

## Next Steps

After initialization:
1. ✅ Connect Petra wallet
2. ✅ Create markets via `/create` page
3. ✅ Users can commit/reveal bets