"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, ShieldCheck, Lock, Mail, ArrowRight, Fingerprint, Cpu, Globe } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const [showPinModal, setShowPinModal] = useState(false)
  const [pin, setPin] = useState("")
  const [pinError, setPinError] = useState("")
  const [authUser, setAuthUser] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok) {
        setAuthUser(data.user)
        setShowPinModal(true)
      } else {
        setError(data.message || "Credential mismatch. Access denied.")
      }
    } catch (error) {
      setError("Synchronisation failure. Please retry.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePinVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setPinError("")

    try {
      const response = await fetch("/api/auth/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok) {
        if (authUser.roles.includes("super-admin") || authUser.roles.includes("administrator")) {
          window.location.href = "/admin"
        } else {
          window.location.href = "/dashboard"
        }
      } else {
        setPinError(data.message || "Invalid security cipher.")
      }
    } catch (error) {
      setPinError("Auth bridge failure. Retry protocol.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#000d07] overflow-hidden selection:bg-emerald-500/30">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070"
          alt="Background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000d07] via-transparent to-[#000d07]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#000d07] via-transparent to-[#000d07]" />

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] transition-all duration-1000" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-lg px-6 py-12">
        {/* Logo Section */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 mb-2 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <ShieldCheck className="w-10 h-10 text-emerald-500 relative z-10 transform group-hover:scale-110 transition-transform" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              PRIME<span className="text-emerald-500 font-medium">HARBOR</span>
            </h1>
            <p className="text-emerald-500/50 font-black text-[10px] uppercase tracking-[0.4em]">Integrated Banking Mainframe</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-white/[0.02] backdrop-blur-2xl border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

          <CardHeader className="space-y-1 p-8 pb-0 text-center">
            <CardTitle className="text-2xl font-black text-white uppercase tracking-tight">Identity Gateway</CardTitle>
            <CardDescription className="text-slate-500 font-medium text-sm italic">Initialize secure uplink to your asset cluster.</CardDescription>
          </CardHeader>

          <CardContent className="p-8 pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="bg-red-500/10 border-red-500/20 text-red-500 rounded-2xl py-3 border italic font-bold text-xs">
                  <AlertDescription className="flex items-center gap-2">
                    <Lock className="w-4 h-4" /> {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Terminal ID (Email)</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="node_identifier@primeharborbnk.online"
                      disabled={isLoading}
                      className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all font-medium placeholder:text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Access Cipher</Label>
                    <Link href="/forgot-password" className="text-[9px] font-black uppercase tracking-widest text-emerald-500/50 hover:text-emerald-500 transition-colors">
                      Recover Key
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      disabled={isLoading}
                      className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all font-medium placeholder:text-slate-700"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-[#001c10] font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-emerald-500/10 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2 relative z-10">
                    Initialize Access <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>

              <div className="pt-4 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  New Node?{" "}
                  <Link href="/register" className="text-emerald-500 hover:underline">
                    Register Identity
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3 text-slate-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">AES-256 Meta</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3 text-slate-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Global Cluster</span>
          </div>
        </div>
      </div>

      {/* PIN Verification Modal */}
      <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
        <DialogContent className="bg-[#001c10] border-emerald-500/20 rounded-[3rem] p-10 max-w-md overflow-hidden relative shadow-3xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <DialogHeader className="text-center relative z-10 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2">
              <Fingerprint className="w-8 h-8 text-emerald-500" />
            </div>
            <DialogTitle className="text-3xl font-black text-white italic tracking-tight">Security Signature</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">Input your 4-digit protocol PIN to finalize access.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePinVerify} className="space-y-8 mt-6 relative z-10">
            {pinError && (
              <Alert className="bg-red-500/10 border-red-500/20 text-red-500 rounded-2xl py-3 border italic font-bold text-xs">
                <AlertDescription className="flex items-center justify-center gap-2">
                  {pinError}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Label htmlFor="pin" className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center block">Access PIN</Label>
              <Input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.slice(0, 4).replace(/\D/g, ""))}
                maxLength={4}
                disabled={isLoading}
                autoFocus
                placeholder="0000"
                className="h-20 text-center text-4xl font-black tracking-[0.5em] bg-white/5 border-white/10 rounded-2xl text-white focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all placeholder:text-white/5"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || pin.length !== 4}
              className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-[#001c10] font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-emerald-500/20"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity Signature"}
            </Button>

            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] text-center">
              User Email: <span className="text-emerald-500/50">{authUser?.email?.toUpperCase()}</span>
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
