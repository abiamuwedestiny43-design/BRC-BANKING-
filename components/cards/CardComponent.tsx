"use client"

import { useState } from "react"
import { Eye, EyeOff, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getVendorColor, maskCardNumber } from "@/lib/utils/card"
import type { ICard } from "@/models/Card"
import Image from "next/image"

interface CardComponentProps {
  card: ICard
  showDetails?: boolean
}

export default function CardComponent({ card, showDetails = false }: CardComponentProps) {
  const [showCardNumber, setShowCardNumber] = useState(false)
  const [showCVV, setShowCVV] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyCardNumber = async () => {
    await navigator.clipboard.writeText(card.cardNumber.replace(/\s/g, ""))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "blocked":
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getVendorLogo = (vendor: string) => {
    switch (vendor) {
      case "visacard":
        return {
          src: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
          alt: "Visa"
        }
      case "mastercard":
        return {
          src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
          alt: "MasterCard"
        }
      case "amex":
        return {
          src: "https://tse2.mm.bing.net/th/id/OIP.9gd9xMcF-p3JI5AGq2o2XQHaEk?rs=1&pid=ImgDetMain&o=7&rm=3",
          alt: "American Express"
        }
      default:
        return {
          src: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
          alt: "Card"
        }
    }
  }

  const vendorLogo = getVendorLogo(card.vendor)

  return (
    <div className="relative w-full max-w-sm mx-auto border border-green-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
      {/* Card Front */}
      <div
        className="relative rounded-2xl p-6 text-white shadow-2xl min-h-[210px] backdrop-blur-sm border border-white/20"
        style={{ background: getVendorColor(card.vendor) }}
      >
        {/* Vendor Logo */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="text-2xl font-bold">Corporate Bank</div>
            <div className="text-sm opacity-80">
              {card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1)}
            </div>
          </div>
          <div className="w-12 h-12 relative">
            <Image src={vendorLogo.src} alt={vendorLogo.alt} fill style={{ objectFit: "contain" }} />
          </div>
        </div>

        {/* Card Number */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <div className="text-xl font-mono tracking-wider">
              {showCardNumber ? card.cardNumber : maskCardNumber(card.cardNumber)}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white/80 hover:text-white"
              onClick={() => setShowCardNumber(!showCardNumber)}
            >
              {showCardNumber ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white/80 hover:text-white"
              onClick={handleCopyCardNumber}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </Button>
          </div>
        </div>

        {/* Card Holder and Expiry */}
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs opacity-80">Card Holder</div>
            <div className="text-sm font-medium">{card.cardHolderName}</div>
          </div>
          <div>
            <div className="text-xs opacity-80">Expires</div>
            <div className="text-sm font-medium">{card.expiry}</div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-1 right-4">
          <Badge className={getStatusColor(card.status)}>
            {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Card Back */}
      {showDetails && (
        <div
          className="relative rounded-2xl p-6 text-white shadow-2xl min-h-[210px] mt-4 backdrop-blur-sm border border-white/20"
          style={{ background: getVendorColor(card.vendor) }}
        >
          <div className="h-8 bg-black/20 rounded-lg mb-6"></div>
          <div className="bg-white/10 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm">CVV</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono">{showCVV ? card.cvv : "•••"}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-white/80 hover:text-white"
                  onClick={() => setShowCVV(!showCVV)}
                >
                  {showCVV ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center text-sm opacity-80">
            {vendorLogo.alt}
          </div>
        </div>
      )}

      {/* Card Limits */}
      {showDetails && (
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-600">Daily Limit</div>
            <div className="font-semibold">${card.dailyLimit?.toLocaleString()}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-600">Monthly Limit</div>
            <div className="font-semibold">${card.monthlyLimit?.toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  )
}
