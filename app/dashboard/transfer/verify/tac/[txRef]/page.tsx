"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

export default function TACVerificationPage() {
  const [tacCode, setTacCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const [transferDetails, setTransferDetails] = useState<any>(null)
  const router = useRouter()
  const params = useParams()
  const txRef = params.txRef as string

  useEffect(() => {
    fetchTransferDetails()
  }, [txRef])

  const fetchTransferDetails = async () => {
    try {
      const response = await fetch(`/api/transfers/${txRef}`)
      if (response.ok) {
        const data = await response.json()
        setTransferDetails(data.transfer)
      } else {
        console.error("Failed to fetch transfer details")
      }
    } catch (error) {
      console.error("Failed to fetch transfer details:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tacCode.trim()) {
      setError("Please enter the final authorization key")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/transfers/verify-tac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txRef, tacCode: tacCode.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsVerified(true)
        setTimeout(() => {
          router.push(`/dashboard/receipt/${txRef}`)
        }, 1200)
      } else {
        setError(data.message || "Invalid authorization key")
      }
    } catch (error) {
      setError("Network error in final settlement protocol.")
    } finally {
      setIsLoading(false)
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="min-h-screen bg-[#001c10] flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-2xl space-y-10 relative z-10">

        {/* Header Section */}
        <motion.div {...fadeInUp} className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <Button variant="ghost" onClick={() => router.push(`/dashboard/transfer/verify/tax/${txRef}`)} className="h-14 w-14 rounded-2xl border border-white/5 bg-white/5 text-white hover:bg-white/10 group px-0 shrink-0">
            <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-widest text-[10px] mb-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 w-fit mx-auto md:mx-0 rounded-full">
              <CheckCircle className="h-3 w-3" />
              Identity Verification
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter lowercase">
              Final <span className="text-slate-500 italic">Step</span>
            </h1>
            <p className="text-slate-400 font-medium">Stage 06: Transfer Authorization</p>
          </div>
        </motion.div>

        {/* Transfer Summary Artifact */}
        {transferDetails && (
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <Card className="border border-white/10 shadow-3xl bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] overflow-hidden group">
              <div className="p-8 border-b border-white/5 bg-emerald-500/5 cursor-default">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Transfer Summary</p>
              </div>
              <CardContent className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Amount</p>
                  <p className="text-2xl font-black text-white tracking-tighter">
                    {transferDetails.currency} {transferDetails.amount?.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Beneficiary</p>
                  <p className="text-lg font-bold text-slate-300 lowercase truncate">{transferDetails.accountHolder}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Beneficiary Bank</p>
                  <p className="text-lg font-bold text-slate-300 lowercase truncate">{transferDetails.bankName}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* TAC Verification Card */}
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
          <Card className="border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-white/[0.04] backdrop-blur-2xl rounded-[3rem] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
            <CardHeader className="p-10 pb-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-20 w-20 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-2xl relative group overflow-hidden">
                  <CheckCircle className="h-10 w-10 relative z-10 group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-black text-white lowercase tracking-tighter">Authorization <span className="text-emerald-500 italic">Code</span></CardTitle>
                  <CardDescription className="text-slate-500 font-medium max-w-sm mx-auto">
                    Final step: Provide your Transfer Authorization Code (TAC) to complete the transfer.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 pt-0">
              <form onSubmit={handleSubmit} className="space-y-10">
                {error && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Alert className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-6">
                      <AlertDescription className="text-center font-black lowercase text-lg">{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <div className="space-y-4 text-center">
                  <Label htmlFor="tacCode" className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Enter Authorization Code</Label>
                  <Input
                    id="tacCode"
                    type="text"
                    value={tacCode}
                    onChange={(e) => setTacCode(e.target.value)}
                    placeholder="......"
                    disabled={isLoading || isVerified}
                    className="h-24 text-center text-4xl font-black tracking-[0.5em] bg-black/40 border-white/10 rounded-[2rem] shadow-inner focus:ring-emerald-500 placeholder:text-white/5 text-emerald-500 transition-all focus:border-emerald-500/50"
                  />
                  <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest italic leading-relaxed">
                    TAC authorization completes the secure transfer process.
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-[#001c10] font-black h-16 rounded-2xl shadow-xl shadow-emerald-500/20 uppercase tracking-tighter text-lg transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                    disabled={isLoading || isVerified}
                  >
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : isVerified ? (
                      "Authorization Successful ✓"
                    ) : (
                      "Complete Transfer"
                    )}
                  </Button>
                  <Button type="button" variant="ghost" className="h-16 px-8 rounded-2xl border border-white/10 bg-white/5 text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all" onClick={() => router.push("/dashboard")} disabled={isVerified}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Stepper Artifact */}
        <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="pt-6 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-white/5"></div>
          <div className="flex items-center justify-between px-2">
            {[
              { label: "Initiate", percent: "✓", active: false, done: true },
              { label: "Processing", percent: "✓", active: false, done: true },
              { label: "Verify", percent: "✓", active: false, done: true },
              { label: "Complete", percent: "99%", active: true, done: false },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 group">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center text-[10px] font-black border transition-all duration-500",
                  step.active ? "bg-emerald-500 border-emerald-500 text-[#001c10] shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-110" :
                    step.done ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-500" :
                      "bg-black/40 border-white/10 text-slate-700"
                )}>
                  {step.percent}
                </div>
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-widest transition-colors",
                  step.active ? "text-emerald-500" :
                    step.done ? "text-emerald-500/50" :
                      "text-slate-800"
                )}>{step.label}</span>
              </div>
            ))}
          </div>
          {/* Visual connecting lines */}
          <div className="absolute top-[26px] left-[15%] right-[15%] h-px bg-white/5 -z-10"></div>
        </motion.div>
      </div>
    </div>
  )
}
