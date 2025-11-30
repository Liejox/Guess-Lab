"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useWallet } from "@/components/providers/wallet-provider";
import { Eye, EyeOff, Clock, TrendingUp, Users, Shield, Zap } from "lucide-react";
import { DemoMarket } from "@/lib/demo-markets";

interface MarketDashboardCardProps {
  market: DemoMarket;
}

export function MarketDashboardCard({ market }: MarketDashboardCardProps) {
  const { account, connected } = useWallet();
  const [betAmount, setBetAmount] = useState("1");
  const [loading, setLoading] = useState(false);

  const yesPercentage = (market.yesPool / market.totalPool) * 100;
  const noPercentage = (market.noPool / market.totalPool) * 100;

  const handleBet = async (side: 'YES' | 'NO') => {
    if (!connected) return;
    setLoading(true);
    // Simulate betting
    setTimeout(() => {
      alert(`Bet placed: ${betAmount} APT on ${side}`);
      setLoading(false);
    }, 1000);
  };

  const getPhaseInfo = () => {
    switch (market.phase) {
      case 'COMMIT': return { label: "Commit Phase", color: "bg-blue-500", icon: EyeOff };
      case 'REVEAL': return { label: "Reveal Phase", color: "bg-yellow-500", icon: Eye };
      case 'RESOLVED': return { label: "Resolved", color: "bg-green-500", icon: TrendingUp };
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
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            {market.category}
          </Badge>
        </div>
        
        <h1 className="text-3xl font-bold text-center">{market.question}</h1>
        <p className="text-muted-foreground">{market.description}</p>
        
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
        <Card className="cursor-pointer transition-all hover:scale-105">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600">YES</CardTitle>
            <div className="text-3xl font-bold">{yesPercentage.toFixed(1)}%</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={yesPercentage} className="h-3" />
            <div className="text-center text-sm text-muted-foreground">
              {market.yesPool.toFixed(2)} APT staked
            </div>
            {market.phase === 'COMMIT' && connected && (
              <Button 
                onClick={() => handleBet('YES')}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Predict YES
              </Button>
            )}
          </CardContent>
        </Card>

        {/* NO Card */}
        <Card className="cursor-pointer transition-all hover:scale-105">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">NO</CardTitle>
            <div className="text-3xl font-bold">{noPercentage.toFixed(1)}%</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={noPercentage} className="h-3" />
            <div className="text-center text-sm text-muted-foreground">
              {market.noPool.toFixed(2)} APT staked
            </div>
            {market.phase === 'COMMIT' && connected && (
              <Button 
                onClick={() => handleBet('NO')}
                disabled={loading}
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
      {market.phase === 'COMMIT' && connected && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 justify-center">
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
              <div className="text-2xl font-bold">{market.totalPool.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total Pool (APT)</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{market.participants}</div>
              <div className="text-sm text-muted-foreground">Participants</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{market.outcome ? 'YES' : market.outcome === false ? 'NO' : 'TBD'}</div>
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