"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, ArrowLeft } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

export default function ESIVerificationPage() {
  const [esiCode, setEsiCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [transferDetails, setTransferDetails] = useState<any>(null)
  const [isVerified, setIsVerified] = useState(false)
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
      }
    } catch {}
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!esiCode.trim()) {
      setError("Please enter the ESI code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/transfers/verify-esi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txRef, esiCode: esiCode.trim() }),
      })
      const data = await response.json()
      if (response.ok) {
        setIsVerified(true)
        router.push(`/dashboard/transfer/verify/dco/${txRef}`)
      } else {
        setError(data.message || "Invalid ESI code")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/transfer/verify/imf/${txRef}`)}
            className="flex items-center gap-2"
            disabled={isVerified}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Transfer Verification</h1>
            <p className="text-muted-foreground">Step 3 of 6: Enter ESI Code</p>
          </div>
        </div>

        {transferDetails && (
          <Card className="max-w-md mx-auto bg-muted/50 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Transfer Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold">
                  {transferDetails.currency} {transferDetails.amount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">To:</span>
                <span className="font-semibold">{transferDetails.accountHolder}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank:</span>
                <span className="font-semibold">{transferDetails.bankName}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="max-w-lg mx-auto shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Electronic Security Identification (ESI) Code Verification</CardTitle>
                <CardDescription>Enter your ESI code to continue</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="esiCode">ESI Code</Label>
                <Input
                  id="esiCode"
                  type="text"
                  value={esiCode}
                  onChange={(e) => setEsiCode(e.target.value)}
                  placeholder="Enter your ESI code"
                  disabled={isLoading || isVerified}
                  className="text-center text-lg font-mono tracking-wider"
                />
                <p className="text-xs text-muted-foreground">
                  ESI helps confirm the security status required for international transfers.
                </p>
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={isLoading || isVerified}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify ESI Code
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} disabled={isVerified}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
