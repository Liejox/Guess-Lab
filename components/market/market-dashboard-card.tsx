"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useWallet } from "@/components/providers/wallet-provider";
import { useMarketData } from "@/hooks/use-market-data";
import { usePredictionActions } from "@/hooks/use-prediction-actions";
import { rewardCommit, rewardReveal } from "@/lib/photon";
import { Eye, EyeOff, Clock, TrendingUp, Users, Shield, Zap } from "lucide-react";
import { formatCountdown } from "@/utils/format";

interface MarketDashboardCardProps {
  marketId: number;
}

export function MarketDashboardCard({ marketId }: MarketDashboardCardProps) {
  const { account, connected } = useWallet();
  const { market, loading, refetch } = useMarketData(marketId, account?.address);
  const { commitBet, revealBet, claimReward, loading: actionLoading } = usePredictionActions();
  
  const [betAmount, setBetAmount] = useState("1");
  const [selectedSide, setSelectedSide] = useState<1 | 2 | null>(null);
  const [timeLeft, setTimeLeft] = useState("");

  // Update countdown timer
  useEffect(() => {
    if (!market) return;
    
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      let endTime = market.phase === 0 ? market.commitEndTs : market.revealEndTs;
      setTimeLeft(formatCountdown(endTime));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [market]);

  const handleCommit = async (side: 1 | 2) => {
    if (!market || !account) return;
    
    const success = await commitBet(market, side, parseFloat(betAmount), () => {
      refetch();
      // Photon reward for commit
      rewardCommit(account.address, marketId, { side, amount: betAmount });
    });
  };

  const handleReveal = async () => {
    if (!market || !account) return;
    
    const success = await revealBet(market, () => {
      refetch();
      // Photon reward for reveal
      rewardReveal(account.address, marketId);
    });
  };

  const handleClaim = async () => {
    if (!market || !account) return;
    
    await claimReward(market, () => {
      refetch();
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!market) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Market Not Found</h2>
        <p className="text-muted-foreground">The requested market does not exist.</p>
      </div>
    );
  }

  const totalPool = market.totalYes + market.totalNo;
  const yesPercentage = totalPool > 0 ? (market.totalYes / totalPool) * 100 : 50;
  const noPercentage = totalPool > 0 ? (market.totalNo / totalPool) * 100 : 50;

  const getPhaseInfo = () => {
    switch (market.phase) {
      case 0: return { label: "Commit Phase", color: "bg-blue-500", icon: EyeOff };
      case 1: return { label: "Reveal Phase", color: "bg-yellow-500", icon: Eye };
      case 2: return { label: "Resolved", color: "bg-green-500", icon: TrendingUp };
      default: return { label: "Unknown", color: "bg-gray-500", icon: Clock };
    }
  };

  const phaseInfo = getPhaseInfo();
  const PhaseIcon = phaseInfo.icon;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Badge className={`${phaseInfo.color} text-white`}>
            <PhaseIcon className="w-4 h-4 mr-1" />
            {phaseInfo.label}
          </Badge>
          {market.phase < 2 && (
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3" />
              Closes in {timeLeft}
            </Badge>
          )}
        </div>
        
        <h1 className="text-3xl font-bold text-center">{market.question}</h1>
        
        {connected && (
          <Badge variant="secondary" className="gap-1">
            <Shield className="w-3 h-3" />
            Wallet Connected
          </Badge>
        )}
      </div>

      {/* Darkpool Encryption Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Darkpool Encryption Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Hidden Liquidity</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Your predictions are encrypted until reveal phase
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">No Front-Running</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Commit-reveal prevents manipulation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Prediction Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* YES Card */}
        <Card className={`cursor-pointer transition-all hover:scale-105 ${selectedSide === 1 ? 'ring-2 ring-green-500' : ''}`}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600">YES</CardTitle>
            <div className="text-3xl font-bold">{yesPercentage.toFixed(1)}%</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={yesPercentage} className="h-3" />
            <div className="text-center text-sm text-muted-foreground">
              {market.totalYes / 100000000} APT staked
            </div>
            {market.phase === 0 && connected && (
              <Button 
                onClick={() => handleCommit(1)}
                disabled={actionLoading}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Predict YES
              </Button>
            )}
          </CardContent>
        </Card>

        {/* NO Card */}
        <Card className={`cursor-pointer transition-all hover:scale-105 ${selectedSide === 2 ? 'ring-2 ring-red-500' : ''}`}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">NO</CardTitle>
            <div className="text-3xl font-bold">{noPercentage.toFixed(1)}%</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={noPercentage} className="h-3" />
            <div className="text-center text-sm text-muted-foreground">
              {market.totalNo / 100000000} APT staked
            </div>
            {market.phase === 0 && connected && (
              <Button 
                onClick={() => handleCommit(2)}
                disabled={actionLoading}
                className="w-full bg-red-600 hover:bg-red-700"
                size="lg"
              >
                Predict NO
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bet Amount Input */}
      {market.phase === 0 && connected && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Bet Amount:</label>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="1.0"
                className="max-w-32"
                min="0.1"
                step="0.1"
              />
              <span className="text-sm text-muted-foreground">APT</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {connected && (
        <div className="flex justify-center gap-4">
          {market.phase === 1 && market.hasCommitted && (
            <Button onClick={handleReveal} disabled={actionLoading} size="lg">
              <Eye className="w-4 h-4 mr-2" />
              Reveal Prediction
            </Button>
          )}
          
          {market.phase === 2 && (
            <Button onClick={handleClaim} disabled={actionLoading} size="lg">
              <TrendingUp className="w-4 h-4 mr-2" />
              Claim Rewards
            </Button>
          )}
        </div>
      )}

      {/* Market Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Market Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{(totalPool / 100000000).toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total Pool (APT)</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{market.phase}</div>
              <div className="text-sm text-muted-foreground">Current Phase</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{market.winnerSide || "TBD"}</div>
              <div className="text-sm text-muted-foreground">Winner</div>
            </div>
            <div>
              <div className="text-2xl font-bold">#{market.id}</div>
              <div className="text-sm text-muted-foreground">Market ID</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}