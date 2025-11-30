import { useState } from 'react';
import { useWallet } from '@/components/providers/wallet-provider';
import { useToast } from '@/hooks/use-toast';
import { CONTRACT_ADDRESS, MODULE_NAME } from '@/lib/constants';

export function useMarketCreation() {
  const { account, connected, signAndSubmitTransaction } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createMarket = async (
    question: string,
    commitDurationHours: number,
    revealDurationHours: number
  ) => {
    if (!connected || !account) {
      toast({
        title: '🔒 Wallet Required',
        description: 'Please connect your Petra wallet first',
        variant: 'destructive',
      });
      return false;
    }

    setLoading(true);
    try {
      const commitDurationSecs = commitDurationHours * 3600;
      const revealDurationSecs = revealDurationHours * 3600;

      toast({
        title: '📝 Approve Transaction',
        description: 'Please approve the market creation in Petra wallet',
      });

      const transaction = {
        data: {
          function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::create_market`,
          functionArguments: [
            Array.from(new TextEncoder().encode(question)),
            commitDurationSecs,
            revealDurationSecs,
          ],
        },
      };

      const response = await signAndSubmitTransaction(transaction);
      console.log('Transaction response:', response);

      toast({
        title: '🎉 Market Created!',
        description: 'Your prediction market is now live!',
      });

      return true;
    } catch (error: any) {
      console.error('Market creation error:', error);
      
      let errorMessage = 'Failed to create market';
      if (error.message?.includes('User rejected')) {
        errorMessage = 'Transaction was rejected by user';
      } else if (error.message?.includes('Insufficient')) {
        errorMessage = 'Insufficient funds. Get more APT from faucet.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: '❌ Creation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createMarket,
    loading,
  };
}