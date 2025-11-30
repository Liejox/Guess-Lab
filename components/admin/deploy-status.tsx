"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/components/providers/wallet-provider";
import { useToast } from "@/hooks/use-toast";
import { CONTRACT_ADDRESS, MODULE_NAME } from "@/lib/constants";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export function DeployStatus() {
  const { account, connected, signAndSubmitTransaction } = useWallet();
  const { toast } = useToast();
  const [status, setStatus] = useState<"checking" | "ready" | "needs-init">("checking");
  const [loading, setLoading] = useState(false);

  const checkContract = async () => {
    try {
      const response = await fetch(`https://fullnode.devnet.aptoslabs.com/v1/accounts/${CONTRACT_ADDRESS}/resource/${CONTRACT_ADDRESS}::${MODULE_NAME}::Markets`);
      
      if (response.ok) {
        setStatus("ready");
      } else {
        setStatus("needs-init");
      }
    } catch (error) {
      setStatus("needs-init");
    }
  };

  const initContract = async () => {
    if (!connected || !account) {
      toast({
        title: "Connect wallet",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const transaction = {
        data: {
          function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::init_registry`,
          functionArguments: [],
        },
      };

      await signAndSubmitTransaction(transaction);
      
      toast({
        title: "Contract initialized!",
        description: "GuessLab is ready to use",
      });
      
      setStatus("ready");
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

  useEffect(() => {
    checkContract();
  }, []);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status === "checking" && <Loader2 className="h-5 w-5 animate-spin" />}
          {status === "ready" && <CheckCircle className="h-5 w-5 text-green-500" />}
          {status === "needs-init" && <XCircle className="h-5 w-5 text-red-500" />}
          Contract Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status === "checking" && <p>Checking contract status...</p>}
        
        {status === "ready" && (
          <div className="text-green-600">
            ✅ Contract is ready! You can create markets now.
          </div>
        )}
        
        {status === "needs-init" && (
          <div className="space-y-4">
            <p className="text-yellow-600">⚠️ Contract needs initialization</p>
            <Button 
              onClick={initContract} 
              disabled={loading || !connected}
              className="w-full"
            >
              {loading ? "Initializing..." : "Initialize Contract"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}