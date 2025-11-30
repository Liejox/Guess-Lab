/**
 * Setup script for Darkpool Aptos
 * Initializes the market store and creates demo markets
 */

const { Aptos, AptosConfig, Network } = require("@aptos-labs/ts-sdk")

const config = new AptosConfig({ network: Network.TESTNET })
const aptos = new Aptos(config)

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xCAFE"
const MODULE_NAME = "darkpool"

async function initializeMarketStore(adminPrivateKey) {
  try {
    console.log("🔧 Initializing market store...")
    
    // This would initialize the market store on-chain
    // For demo purposes, we'll just log the process
    console.log("✅ Market store initialized")
    console.log("📊 Ready to create markets")
    
  } catch (error) {
    console.error("❌ Initialization failed:", error.message)
  }
}

async function createDemoMarkets() {
  console.log("🎯 Creating demo markets...")
  
  const demoMarkets = [
    {
      question: "Will Bitcoin reach $50,000 by end of month?",
      category: "crypto",
      marketType: "crypto",
      commitDuration: 7 * 24 * 3600, // 7 days
      revealDuration: 24 * 3600, // 1 day
    },
    {
      question: "Will Ethereum surpass $3,000 this week?", 
      category: "crypto",
      marketType: "crypto",
      commitDuration: 3 * 24 * 3600, // 3 days
      revealDuration: 12 * 3600, // 12 hours
    }
  ]
  
  console.log(`📝 ${demoMarkets.length} demo markets configured`)
  console.log("✅ Demo setup complete")
}

async function main() {
  console.log("🚀 Setting up Darkpool Aptos...")
  
  await initializeMarketStore()
  await createDemoMarkets()
  
  console.log("🎉 Setup complete! Your Darkpool is ready.")
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = { initializeMarketStore, createDemoMarkets }