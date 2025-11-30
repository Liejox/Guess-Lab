#!/bin/bash

# Darkpool Aptos Deployment Script
echo "🚀 Deploying Darkpool Prediction Market..."

# Check if Aptos CLI is installed
if ! command -v aptos &> /dev/null; then
    echo "❌ Aptos CLI not found. Please install it first."
    exit 1
fi

# Navigate to move directory
cd move || exit 1

echo "📦 Compiling Move contracts..."
aptos move compile --named-addresses prediction_market=default

if [ $? -ne 0 ]; then
    echo "❌ Compilation failed"
    exit 1
fi

echo "✅ Compilation successful"

echo "🔧 Publishing to testnet..."
aptos move publish --profile testnet --named-addresses prediction_market=testnet

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi

echo "✅ Deployment successful!"
echo "📝 Don't forget to update NEXT_PUBLIC_CONTRACT_ADDRESS in your .env.local"
echo "🎉 Your Darkpool is live on Aptos testnet!"