#!/bin/bash

echo "Deploying Prediction Market Contract..."

# Compile and publish the contract
aptos move publish --package-dir ./move --named-addresses prediction_market=default

echo "Contract deployed successfully!"
echo "Don't forget to call init_registry after deployment."