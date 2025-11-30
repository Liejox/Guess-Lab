import { PYTH_PRICE_FEEDS } from "./constants"

export interface PriceData {
  price: number
  timestamp: number
  confidence: number
}

/**
 * Mock oracle for demo - replace with real Pyth integration
 */
export class MockOracle {
  private static prices: Record<string, number> = {
    "BTC/USD": 45000,
    "ETH/USD": 2800,
    "APT/USD": 12.5,
    "SOL/USD": 95,
  }

  static async getPrice(symbol: string): Promise<PriceData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const basePrice = this.prices[symbol] || 100
    // Add random fluctuation ±5%
    const fluctuation = (Math.random() - 0.5) * 0.1
    const price = basePrice * (1 + fluctuation)
    
    return {
      price: Math.round(price * 100) / 100,
      timestamp: Date.now(),
      confidence: 0.95 + Math.random() * 0.05
    }
  }

  static async getPriceAtTime(symbol: string, timestamp: number): Promise<PriceData> {
    // For demo, return current price with historical timestamp
    const current = await this.getPrice(symbol)
    return { ...current, timestamp }
  }
}

/**
 * Real Pyth oracle integration (placeholder)
 */
export class PythOracle {
  private static readonly PYTH_ENDPOINT = "https://hermes.pyth.network/api/latest_price_feeds"
  
  static async getPrice(symbol: string): Promise<PriceData> {
    const feedId = PYTH_PRICE_FEEDS[symbol as keyof typeof PYTH_PRICE_FEEDS]
    if (!feedId) throw new Error(`No feed ID for ${symbol}`)
    
    try {
      const response = await fetch(`${this.PYTH_ENDPOINT}?ids[]=${feedId}`)
      const data = await response.json()
      
      if (data.length === 0) throw new Error("No price data")
      
      const priceData = data[0].price
      const price = Number(priceData.price) * Math.pow(10, priceData.expo)
      
      return {
        price,
        timestamp: priceData.publish_time * 1000,
        confidence: Number(priceData.conf) * Math.pow(10, priceData.expo)
      }
    } catch (error) {
      console.warn("Pyth oracle failed, using mock:", error)
      return MockOracle.getPrice(symbol)
    }
  }
}