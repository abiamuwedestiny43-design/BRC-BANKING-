// app/dashboard/loans/apply/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Calculator } from "lucide-react"
import { getLoanTypeDetails, calculateMonthlyPayment } from "@/lib/utils/loan"

const loanTypes = [
  { value: "personal", label: "Personal Loan", description: "For personal expenses, debt consolidation, etc." },
  { value: "business", label: "Business Loan", description: "For business expansion, equipment purchase, etc." },
  { value: "mortgage", label: "Mortgage Loan", description: "For purchasing residential or commercial property" },
  { value: "auto", label: "Auto Loan", description: "For purchasing vehicles" },
  { value: "education", label: "Education Loan", description: "For tuition fees and educational expenses" }
]

const employmentStatuses = [
  { value: "employed", label: "Employed" },
  { value: "self-employed", label: "Self-Employed" },
  { value: "unemployed", label: "Unemployed" },
  { value: "student", label: "Student" }
]

export default function ApplyForLoanPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    loanType: "",
    amount: "",
    duration: "",
    purpose: "",
    employmentStatus: "",
    annualIncome: "",
    existingLoans: "0"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [calculatedPayment, setCalculatedPayment] = useState<number | null>(null)

  const loanDetails = formData.loanType ? getLoanTypeDetails(formData.loanType) : null

  const handleCalculate = () => {
    if (formData.amount && formData.duration && loanDetails) {
      const monthlyPayment = calculateMonthlyPayment(
        parseFloat(formData.amount),
        loanDetails.interestRate,
        parseInt(formData.duration)
      )
      setCalculatedPayment(monthlyPayment)
    }
  }

  const handleApply = async () => {
    if (!formData.loanType || !formData.amount || !formData.duration || !formData.purpose || !formData.employmentStatus || !formData.annualIncome) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/loans/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          duration: parseInt(formData.duration),
          annualIncome: parseFloat(formData.annualIncome),
          existingLoans: parseFloat(formData.existingLoans)
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: 'Loan application submitted successfully! You will receive an email confirmation shortly.' 
        })
        setTimeout(() => {
          router.push('/dashboard/loans')
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
    <div className="container mx-auto p-6 pt-[60px] max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Apply for a Loan</h1>
        <p className="text-muted-foreground">Get the financial support you need with competitive rates</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Loan Application</CardTitle>
          <CardDescription>Please provide accurate information for faster processing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Loan Type */}
          <div className="space-y-2">
            <Label htmlFor="loanType">Loan Type *</Label>
            <Select value={formData.loanType} onValueChange={(value) => setFormData({...formData, loanType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select loan type" />
              </SelectTrigger>
              <SelectContent>
                {loanTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Loan Amount and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Loan Amount ({loanDetails?.minAmount.toLocaleString()} - {loanDetails?.maxAmount.toLocaleString()}) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                min={loanDetails?.minAmount}
                max={loanDetails?.maxAmount}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (months, max: {loanDetails?.maxDuration}) *</Label>
              <Input
                id="duration"
                type="number"
                placeholder="Enter months"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                max={loanDetails?.maxDuration}
              />
            </div>
          </div>

          {/* Calculator */}
          {formData.amount && formData.duration && loanDetails && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Calculator className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Payment Calculation</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Interest Rate</div>
                  <div className="font-semibold">{loanDetails.interestRate}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Monthly Payment</div>
                  <div className="font-semibold">
                    {calculatedPayment ? `${calculatedPayment.toFixed(2)}` : 'Calculate'}
                  </div>
                </div>
                <div>
                  <Button size="sm" onClick={handleCalculate} disabled={!formData.amount || !formData.duration}>
                    Calculate
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Employment Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employmentStatus">Employment Status *</Label>
              <Select value={formData.employmentStatus} onValueChange={(value) => setFormData({...formData, employmentStatus: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {employmentStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="annualIncome">Annual Income *</Label>
              <Input
                id="annualIncome"
                type="number"
                placeholder="Enter annual income"
                value={formData.annualIncome}
                onChange={(e) => setFormData({...formData, annualIncome: e.target.value})}
              />
            </div>
          </div>

          {/* Existing Loans */}
          <div className="space-y-2">
            <Label htmlFor="existingLoans">Existing Loan Payments (per month)</Label>
            <Input
              id="existingLoans"
              type="number"
              placeholder="Enter amount"
              value={formData.existingLoans}
              onChange={(e) => setFormData({...formData, existingLoans: e.target.value})}
            />
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose">Loan Purpose *</Label>
            <Textarea
              id="purpose"
              placeholder="Please describe what you need the loan for..."
              value={formData.purpose}
              onChange={(e) => setFormData({...formData, purpose: e.target.value})}
              rows={3}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Apply for Loan'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
