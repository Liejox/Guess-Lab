"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePredictionActions } from "@/hooks/use-prediction-actions"
import { getCommitment } from "@/utils/storage"
import { formatApt } from "@/utils/format"
import { SIDE } from "@/lib/constants"
import type { Market } from "@/lib/types"
import { Eye, AlertCircle, Check, Lock } from "lucide-react"

interface RevealPanelProps {
  market: Market
  revealed?: boolean
  onSuccess?: () => void
}

export function RevealPanel({ market, revealed, onSuccess }: RevealPanelProps) {
  const { revealBet, loading } = usePredictionActions()

  // Get stored commitment
  const commitment = getCommitment(market.id)

  if (revealed) {
    return (
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Check className="h-5 w-5" />
            Prediction Revealed
          </CardTitle>
          <CardDescription>Your prediction has been revealed and added to the pool.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!commitment) {
    return (
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Lock className="h-5 w-5" />
            No Commitment Found
          </CardTitle>
          <CardDescription>
            You didn't make a prediction during the commit phase, or your commitment data was lost.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const handleReveal = async () => {
    await revealBet(market, onSuccess)
  }

  return (
    <Card className="border-accent/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-accent" />
          Reveal Your Prediction
        </CardTitle>
        <CardDescription>
          The reveal phase is active. Reveal your prediction to participate in the pool.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Commitment Preview */}
        <div className="rounded-lg bg-secondary/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Your Prediction</span>
            <span
              className={`font-bold text-lg ${
                commitment.side === SIDE.YES ? "text-[oklch(0.65_0.2_145)]" : "text-[oklch(0.55_0.22_25)]"
              }`}
            >
              {commitment.side === SIDE.YES ? "YES" : "NO"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Stake Amount</span>
            <span className="font-medium">{formatApt(commitment.amount)} APT</span>
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            Failure to reveal before the deadline will result in forfeiting 10% of your stake. The remaining 90% can be
            claimed as a refund.
          </span>
        </div>

        {/* Submit */}
        <Button onClick={handleReveal} disabled={loading} className="w-full" size="lg">
          {loading ? (
            <>Processing...</>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Reveal Prediction
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
