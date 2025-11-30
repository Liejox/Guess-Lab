"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { DeployStatus } from "@/components/admin/deploy-status"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWallet } from "@/components/providers/wallet-provider"
import { useMarketCreation } from "@/hooks/use-market-creation"
import { useToast } from "@/hooks/use-toast"
import { CATEGORIES } from "@/lib/constants"
import { PlusCircle, Clock, Eye, AlertCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CreateMarketPage() {
  const { connected, connect } = useWallet()
  const { createMarket, loading } = useMarketCreation()
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    question: "",
    category: "",
    marketType: "custom",
    commitDuration: "24", // hours
    revealDuration: "24", // hours
  })

  const handleCreate = async () => {
    // Validate form
    if (!formData.question.trim()) {
      toast({
        title: "⚠️ Missing Question",
        description: "Please enter a market question",
        variant: "destructive",
      })
      return
    }

    if (!formData.category) {
      toast({
        title: "⚠️ Missing Category", 
        description: "Please select a category",
        variant: "destructive",
      })
      return
    }

    // Check wallet connection
    if (!connected) {
      toast({
        title: "🔒 Wallet Required",
        description: "Please connect your Petra wallet first",
        variant: "destructive",
      })
      return
    }

    // Create market
    const success = await createMarket(
      formData.question,
      Number.parseInt(formData.commitDuration),
      Number.parseInt(formData.revealDuration)
    )

    if (success) {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <DeployStatus />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-primary" />
              Create Prediction Market
            </CardTitle>
            <CardDescription>Create a new darkpool prediction market. Only admins can create markets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question */}
            <div className="space-y-2">
              <Label htmlFor="question">Question *</Label>
              <Textarea
                id="question"
                placeholder="Will BTC exceed $150,000 by end of Q1 2025?"
                value={formData.question}
                onChange={(e) => setFormData((prev) => ({ ...prev, question: e.target.value }))}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">Ask a YES/NO question that can be definitively resolved.</p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Market Type */}
            <div className="space-y-2">
              <Label htmlFor="marketType">Market Type</Label>
              <Select
                value={formData.marketType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, marketType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select market type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crypto">Crypto (Pyth Oracle)</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="custom">Custom/Community</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Crypto markets use Pyth oracle for resolution. Others require manual resolution.
              </p>
            </div>

            {/* Durations */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="commitDuration" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Commit Phase (hours)
                </Label>
                <Input
                  id="commitDuration"
                  type="number"
                  min="1"
                  max="168"
                  value={formData.commitDuration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, commitDuration: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="revealDuration" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Reveal Phase (hours)
                </Label>
                <Input
                  id="revealDuration"
                  type="number"
                  min="1"
                  max="168"
                  value={formData.revealDuration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, revealDuration: e.target.value }))}
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex items-start gap-2 rounded-lg bg-secondary/50 p-4 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
              <div className="text-muted-foreground">
                <p className="font-medium text-foreground mb-1">How it works:</p>
                <ul className="space-y-1 text-xs">
                  <li>1. Users commit hidden predictions during commit phase</li>
                  <li>2. Users reveal their predictions during reveal phase</li>
                  <li>3. Admin or oracle resolves the market outcome</li>
                  <li>4. Winners claim their rewards</li>
                </ul>
              </div>
            </div>

            {/* Wallet Connection Warning */}
            {!connected && (
              <div className="flex items-center gap-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4 text-sm">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <p className="text-yellow-700 dark:text-yellow-300">
                  Please connect your wallet to create a market
                </p>
              </div>
            )}

            {/* Submit */}
            <Button 
              onClick={handleCreate} 
              disabled={loading || !formData.question.trim() || !connected} 
              className="w-full" 
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Market...
                </>
              ) : !connected ? (
                "🔒 Connect Wallet Required"
              ) : (
                "🎆 Create Prediction Market"
              )}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
