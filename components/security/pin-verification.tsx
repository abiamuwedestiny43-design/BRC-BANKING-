"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ShieldCheck, Fingerprint, Lock, Cpu, Activity } from "lucide-react"

interface PinVerificationProps {
  isOpen: boolean
  onClose: () => void
  onVerify: (pin: string) => Promise<boolean>
  title?: string
  description?: string
}

export default function PinVerification({
  isOpen,
  onClose,
  onVerify,
  title = "Security Signature Required",
  description = "Please enter your 4-digit protocol PIN to authorize this asset migration.",
}: PinVerificationProps) {
  const [pin, setPin] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (pin.length !== 4) {
      setError("Signature Incomplete: PIN must be 4 digits")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const isValid = await onVerify(pin)

      if (isValid) {
        setPin("")
        setAttempts(0)
        onClose()
      } else {
        const remaining = 2 - attempts
        setAttempts((prev) => prev + 1)

        if (remaining > 0) {
          setError(`Invalid Signature. ${remaining} attempts remaining before lockdown.`)
        } else {
          setError("Protocol Lockdown: Too many failed attempts.")
          setTimeout(() => {
            onClose()
          }, 3000)
        }
        setPin("")
      }
    } catch (error) {
      setError("Node Sync Failed: Verification process interrupted.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 4)
    setPin(numericValue)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#001c10] border-emerald-500/20 rounded-[3rem] p-0 max-w-md overflow-hidden shadow-3xl">
        {/* Aesthetic Header Decoration */}
        <div className="h-2 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        <div className="p-10 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <DialogHeader className="text-center relative z-10 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2 animate-pulse">
              <Fingerprint className="w-8 h-8 text-emerald-500" />
            </div>
            <DialogTitle className="text-3xl font-black text-white italic tracking-tight uppercase">
              {title}
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs mx-auto">
              {description}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-8 mt-10 relative z-10">
            {error && (
              <Alert className="bg-red-500/10 border-red-500/20 text-red-500 rounded-2xl py-3 border italic font-black text-[10px] uppercase tracking-widest text-center">
                <AlertDescription className="flex items-center justify-center gap-2">
                  <Activity className="w-4 h-4 opacity-50" /> {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                  <Cpu className="w-3 h-3 text-emerald-500/50" />
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Encrypted Local Input</span>
                </div>
              </div>

              <div className="relative group">
                <Input
                  id="pin"
                  type="password"
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value)}
                  placeholder="••••"
                  maxLength={4}
                  className="h-24 text-center text-4xl font-black tracking-[1em] bg-white/5 border-white/10 rounded-2xl text-white focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all placeholder:text-white/5"
                  disabled={isLoading || attempts >= 3}
                  autoFocus
                />
                <div className="absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-[#001c10] font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl shadow-xl shadow-emerald-500/20 group relative overflow-hidden"
                disabled={isLoading || pin.length !== 4 || attempts >= 3}
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Verify Signature <ShieldCheck className="w-4 h-4" />
                  </span>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isLoading}
                className="w-full h-12 text-slate-500 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[9px] rounded-xl"
              >
                Abort Migration
              </Button>
            </div>
          </form>

          {/* Footer Cipher */}
          <div className="mt-8 flex items-center justify-center gap-4 opacity-30">
            <div className="w-1 h-1 rounded-full bg-emerald-500" />
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.5em]">Auth0_HBBank_v4.2</span>
            <div className="w-1 h-1 rounded-full bg-emerald-500" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
