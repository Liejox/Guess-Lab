"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { WalletButton } from "@/components/wallet/wallet-button"
import { LayoutGrid, PlusCircle, User, Trophy, Eye } from "lucide-react"

const navItems = [
  { href: "/", label: "Markets", icon: LayoutGrid },
  { href: "/create", label: "Create", icon: PlusCircle },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center">
            <img 
              src="/WhatsApp Image 2025-11-30 at 12.03.02_85860cfe.jpg" 
              alt="GuessLab Logo" 
              className="h-9 w-9 rounded-lg object-cover"
            />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Guess<span className="text-primary">Lab</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Wallet */}
        <div className="flex items-center gap-2">
          <WalletButton />
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-around border-t border-border/40 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-1 rounded-lg text-xs transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
