"use client"

import { useState } from "react"
import { Eye, EyeOff, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getVendorColor, maskCardNumber, getVendorLogo } from "@/lib/utils/card"
import type { ICard } from "@/models/Card"
import Image from "next/image"
import { motion } from "framer-motion"

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active": return { label: "Live Gateway", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]" }
      case "pending": return { label: "Pending Auth", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" }
      case "blocked": return { label: "Circuit Broken", color: "text-red-500 bg-red-500/10 border-red-500/20 animate-pulse" }
      case "rejected": return { label: "Auth Denied", color: "text-red-400 bg-red-500/10 border-red-500/20" }
      default: return { label: status, color: "text-slate-500 bg-white/5" }
    }
  }

  const statusConfig = getStatusConfig(card.status)
  const vendorLogo = getVendorLogo(card.vendor)

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 relative group">
      {/* Glossy Overlay for the whole container */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

      {/* Card Front */}
      <div
        className="relative rounded-[2rem] p-8 md:p-10 text-white shadow-2xl min-h-[260px] md:min-h-[300px] flex flex-col justify-between overflow-hidden border border-white/20 transition-all duration-500 group-hover:scale-[1.01]"
        style={{ background: `linear-gradient(135deg, ${getVendorColor(card.vendor)} 0%, #000000 100%)` }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/40 rounded-full -ml-16 -mb-16 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-start relative z-10">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">PrimeHarbor Bank <span className="text-emerald-500 italic">Premium</span></p>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white/90">
              {card.cardType} <span className="opacity-40 italic">System</span>
            </h3>
          </div>
          <div className="w-16 h-10 relative opacity-90 grayscale brightness-200 group-hover:grayscale-0 transition-all">
            <Image src={vendorLogo.src} alt={vendorLogo.alt} fill style={{ objectFit: "contain" }} />
          </div>
        </div>

        {/* Chip & NFC Icon */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="w-14 h-10 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-lg shadow-inner flex flex-col gap-1 p-1.5 overflow-hidden">
            <div className="flex gap-1 h-full"><div className="w-full h-full border border-black/10 rounded-sm"></div><div className="w-full h-full border border-black/10 rounded-sm"></div></div>
            <div className="flex gap-1 h-full"><div className="w-full h-full border border-black/10 rounded-sm"></div><div className="w-full h-full border border-black/10 rounded-sm"></div></div>
          </div>
          <div className="opacity-30 group-hover:opacity-60 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M2 9a10 10 0 0 1 20 0" /><path d="M5 12a7 7 0 0 1 14 0" /><path d="M8 15a4 4 0 0 1 8 0" /><circle cx="12" cy="18" r="1" /></svg>
          </div>
        </div>

        {/* Card Number */}
        <div className="relative z-10 mt-4">
          <div className="flex items-center gap-4">
            <div className="text-2xl md:text-3xl font-mono font-black tracking-[0.2em] text-white overflow-hidden whitespace-nowrap">
              {showCardNumber ? card.cardNumber : maskCardNumber(card.cardNumber)}
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/10"
                onClick={() => setShowCardNumber(!showCardNumber)}
              >
                {showCardNumber ? <EyeOff size={14} /> : <Eye size={14} />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/10"
                onClick={handleCopyCardNumber}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Details Footer */}
        <div className="flex justify-between items-end relative z-10 pt-4">
          <div className="space-y-1">
            <div className="text-[8px] font-black uppercase text-white/40 tracking-widest">Master Ident</div>
            <div className="text-sm md:text-base font-black text-white uppercase tracking-tight">{card.cardHolderName}</div>
          </div>
          <div className="text-right space-y-1">
            <div className="text-[8px] font-black uppercase text-white/40 tracking-widest">Expiry Period</div>
            <div className="text-sm md:text-base font-black text-white font-mono">{card.expiry}</div>
          </div>
        </div>
      </div>

      {/* Extended Details Area */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Card Back / CVV Section */}
          <div className="border border-white/5 bg-white/[0.03] backdrop-blur-md rounded-[2rem] p-8 md:p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verification Node</p>
                    <h4 className="text-white font-black text-lg">Master CVV Control</h4>
                  </div>
                  <div className="px-5 py-2 bg-black/40 border border-white/10 rounded-2xl flex items-center gap-4">
                    <span className="font-mono text-2xl font-black text-white tracking-widest">
                      {showCVV ? card.cvv : "••••"}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl"
                      onClick={() => setShowCVV(!showCVV)}
                    >
                      {showCVV ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-6">
                <div className="space-y-2 p-5 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Daily Flux</p>
                  <p className="text-xl font-black text-white lowercase">${card.dailyLimit?.toLocaleString()}</p>
                </div>
                <div className="space-y-2 p-5 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Monthly Band</p>
                  <p className="text-xl font-black text-white lowercase">${card.monthlyLimit?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
