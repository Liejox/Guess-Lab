import { useState, useEffect } from 'react';
import { PYTH_PRICE_FEEDS } from '@/lib/constants';

export interface PythPrice {
  price: number;
  timestamp: number;
  confidence: number;
}

export function usePythOracle(symbol: string) {
  const [price, setPrice] = useState<PythPrice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = async () => {
    const feedId = PYTH_PRICE_FEEDS[symbol as keyof typeof PYTH_PRICE_FEEDS];
    if (!feedId) {
      setError(`No feed ID for ${symbol}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://hermes.pyth.network/api/latest_price_feeds?ids[]=${feedId}`);
      const data = await response.json();

      if (data.length === 0) {
        throw new Error('No price data');
      }

      const priceData = data[0].price;
      const priceValue = Number(priceData.price) * Math.pow(10, priceData.expo);

      setPrice({
        price: priceValue,
        timestamp: priceData.publish_time * 1000,
        confidence: Number(priceData.conf) * Math.pow(10, priceData.expo),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch price');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [symbol]);

  return { price, loading, error, refetch: fetchPrice };
}