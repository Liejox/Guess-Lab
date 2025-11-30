import { useState } from 'react';
import { useWallet } from '@/components/providers/wallet-provider';
import { useToast } from '@/hooks/use-toast';
import { generateSalt, generateCommitHash, hexToBytes } from '@/utils/hashing';
import { storeCommitment, getCommitment, removeCommitment } from '@/utils/storage';
import { parseAptToOctas } from '@/utils/format';
import { CONTRACT_ADDRESS, MODULE_NAME } from '@/lib/constants';
import { rewardCommit, rewardReveal, rewardWin } from '@/lib/photon';

interface Market {
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

export function usePredictionActions() {
  const { account, connected, signAndSubmitTransaction } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const commitBet = async (
    market: Market,
    selectedSide: number,
    amount: number,
    onSuccess?: () => void
  ) => {
    if (!connected || !account) {
      toast({
        title: 'Connect wallet',
        description: 'Please connect your wallet to make a prediction',
        variant: 'destructive',
      });
      return false;
    }

    setLoading(true);
    try {
      const salt = generateSalt();
      const amountOctas = parseAptToOctas(amount);
      const commitHash = await generateCommitHash(selectedSide, amountOctas, salt, account.address, market.id);

      // Store commitment locally for reveal
      storeCommitment({
        marketId: market.id,
        side: selectedSide,
        amount: amountOctas,
        salt,
        commitHash,
        timestamp: Date.now(),
      });

      // Submit transaction
      const transaction = {
        data: {
          function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::commit_bet`,
          functionArguments: [
            CONTRACT_ADDRESS,
            market.id,
            Array.from(hexToBytes(commitHash)),
            amountOctas,
          ],
        },
      };

      await signAndSubmitTransaction(transaction);

      // Photon reward for commit (XP only)
      await rewardCommit(account.address, market.id, { 
        side: selectedSide, 
        amount: amountOctas 
      });

      toast({
        title: '🎉 Prediction Committed!',
        description: 'Your prediction is encrypted. Reveal during reveal phase to win!',
      });

      onSuccess?.();
      return true;
    } catch (error: any) {
      console.error('Commit error:', error);
      toast({
        title: '❌ Commit Failed',
        description: error.message || 'Failed to submit prediction',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const revealBet = async (market: Market, onSuccess?: () => void) => {
    if (!connected || !account) {
      toast({
        title: 'Connect wallet',
        description: 'Please connect your wallet to reveal',
        variant: 'destructive',
      });
      return false;
    }

    const commitment = getCommitment(market.id);
    if (!commitment) {
      toast({
        title: 'No commitment found',
        description: 'You need to commit first',
        variant: 'destructive',
      });
      return false;
    }

    setLoading(true);
    try {
      // Submit reveal transaction
      const transaction = {
        data: {
          function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::reveal_bet`,
          functionArguments: [
            CONTRACT_ADDRESS,
            market.id,
            commitment.side,
            Array.from(hexToBytes(commitment.salt)),
          ],
        },
      };

      await signAndSubmitTransaction(transaction);

      // Photon reward for reveal (XP + small PAT)
      await rewardReveal(account.address, market.id, {
        side: commitment.side
      });

      // Remove stored commitment after successful reveal
      removeCommitment(market.id);

      toast({
        title: '🔓 Prediction Revealed!',
        description: `Your ${commitment.side === 1 ? 'YES' : 'NO'} prediction is now visible!`,
      });

      onSuccess?.();
      return true;
    } catch (error: any) {
      console.error('Reveal error:', error);
      toast({
        title: '❌ Reveal Failed',
        description: error.message || 'Failed to reveal prediction',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (market: Market, onSuccess?: () => void) => {
    if (!connected || !account) {
      toast({
        title: 'Connect wallet',
        description: 'Please connect your wallet to claim',
        variant: 'destructive',
      });
      return false;
    }

    setLoading(true);
    try {
      const transaction = {
        data: {
          function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::claim_reward`,
          functionArguments: [CONTRACT_ADDRESS, market.id],
        },
      };

      const response = await signAndSubmitTransaction(transaction);

      // Calculate win amount for Photon
      const commitment = getCommitment(market.id);
      const winAmount = commitment ? commitment.amount : 0;

      // Photon reward for winning (big PAT + XP)
      await rewardWin(account.address, market.id, {
        winAmount: winAmount / 100000000 // Convert to APT
      });

      toast({
        title: '💰 Rewards Claimed!',
        description: 'Your winnings have been transferred to your wallet!',
      });

      onSuccess?.();
      return true;
    } catch (error: any) {
      console.error('Claim error:', error);
      toast({
        title: '❌ Claim Failed',
        description: error.message || 'Failed to claim rewards',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    commitBet,
    revealBet,
    claimReward,
    loading,
  };
}