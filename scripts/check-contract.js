const CONTRACT_ADDRESS = "0xce3ebc6f453c5152f10be089a252c3703764daa0a0edb17c653f3a4820e134b3";
const MODULE_NAME = "prediction_market";

async function checkContract() {
  console.log("🔍 Checking contract deployment...");
  console.log("Contract Address:", CONTRACT_ADDRESS);
  
  try {
    // Check if account exists
    const accountResponse = await fetch(`https://fullnode.devnet.aptoslabs.com/v1/accounts/${CONTRACT_ADDRESS}`);
    const accountData = await accountResponse.json();
    
    if (accountResponse.ok) {
      console.log("✅ Account exists");
      console.log("Sequence number:", accountData.sequence_number);
    } else {
      console.log("❌ Account not found");
      return;
    }

    // Check if Markets resource exists
    const resourceResponse = await fetch(`https://fullnode.devnet.aptoslabs.com/v1/accounts/${CONTRACT_ADDRESS}/resource/${CONTRACT_ADDRESS}::${MODULE_NAME}::Markets`);
    
    if (resourceResponse.ok) {
      const resourceData = await resourceResponse.json();
      console.log("✅ Markets resource exists");
      console.log("Next ID:", resourceData.data.next_id);
      console.log("Contract is INITIALIZED and ready!");
    } else {
      console.log("⚠️ Markets resource not found - Contract needs initialization");
    }

    // Check modules
    const modulesResponse = await fetch(`https://fullnode.devnet.aptoslabs.com/v1/accounts/${CONTRACT_ADDRESS}/modules`);
    if (modulesResponse.ok) {
      const modules = await modulesResponse.json();
      const predictionModule = modules.find(m => m.abi.name === MODULE_NAME);
      
      if (predictionModule) {
        console.log("✅ Prediction market module deployed");
        console.log("Available functions:", predictionModule.abi.exposed_functions.map(f => f.name));
      } else {
        console.log("❌ Prediction market module not found");
      }
    }

  } catch (error) {
    console.error("❌ Error checking contract:", error.message);
  }
}

checkContract();