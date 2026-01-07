// lib/utils/card.ts
export function generateCardNumber(vendor: string): string {
  const prefixes = {
    mastercard: "5",
    visacard: "4",
    amex: "3"
  }
  
  const prefix = prefixes[vendor as keyof typeof prefixes] || "4"
  let cardNumber = prefix
  
  // Generate remaining digits (15 digits for Visa/MasterCard, 14 for Amex)
  const digitsNeeded = vendor === "amex" ? 14 : 15
  for (let i = 0; i < digitsNeeded; i++) {
    cardNumber += Math.floor(Math.random() * 10)
  }
  
  return cardNumber.replace(/(.{4})/g, '$1 ').trim()
}

export function generateCVV(): string {
  return Math.floor(100 + Math.random() * 900).toString()
}

export function generateExpiryDate(years: number = 4): string {
  const date = new Date()
  date.setFullYear(date.getFullYear() + years)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString().slice(-2)
  return `${month}/${year}`
}

export function maskCardNumber(cardNumber: string): string {
  return cardNumber?.replace(/(\d{4}\s\d{4}\s\d{4}\s)(\d{4})/, '$1****')
}

export function getVendorIcon(vendor: string): string {
  const icons = {
    mastercard: "💳",
    visacard: "💳",
    amex: "💳"
  }
  return icons[vendor as keyof typeof icons] || "💳"
}

export function getVendorColor(vendor: string): string {
  const colors = {
    mastercard: "linear-gradient(135deg, #FF5F6D, #FFC371)",
    visacard: "linear-gradient(135deg, #1A2980, #26D0CE)",
    amex: "linear-gradient(135deg, #005C97, #363795)"
  }
  return colors[vendor as keyof typeof colors] || "linear-gradient(135deg, #667eea, #764ba2)"
}

export function getVendorLogo(vendor: string): { src: string; alt: string } {
  const logos = {
    mastercard: {
      src: "/placeholder-logo.png",
      alt: "Mastercard",
    },
    visacard: {
      src: "/placeholder-logo.png",
      alt: "Visa",
    },
    amex: {
      src: "/placeholder-logo.png",
      alt: "American Express",
    },
  }
  return logos[vendor as keyof typeof logos] || { src: "/placeholder-logo.png", alt: "Vendor Logo" }
}

