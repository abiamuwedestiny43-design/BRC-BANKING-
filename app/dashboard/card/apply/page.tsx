// app/dashboard/cards/apply/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const cardOptions = [
  {
    type: "debit" as const,
    vendor: "visacard" as const,
    name: "Visa Debit Card",
    description: "Perfect for everyday purchases with direct access to your funds",
    features: ["No annual fees", "Worldwide acceptance", "Contactless payments", "ATM withdrawals"]
  },
  {
    type: "debit" as const,
    vendor: "mastercard" as const,
    name: "MasterCard Debit",
    description: "Global debit card with enhanced security features",
    features: ["Zero liability protection", "Mobile wallet compatible", "Purchase protection", "Global acceptance"]
  },
  {
    type: "credit" as const,
    vendor: "visacard" as const,
    name: "Visa Credit Card",
    description: "Build credit with flexible payment options",
    features: ["Credit limit up to $10,000", "Cashback rewards", "Travel insurance", "24/7 customer support"]
  },
  {
    type: "credit" as const,
    vendor: "amex" as const,
    name: "American Express",
    description: "Premium credit card with exclusive benefits",
    features: ["Premium rewards program", "Airport lounge access", "Concierge service", "Travel benefits"]
  }
]

export default function ApplyForCardPage() {
  const router = useRouter()
  const [selectedCard, setSelectedCard] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleApply = async () => {
    if (!selectedCard) {
      setMessage({ type: 'error', text: 'Please select a card type' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const [cardType, vendor] = selectedCard.split('-')

      const response = await fetch('/api/cards/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardType,
          vendor
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Card application submitted successfully! You will receive an email confirmation shortly.'
        })
        setTimeout(() => {
          router.push('/dashboard/card')
        }, 2000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit application' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while submitting your application' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#001c10] w-full p-4 md:p-8 lg:p-12 pt-24 md:pt-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-widest text-[10px] mb-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 w-fit rounded-full mx-auto md:mx-0">
            <CreditCard className="h-3 w-3" />
            Asset Management
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            Provision <span className="text-slate-500 italic">Hardware</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg">Select a functional payment vector optimized for your operational requirements.</p>
        </div>

        {message && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Alert className={cn(
              "border-none shadow-2xl backdrop-blur-md rounded-2xl p-6",
              message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
            )}>
              {message.type === 'success' ? (
                <CheckCircle className="h-6 w-6 text-emerald-500" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-500" />
              )}
              <AlertDescription className={cn(
                "font-bold text-base ml-2",
                message.type === 'success' ? 'text-emerald-400' : 'text-red-400'
              )}>
                {message.text}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <RadioGroup value={selectedCard} onValueChange={setSelectedCard} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          {cardOptions.map((card, index) => (
            <div key={index} className="relative group">
              <RadioGroupItem
                value={`${card.type}-${card.vendor}`}
                id={`card-${index}`}
                className="sr-only"
              />
              <Label
                htmlFor={`card-${index}`}
                className={cn(
                  "block cursor-pointer transition-all duration-500 rounded-[2.5rem] border p-8 space-y-6 relative overflow-hidden",
                  selectedCard === `${card.type}-${card.vendor}`
                    ? 'bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)] ring-1 ring-emerald-500/20'
                    : 'bg-white/[0.03] border-white/5 shadow-2xl hover:bg-white/[0.05]'
                )}
              >
                {/* Selected Indicator */}
                {selectedCard === `${card.type}-${card.vendor}` && (
                  <div className="absolute top-6 right-6 h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 z-10">
                    <CheckCircle className="h-5 w-5 text-[#001c10]" />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-400">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
                      card.type === 'debit'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    )}>
                      {card.type} Engine
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white leading-none tracking-tight">{card.name}</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{card.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-6 border-t border-white/5">
                  {card.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <span className="text-[10px] text-emerald-500">✓</span>
                      </div>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter opacity-80">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Gloss Effect */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-1000"></div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="mt-12 flex flex-col md:flex-row gap-4 pt-10 border-t border-white/5">
          <Button
            variant="ghost"
            className="h-16 flex-1 rounded-2xl border border-white/10 bg-white/5 text-slate-400 font-black hover:text-white hover:bg-white/10 transition-all"
            onClick={() => router.back()}
          >
            Terminal Reset
          </Button>
          <Button
            onClick={handleApply}
            disabled={isSubmitting || !selectedCard}
            className="h-16 flex-[2] bg-emerald-500 hover:bg-emerald-400 text-[#001c10] font-black rounded-2xl shadow-xl shadow-emerald-500/20 text-lg uppercase tracking-tight transition-transform hover:scale-[1.02]"
          >
            {isSubmitting ? 'Syncing Authorization...' : 'Deploy Gateway'}
          </Button>
        </div>
      </div>
    </div>
  )
}
