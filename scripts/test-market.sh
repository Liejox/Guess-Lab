#!/bin/bash

echo "🏪 Testing Prediction Market Contract..."

# Create a test market
echo "📝 Creating test market..."
aptos move run \
  --function-id "default::prediction_market::create_market" \
  --args string:"Will Bitcoin reach $100k by end of 2024?" u64:3600 u64:1800

echo "✅ Test market created!"

# Get some testnet APT
echo "💰 Getting testnet APT..."
aptos account fund-with-faucet --account default

echo "🎯 Market testing setup completed!"
echo "Now you can test the full flow in the frontend:"
echo "1. Connect wallet"
echo "2. Commit a prediction"
echo "3. Reveal the prediction"
echo "4. Claim rewards (after resolution)"