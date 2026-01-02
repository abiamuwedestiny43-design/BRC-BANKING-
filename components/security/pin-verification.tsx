"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield } from "lucide-react"

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
  title = "PIN Verification Required",
  description = "Please enter your 4-digit PIN to continue with this transaction.",
}: PinVerificationProps) {
  const [pin, setPin] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (pin.length !== 4) {
      setError("PIN must be 4 digits")
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
        setAttempts((prev) => prev + 1)
        setError(`Invalid PIN. ${3 - attempts} attempts remaining.`)
        setPin("")

        if (attempts >= 2) {
          setError("Too many failed attempts. Please try again later.")
          setTimeout(() => {
            onClose()
          }, 2000)
        }
      }
    } catch (error) {
      setError("Verification failed. Please try again.")
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="pin">4-Digit PIN</Label>
            <Input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => handlePinChange(e.target.value)}
              placeholder="••••"
              maxLength={4}
              className="text-center text-2xl tracking-widest"
              disabled={isLoading || attempts >= 3}
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={isLoading || pin.length !== 4 || attempts >= 3}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify PIN
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
