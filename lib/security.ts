import bcrypt from "bcryptjs"
import type { NextRequest } from "next/server"
import dbConnect from "@/lib/database"
import User from "@/models/User"

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

export function rateLimit(options: RateLimitOptions) {
  return (identifier: string): { allowed: boolean; remaining: number; resetTime: number } => {
    const now = Date.now()
    const key = identifier
    const window = rateLimitStore.get(key)

    if (!window || now > window.resetTime) {
      // New window or expired window
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + options.windowMs,
      })
      return {
        allowed: true,
        remaining: options.maxRequests - 1,
        resetTime: now + options.windowMs,
      }
    }

    if (window.count >= options.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: window.resetTime,
      }
    }

    window.count++
    return {
      allowed: true,
      remaining: options.maxRequests - window.count,
      resetTime: window.resetTime,
    }
  }
}

// Rate limiters for different operations
export const loginRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 5 }) // 5 attempts per 15 minutes
export const transferRateLimit = rateLimit({ windowMs: 60 * 60 * 1000, maxRequests: 10 }) // 10 transfers per hour
export const otpRateLimit = rateLimit({ windowMs: 5 * 60 * 1000, maxRequests: 3 }) // 3 OTP requests per 5 minutes

export async function verifyPIN(userId: string, pin: string): Promise<boolean> {
  try {
    await dbConnect()
    const user = await User.findById(userId)
    if (!user) return false

    return bcrypt.compare(pin, user.bankInfo.security.pin)
  } catch (error) {
    console.error("PIN verification error:", error)
    return false
  }
}

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIP) {
    return realIP
  }

  return "unknown"
}

export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return ""

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .substring(0, 1000) // Limit length
}

export function validateAmount(amount: number): { valid: boolean; error?: string } {
  if (typeof amount !== "number" || isNaN(amount)) {
    return { valid: false, error: "Amount must be a valid number" }
  }

  if (amount <= 0) {
    return { valid: false, error: "Amount must be greater than zero" }
  }

  if (amount > 1000000) {
    return { valid: false, error: "Amount exceeds maximum limit" }
  }

  return { valid: true }
}

export function validateAccountNumber(accountNumber: string): { valid: boolean; error?: string } {
  if (typeof accountNumber !== "string") {
    return { valid: false, error: "Account number must be a string" }
  }

  const cleaned = accountNumber.replace(/\s/g, "")

  if (!/^\d{10,20}$/.test(cleaned)) {
    return { valid: false, error: "Account number must be 10-20 digits" }
  }

  return { valid: true }
}

// Audit logging
export interface AuditLog {
  userId: string
  action: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  timestamp: Date
  success: boolean
}

const auditLogs: AuditLog[] = [] // In production, store in database

export function logAuditEvent(log: Omit<AuditLog, "timestamp">) {
  auditLogs.push({
    ...log,
    timestamp: new Date(),
  })

  // In production, save to database
  console.log("Audit Log:", log)
}

export function getAuditLogs(userId?: string, limit = 100): AuditLog[] {
  let logs = auditLogs

  if (userId) {
    logs = logs.filter((log) => log.userId === userId)
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit)
}

// Session security
export function generateSecureToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Account lockout tracking
const lockoutStore = new Map<string, { attempts: number; lockedUntil?: number }>()

export function trackFailedLogin(identifier: string): {
  locked: boolean
  attemptsRemaining: number
  lockedUntil?: number
} {
  const maxAttempts = 5
  const lockoutDuration = 30 * 60 * 1000 // 30 minutes

  const record = lockoutStore.get(identifier) || { attempts: 0 }

  // Check if currently locked
  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    return {
      locked: true,
      attemptsRemaining: 0,
      lockedUntil: record.lockedUntil,
    }
  }

  // Reset if lockout period has passed
  if (record.lockedUntil && Date.now() >= record.lockedUntil) {
    record.attempts = 0
    record.lockedUntil = undefined
  }

  record.attempts++

  if (record.attempts >= maxAttempts) {
    record.lockedUntil = Date.now() + lockoutDuration
    lockoutStore.set(identifier, record)
    return {
      locked: true,
      attemptsRemaining: 0,
      lockedUntil: record.lockedUntil,
    }
  }

  lockoutStore.set(identifier, record)
  return {
    locked: false,
    attemptsRemaining: maxAttempts - record.attempts,
  }
}

export function clearFailedLogins(identifier: string): void {
  lockoutStore.delete(identifier)
}

// Transaction limits
export interface TransactionLimits {
  dailyLimit: number
  monthlyLimit: number
  perTransactionLimit: number
}

export const defaultLimits: TransactionLimits = {
  dailyLimit: 50000000,
  monthlyLimit: 50000000,
  perTransactionLimit: 100025000,
}

export async function checkTransactionLimits(
  userId: string,
  amount: number,
  currency: string,
): Promise<{ allowed: boolean; error?: string }> {
  // In production, fetch user's actual limits and transaction history
  const limits = defaultLimits

  if (amount > limits.perTransactionLimit) {
    return {
      allowed: false,
      error: `Transaction amount exceeds per-transaction limit of ${limits.perTransactionLimit}`,
    }
  }

  // Here you would check daily and monthly limits against actual transaction history
  // For now, we'll just check the per-transaction limit

  return { allowed: true }
}
