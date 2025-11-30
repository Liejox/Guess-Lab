import type { Market } from "./types"

export const DEMO_MARKETS: Partial<Market>[] = [
  {
    id: 1,
    question: "Will Bitcoin reach $50,000 by end of month?",
    category: "crypto",
    marketType: "crypto",
    commitEndTime: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    revealEndTime: Date.now() + 8 * 24 * 60 * 60 * 1000, // 8 days
    phase: 1, // COMMIT
    yesPool: 0,
    noPool: 0,
    totalCommitted: 0,
    winnerSide: 0,
    totalParticipants: 0,
    totalRevealed: 0,
  },
  {
    id: 2,
    question: "Will Ethereum surpass $3,000 this week?",
    category: "crypto",
    marketType: "crypto",
    commitEndTime: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days
    revealEndTime: Date.now() + 4 * 24 * 60 * 60 * 1000, // 4 days
    phase: 1, // COMMIT
    yesPool: 0,
    noPool: 0,
    totalCommitted: 0,
    winnerSide: 0,
    totalParticipants: 0,
    totalRevealed: 0,
  },
  {
    id: 3,
    question: "Will Aptos (APT) hit $15 before next Friday?",
    category: "crypto",
    marketType: "crypto",
    commitEndTime: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days
    revealEndTime: Date.now() + 6 * 24 * 60 * 60 * 1000, // 6 days
    phase: 2, // REVEAL (for demo)
    yesPool: 1250,
    noPool: 850,
    totalCommitted: 2100,
    winnerSide: 0,
    totalParticipants: 12,
    totalRevealed: 8,
  },
]

export const DEMO_USER_STATS = {
  xp: 1250,
  level: 3,
  wins: 8,
  losses: 3,
  currentStreak: 2,
  totalStaked: 5000,
  totalWon: 6200,
}

export const DEMO_LEADERBOARD = [
  { address: "0x1234...5678", xp: 5000, level: 7, wins: 45, winRate: 78 },
  { address: "0xabcd...efgh", xp: 4200, level: 6, wins: 38, winRate: 82 },
  { address: "0x9876...5432", xp: 3800, level: 6, wins: 35, winRate: 75 },
  { address: "0xfeed...beef", xp: 3200, level: 5, wins: 28, winRate: 71 },
  { address: "0xcafe...babe", xp: 2900, level: 5, wins: 25, winRate: 68 },
]