import { useState, useEffect } from 'react';
import { CONTRACT_ADDRESS, NODE_URL } from '@/lib/constants';

export interface MarketData {
  id: number;
  question: string;
  phase: number;
  commitEndTs: number;
  revealEndTs: number;
  winnerSide: number;
  totalYes: number;
  totalNo: number;
  hasCommitted: boolean;
}

export function useMarketData(marketId: number, userAddress?: string) {
  const [market, setMarket] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = async () => {
    if (!marketId) return;
    
    setLoading(true);
    setError(null);

    try {
      // Fetch market data from Move view function
      const marketResponse = await fetch(`${NODE_URL}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          function: `${CONTRACT_ADDRESS}::prediction_market::get_market`,
          type_arguments: [],
          arguments: [CONTRACT_ADDRESS, marketId.toString()]
        })
      });

      if (!marketResponse.ok) {
        throw new Error('Market not found');
      }

      const marketData = await marketResponse.json();
      const [phase, commitEndTs, revealEndTs, winnerSide, totalYes, totalNo] = marketData;

      // Fetch market question
      const questionResponse = await fetch(`${NODE_URL}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          function: `${CONTRACT_ADDRESS}::prediction_market::get_market_question`,
          type_arguments: [],
          arguments: [CONTRACT_ADDRESS, marketId.toString()]
        })
      });

      let question = `Market ${marketId}`;
      if (questionResponse.ok) {
        const questionData = await questionResponse.json();
        // Convert bytes to string
        question = new TextDecoder().decode(new Uint8Array(questionData));
      }

      // Check if user has committed
      let hasCommitted = false;
      if (userAddress) {
        const commitResponse = await fetch(`${NODE_URL}/view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            function: `${CONTRACT_ADDRESS}::prediction_market::has_committed`,
            type_arguments: [],
            arguments: [CONTRACT_ADDRESS, marketId.toString(), userAddress]
          })
        });

        if (commitResponse.ok) {
          hasCommitted = await commitResponse.json();
        }
      }

      setMarket({
        id: marketId,
        question,
        phase: parseInt(phase),
        commitEndTs: parseInt(commitEndTs),
        revealEndTs: parseInt(revealEndTs),
        winnerSide: parseInt(winnerSide),
        totalYes: parseInt(totalYes),
        totalNo: parseInt(totalNo),
        hasCommitted
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchMarketData, 10000);
    return () => clearInterval(interval);
  }, [marketId, userAddress]);

  return { market, loading, error, refetch: fetchMarketData };
}