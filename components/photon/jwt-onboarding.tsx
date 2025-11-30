"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@/components/providers/wallet-provider";
import { useToast } from "@/hooks/use-toast";
import { photonRegisterUser } from "@/lib/photon";

export function JWTOnboarding() {
  const { account, connected } = useWallet();
  const { toast } = useToast();
  const [jwt, setJwt] = useState("");
  const [loading, setLoading] = useState(false);
  
  const address = account?.address;

  const handleRegister = async () => {
    if (!connected || !address || !jwt) {
      toast({
        title: "Missing requirements",
        description: "Connect wallet and provide JWT token",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await photonRegisterUser(jwt, address!);
      
      toast({
        title: "Photon registration successful!",
        description: `User ID: ${result.photonUserId}`,
      });

      localStorage.setItem('photon_access_token', result.access_token);
      localStorage.setItem('photon_user_id', result.photonUserId);
      
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to register with Photon",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register with Photon</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Enter JWT token"
          value={jwt}
          onChange={(e) => setJwt(e.target.value)}
        />
        <Button 
          onClick={handleRegister} 
          disabled={loading || !jwt || !connected}
          className="w-full"
        >
          {loading ? "Registering..." : "Register with Photon"}
        </Button>
      </CardContent>
    </Card>
  );
}