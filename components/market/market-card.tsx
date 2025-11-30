"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, TrendingUp, Eye, EyeOff } from "lucide-react";
import { DemoMarket } from "@/lib/demo-markets";

interface MarketCardProps {
  market: DemoMarket;
}

export function MarketCard({ market }: MarketCardProps) {
  const yesPercentage = (market.yesPool / market.totalPool) * 100;
  const noPercentage = (market.noPool / market.totalPool) * 100;

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
    <Link href={`/market/${market.id}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{market.category}</Badge>
            <Badge className={`${phaseInfo.color} text-white`}>
              <PhaseIcon className="w-3 h-3 mr-1" />
              {phaseInfo.label}
            </Badge>
          </div>
          
          <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
            {market.question}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {market.description}
          </p>

          {/* Prediction Percentages */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-600 font-medium">YES {yesPercentage.toFixed(1)}%</span>
              <span className="text-red-600 font-medium">NO {noPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={yesPercentage} className="h-2" />
          </div>

          {/* Market Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{market.totalPool.toFixed(1)} APT</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{market.participants}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>#{market.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}