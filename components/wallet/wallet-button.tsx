"use client";

import { useState } from "react";
import { useWallet } from "@/components/providers/wallet-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet, LogOut, Copy, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function WalletButton() {
  const { account, connected, connect, disconnect } = useWallet();
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(false);
  const [copied, setCopied] = useState(false);

  const address = account?.address?.toString();

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await connect("Petra");
      const addr = account?.address?.toString();
      toast({
        title: "🎉 Wallet Connected!",
        description: addr ? `Connected to ${addr.slice(0, 6)}...${addr.slice(-4)}` : "Connected successfully",
      });
    } catch (error: any) {
      toast({
        title: "❌ Connection Failed",
        description: error.message || "Please install Petra wallet",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected from Petra",
      });
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast({ title: "Address copied" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const viewOnExplorer = () => {
    if (address) {
      window.open(`https://explorer.aptoslabs.com/account/${address}?network=devnet`, "_blank");
    }
  };

  if (!connected) {
    return (
      <Button onClick={handleConnect} disabled={connecting} className="gap-2">
        {connecting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Wallet className="h-4 w-4" />
        )}
        {connecting ? "Connecting..." : "Connect Petra"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connected"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={copyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          {copied ? "Copied!" : "Copy Address"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={viewOnExplorer}>
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}