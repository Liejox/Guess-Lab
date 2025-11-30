"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { ReactNode } from "react";

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <AptosWalletAdapterProvider>
      {children}
    </AptosWalletAdapterProvider>
  );
}

export { useWallet } from "@aptos-labs/wallet-adapter-react";