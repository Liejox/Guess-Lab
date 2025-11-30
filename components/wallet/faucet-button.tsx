"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@/components/providers/wallet-provider"
import { useToast } from "@/hooks/use-toast"
import { FAUCET_URL } from "@/lib/constants"
import { Coins, ExternalLink } from "lucide-react"

export function FaucetButton() {
  const { address, connected } = useWallet()
  const { toast } = useToast()

  const handleFaucet = async () => {
    if (!connected || !address) {
      toast({
        title: "Connect wallet first",
        description: "Please connect your wallet to get testnet APT",
        variant: "destructive",
      })
      return
    }

    // Try to fund via CLI first
    try {
      const response = await fetch(`https://faucet.testnet.aptoslabs.com/mint?amount=100000000&address=${address.toString()}`, {
        method: 'POST',
      })
      
      if (response.ok) {
        toast({
          title: "APT Requested!",
          description: "Testnet APT has been sent to your wallet",
        })
      } else {
        throw new Error('Faucet request failed')
      }
    } catch (error) {
      // Fallback to opening faucet website
      window.open(FAUCET_URL, '_blank')
      toast({
        title: "Faucet opened",
        description: "Please request APT from the faucet website",
      })
    }
  }

  if (!connected) {
    return null
  }

  return (
    <Button onClick={handleFaucet} variant="outline" size="sm" className="gap-2">
      <Coins className="h-4 w-4" />
      Get Testnet APT
      <ExternalLink className="h-3 w-3" />
    </Button>
  )
}