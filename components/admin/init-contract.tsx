"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/components/providers/wallet-provider";
import { useToast } from "@/hooks/use-toast";
import { CONTRACT_ADDRESS, MODULE_NAME } from "@/lib/constants";

export function InitContract() {
  const { connected, signAndSubmitTransaction } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const initContract = async () => {
    if (!connected) {
      toast({
        title: "Connect wallet",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        type: "entry_function_payload",
        function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::init_registry`,
        type_arguments: [],
        arguments: [],
      };

      await signAndSubmitTransaction(payload);

      toast({
        title: "Contract initialized!",
        description: "You can now create markets",
      });
    } catch (error: any) {
      toast({
        title: "Initialization failed",
        description: error.message || "Failed to initialize contract",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={initContract}
      disabled={loading || !connected}
      variant="outline"
    >
      {loading ? "Initializing..." : "Init Contract"}
    </Button>
  );
}