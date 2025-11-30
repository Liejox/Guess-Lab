const { AptosClient, AptosAccount } = require("aptos");

const NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
const CONTRACT_ADDRESS = "0xce3ebc6f453c5152f10be089a252c3703764daa0a0edb17c653f3a4820e134b3";

async function initializeContract() {
  const client = new AptosClient(NODE_URL);

  // Use the contract address as admin (it should already be funded)
  const adminPrivateKey = "0x" + "0".repeat(64); // Placeholder - use your actual private key
  console.log("\n⚠️  IMPORTANT: You need to provide the admin private key!");
  console.log("Replace the placeholder private key in this script with your actual key.\n");
  
  // For now, let's just check if contract is already initialized
  console.log("Checking contract status...");

  try {
    // Check if contract is already initialized
    const resource = await client.getAccountResource(
      CONTRACT_ADDRESS,
      `${CONTRACT_ADDRESS}::prediction_market::Markets`
    );
    
    console.log("✅ Contract is already initialized!");
    console.log("Markets resource:", resource);
    
  } catch (error) {
    if (error.message.includes("Resource not found")) {
      console.log("❌ Contract not initialized.");
      console.log("\nTo initialize:");
      console.log("1. Get testnet APT from: https://faucet.testnet.aptoslabs.com");
      console.log("2. Use Petra wallet to call init_registry function");
      console.log("3. Or update this script with your funded private key");
    } else {
      console.error("Error checking contract:", error.message);
    }
  }
}

initializeContract().catch(console.error);