export function generateAccountNumber(): string {
  const prefix = "104"
  const suffix = Math.floor(1000000 + Math.random() * 9000000).toString()
  return prefix + suffix
}

export function generateUserCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function generateTxRef(): string {
  const timestamp = Date.now().toString(16)
  const random = Math.random().toString(36).substring(2, 15)
  return timestamp + random
}

export function formatCurrency(amount: number, currency = "USD"): string {
  const symbols = {
    USD: "$",
    GBP: "£",
    NGN: "₦",
    EUR: "€",
  }

  return `${symbols[currency] || currency} ${amount.toLocaleString()}`
}

export function calculateTransferCharge(amount: number, region: "local" | "international"): number {
  if (region === "local") return 0
  return Math.max(amount * 0.01, 10) // 1% with minimum $10 for international
}
