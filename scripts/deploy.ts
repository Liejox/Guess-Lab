import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

const NETWORK = Network.TESTNET;
const config = new AptosConfig({ network: NETWORK });
const aptos = new Aptos(config);

async function deployContract() {
  // Generate new account for deployment
  const account = Account.generate();
  console.log("Deployer address:", account.accountAddress.toString());
  
  // Fund the account
  console.log("Funding account...");
  await aptos.fundAccount({
    accountAddress: account.accountAddress,
    amount: 100000000, // 1 APT
  });

  console.log("Publishing contract...");
  
  // Publish the contract
  const transaction = await aptos.publishPackageTransaction({
    account: account.accountAddress,
    metadataBytes: "0x", // Will be filled by CLI
    moduleBytecode: ["0x"], // Will be filled by CLI
  });

  const response = await aptos.signAndSubmitTransaction({
    signer: account,
    transaction,
  });

  await aptos.waitForTransaction({ transactionHash: response.hash });
  
  console.log("Contract deployed!");
  console.log("Transaction:", response.hash);
  console.log("Contract address:", account.accountAddress.toString());
  
  // Initialize the registry
  console.log("Initializing registry...");
  const initTx = await aptos.transaction.build.simple({
    sender: account.accountAddress,
    data: {
      function: `${account.accountAddress}::prediction_market::init_registry`,
      functionArguments: [],
    },
  });

  const initResponse = await aptos.signAndSubmitTransaction({
    signer: account,
    transaction: initTx,
  });

  await aptos.waitForTransaction({ transactionHash: initResponse.hash });
  
  console.log("Registry initialized!");
  console.log("Save this private key:", account.privateKey.toString());
}

deployContract().catch(console.error);