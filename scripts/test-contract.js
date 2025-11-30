const { AptosClient } = require("aptos");

const NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
const CONTRACT_ADDRESS = "0xce3ebc6f453c5152f10be089a252c3703764daa0a0edb17c653f3a4820e134b3";

async function testContract() {
  const client = new AptosClient(NODE_URL);

  try {
    // Check if contract exists
    console.log("Checking contract deployment...");
    const resource = await client.getAccountResource(
      CONTRACT_ADDRESS,
      `${CONTRACT_ADDRESS}::prediction_market::Markets`
    );
    
    console.log("✅ Contract is deployed and initialized!");
    console.log("Markets resource:", resource);
    
  } catch (error) {
    if (error.message.includes("Resource not found")) {
      console.log("❌ Contract not initialized. Run init-contract.js first.");
    } else {
      console.log("❌ Contract not deployed or other error:", error.message);
    }
  }
}

testContract().catch(console.error);