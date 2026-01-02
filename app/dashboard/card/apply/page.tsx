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
    <div className="container mx-auto p-6 pt-[80px] max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Apply for a New Card</h1>
        <p className="text-muted-foreground">Choose the card that best fits your needs</p>
      </div>

      {message && (
        <Alert className={message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <RadioGroup value={selectedCard} onValueChange={setSelectedCard} className="space-y-4">
        {cardOptions.map((card, index) => (
          <Card key={index} className={`cursor-pointer transition-all hover:shadow-md ${
            selectedCard === `${card.type}-${card.vendor}` ? 'ring-2 ring-primary' : ''
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <RadioGroupItem value={`${card.type}-${card.vendor}`} id={`card-${index}`} />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <Label htmlFor={`card-${index}`} className="text-lg font-semibold cursor-pointer">
                      {card.name}
                    </Label>
                    <span className={`px-2 py-1 rounded text-xs ${
                      card.type === 'debit' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {card.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3">{card.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {card.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>

      <div className="mt-8 flex justify-end space-x-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleApply} disabled={isSubmitting || !selectedCard}>
          {isSubmitting ? 'Submitting...' : 'Apply for Card'}
        </Button>
      </div>
    </div>
  )
}
