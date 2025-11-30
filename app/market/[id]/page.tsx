"use client";

import { use } from "react";
import { Header } from "@/components/layout/header";
import { MarketDashboardCard } from "@/components/market/market-dashboard-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getMarketById } from "@/lib/demo-markets";

interface MarketPageProps {
  params: Promise<{ id: string }>;
}

export default function MarketPage({ params }: MarketPageProps) {
  const { id } = use(params);
  const market = getMarketById(id);

  if (!market) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Market Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested market does not exist.</p>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Markets
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Markets
        </Link>

        {/* Market Dashboard */}
        <MarketDashboardCard market={market} />
      </main>
    </div>
  );
}