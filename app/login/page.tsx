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
import { Loader2 } from "lucide-react"

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
        setError(data.message || "Login failed")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
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
        if (authUser.roles.includes("super-admin")) {
          window.location.href = "/admin"
        } else if (authUser.roles.includes("administrator")) {
          window.location.href = "/admin"
        } else {
          window.location.href = "/dashboard"
        }
      } else {
        setPinError(data.message || "Invalid PIN")
      }
    } catch (error) {
      setPinError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1650&q=80')",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Login Card */}
      <Card className="relative w-full max-w-md mx-auto animate-fade-in-up bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white tracking-tight">Corporate Bank</CardTitle>
          <CardDescription className="text-white">Sign in to your secure account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-100">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-white/80 focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-100">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="bg-white/80 focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 shadow-md"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>

            {/* Register Link */}
            <div className="text-center text-sm text-gray-200">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Register here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
        <DialogContent className="bg-white/95 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle>Security PIN Verification</DialogTitle>
            <DialogDescription>Enter your security PIN to complete login</DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePinVerify} className="space-y-4">
            {pinError && (
              <Alert variant="destructive">
                <AlertDescription>{pinError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="pin">Security PIN (4 digits)</Label>
              <Input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.slice(0, 4))}
                maxLength={4}
                disabled={isLoading}
                placeholder="••••"
                className="text-center text-2xl tracking-widest"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || pin.length !== 4}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify PIN
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
