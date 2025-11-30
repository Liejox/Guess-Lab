import { z } from "zod"

export const CreateMarketSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters").max(200, "Question too long"),
  category: z.enum(["crypto", "sports", "trends", "weather", "custom"]),
  marketType: z.string().min(1, "Market type required"),
  commitDuration: z.number().min(3600, "Minimum 1 hour").max(604800, "Maximum 7 days"),
  revealDuration: z.number().min(1800, "Minimum 30 minutes").max(86400, "Maximum 24 hours"),
})

export const CommitSchema = z.object({
  marketId: z.number().positive(),
  side: z.enum([1, 2]).transform(Number),
  amount: z.number().min(0.01, "Minimum 0.01 APT").max(10000, "Maximum 10,000 APT"),
})

export const RevealSchema = z.object({
  marketId: z.number().positive(),
  side: z.enum([1, 2]).transform(Number),
  amount: z.number().positive(),
  salt: z.string().length(64, "Invalid salt length"),
})

export function validateAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(address)
}

export function validateAmount(amount: number): { valid: boolean; error?: string } {
  if (amount <= 0) return { valid: false, error: "Amount must be positive" }
  if (amount < 0.01) return { valid: false, error: "Minimum amount is 0.01 APT" }
  if (amount > 10000) return { valid: false, error: "Maximum amount is 10,000 APT" }
  return { valid: true }
}

export function validateDeadline(timestamp: number): { valid: boolean; error?: string } {
  const now = Date.now()
  if (timestamp <= now) return { valid: false, error: "Deadline must be in the future" }
  if (timestamp > now + 30 * 24 * 60 * 60 * 1000) {
    return { valid: false, error: "Deadline cannot be more than 30 days" }
  }
  return { valid: true }
}