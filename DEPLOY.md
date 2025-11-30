# Deployment Guide

## 1. Install Aptos CLI
```bash
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
```

## 2. Initialize Aptos Account
```bash
aptos init --network testnet
```

## 3. Deploy Contract
```bash
cd move
aptos move publish --named-addresses prediction_market=default
```

## 4. Initialize Registry
After deployment, call `init_registry` function once.

## 5. Update Frontend
Update `CONTRACT_ADDRESS` in `lib/constants.ts` with your deployed address.

## 6. Test
- Connect Petra wallet
- Create market via `/create`
- Commit/reveal bets