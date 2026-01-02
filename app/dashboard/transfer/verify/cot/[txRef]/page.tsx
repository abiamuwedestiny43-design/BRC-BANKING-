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

export default function COTVerificationPage() {
  const [cotCode, setCotCode] = useState("")
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
      } else {
        console.error("Failed to fetch transfer details")
      }
    } catch (error) {
      console.error("Failed to fetch transfer details:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cotCode.trim()) {
      setError("Please enter the COT code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/transfers/verify-cot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txRef,
          cotCode: cotCode.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsVerified(true)
        router.push(`/dashboard/transfer/verify/imf/${txRef}`)
      } else {
        setError(data.message || "Invalid COT code")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4 py-10 animate-fade-in">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8 animate-slide-down">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Transfer Verification</h1>
          <p className="text-muted-foreground">Step 1 of 3: Enter COT Code</p>
        </div>
      </div>

      {/* Transfer Summary */}
      {transferDetails && (
        <Card className="w-full max-w-md shadow-md rounded-2xl mb-8 transform transition duration-500 hover:scale-[1.02] animate-fade-in-up">
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

      {/* COT Verification Card */}
      <Card className="w-full max-w-lg shadow-lg rounded-2xl animate-fade-in-up delay-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>COT Code Verification</CardTitle>
              <CardDescription>
                Please enter your Certificate of Transfer (COT) code to proceed with the international transfer
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="animate-shake">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="cotCode">COT Code</Label>
              <Input
                id="cotCode"
                type="text"
                value={cotCode}
                onChange={(e) => setCotCode(e.target.value)}
                placeholder="Enter your COT code"
                disabled={isLoading || isVerified}
                className="text-center text-lg font-mono tracking-wider focus:ring-green-500"
              />
              <p className="text-sm text-muted-foreground">
                The COT code is required for international transfers above certain thresholds
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 transition-all"
                disabled={isLoading || isVerified}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify COT Code
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} disabled={isVerified}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Progress Stepper */}
      <div className="flex justify-center mt-10 animate-fade-in-up delay-500">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
            25%
          </div>
          <div className="w-16 h-0.5 " />
          <div className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm">75%</div>
          <div className="w-16 h-0.5 " />
          <div className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm">100%</div>
        </div>
      </div>
    </div>
  )
}
