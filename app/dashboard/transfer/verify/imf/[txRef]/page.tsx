"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Banknote, ArrowLeft } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

export default function IMFVerificationPage() {
  const [imfCode, setImfCode] = useState("")
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
    if (!imfCode.trim()) {
      setError("Please enter the IMF code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/transfers/verify-imf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txRef, imfCode: imfCode.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsVerified(true)
        setTimeout(() => {
          router.push(`/dashboard/transfer/verify/esi/${txRef}`)
        }, 1200)
      } else {
        setError(data.message || "Invalid IMF code")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 animate-fadeIn">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/transfer/verify/cot/${txRef}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Transfer Verification</h1>
            <p className="text-muted-foreground">Step 2 of 3: Enter IMF Code</p>
          </div>
        </div>

        {transferDetails && (
          <Card className="max-w-md mx-auto bg-muted/50 shadow-md animate-slideUp">
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

        <Card className="max-w-lg mx-auto shadow-lg animate-slideUp">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Banknote className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>IMF Code Verification</CardTitle>
                <CardDescription>Please enter your International Monetary Fund (IMF) code to continue</CardDescription>
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
                <Label htmlFor="imfCode">IMF Code</Label>
                <Input
                  id="imfCode"
                  type="text"
                  value={imfCode}
                  onChange={(e) => setImfCode(e.target.value)}
                  placeholder="Enter your IMF code"
                  disabled={isLoading || isVerified}
                  className="text-center text-lg font-mono tracking-wider"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={isLoading || isVerified}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isVerified ? "Verified ✓" : "Verify IMF Code"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} disabled={isVerified}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="flex justify-center animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              ✓
            </div>
            <div className="w-16 h-0.5 bg-green-500" />
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
              75%
            </div>
            <div className="w-16 h-0.5 " />
            <div className="w-8 h-8  text-white rounded-full flex items-center justify-center text-sm">100%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
