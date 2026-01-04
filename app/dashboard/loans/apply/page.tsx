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
import { CheckCircle, AlertCircle, Calculator, DollarSign, Clock, TrendingUp } from "lucide-react"
import { getLoanTypeDetails, calculateMonthlyPayment } from "@/lib/utils/loan"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

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
    <div className="min-h-screen bg-[#001c10] w-full p-4 md:p-8 lg:p-12 pt-24 md:pt-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto space-y-10 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-widest text-[10px] mb-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 w-fit rounded-full">
            <Calculator className="h-3 w-3" />
            Capital Acquisition
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            Deploy <span className="text-slate-500 italic">Funding</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg">Initialize a new financial protocol with competitive rates and optimized terms.</p>
        </div>

        {message && (
          <Alert className={cn(
            "border-none shadow-2xl backdrop-blur-md rounded-2xl p-6",
            message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
          )}>
            {message.type === 'success' ? (
              <CheckCircle className="h-6 w-6 text-emerald-500" />
            ) : (
              <AlertCircle className="h-6 w-6 text-red-500" />
            )}
            <AlertDescription className={cn(
              "font-bold text-base ml-2",
              message.type === 'success' ? 'text-emerald-400' : 'text-red-400'
            )}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <Card className="border border-white/5 shadow-2xl bg-white/[0.03] backdrop-blur-md rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 md:p-10 border-b border-white/5 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Protocol Initialization</p>
            <CardTitle className="text-3xl font-black text-white lowercase">Application <span className="text-slate-500 italic">Parameters</span></CardTitle>
            <CardDescription className="text-slate-400 font-medium">Please provide precise operational data for rapid authorization processing.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 md:p-10 space-y-8">
            {/* Loan Type */}
            <div className="space-y-4">
              <Label htmlFor="loanType" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Select Protocol Class</Label>
              <Select value={formData.loanType} onValueChange={(value) => setFormData({ ...formData, loanType: value })}>
                <SelectTrigger className="h-16 bg-black/40 border-white/10 rounded-2xl text-white font-bold px-6 focus:ring-emerald-500/40">
                  <SelectValue placeholder="Select functional class" />
                </SelectTrigger>
                <SelectContent className="bg-[#001c10] border-white/10 text-white rounded-2xl shadow-2xl">
                  {loanTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="focus:bg-emerald-500/10 focus:text-emerald-400 py-4 rounded-xl cursor-pointer">
                      <div className="space-y-1">
                        <div className="font-black text-sm uppercase tracking-tight">{type.label}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Loan Amount and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label htmlFor="amount" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Principal Amount <span className="text-slate-600 block text-[9px] mt-1 italic capitalize">Range: {loanDetails?.minAmount.toLocaleString() || '0'} - {loanDetails?.maxAmount.toLocaleString() || '0'} USD</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="h-16 pl-14 bg-black/40 border-white/10 rounded-2xl text-white font-black text-xl focus:ring-emerald-500/40 placeholder:text-white/5"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="duration" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Term Duration <span className="text-slate-600 block text-[9px] mt-1 italic capitalize">Maximum: {loanDetails?.maxDuration || '0'} Months</span>
                </Label>
                <div className="relative">
                  <Clock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                  <Input
                    id="duration"
                    type="number"
                    placeholder="0"
                    className="h-16 pl-14 bg-black/40 border-white/10 rounded-2xl text-white font-black text-xl focus:ring-emerald-500/40 placeholder:text-white/5"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Calculator */}
            {formData.amount && formData.duration && loanDetails && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[2rem] shadow-inner relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                    <Calculator className="h-4 w-4 text-emerald-500" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Projection Engine</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Interest Rate</div>
                    <div className="text-2xl font-black text-white">{loanDetails.interestRate}<span className="text-emerald-500 italic">%</span></div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Monthly Cost</div>
                    <div className="text-2xl font-black text-white lowercase">
                      {calculatedPayment ? `${calculatedPayment.toFixed(2)}` : '0.00'} <span className="text-slate-500 text-xs tracking-tighter font-bold uppercase">USD</span>
                    </div>
                  </div>
                  <div className="flex items-center md:justify-end">
                    <Button
                      onClick={handleCalculate}
                      disabled={!formData.amount || !formData.duration}
                      className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-[#001c10] font-black rounded-xl shadow-lg shadow-emerald-500/20 text-xs uppercase tracking-widest"
                    >
                      Process Feed
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="border-t border-white/5 pt-8 space-y-8">
              {/* Employment Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label htmlFor="employmentStatus" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Employment Status</Label>
                  <Select value={formData.employmentStatus} onValueChange={(value) => setFormData({ ...formData, employmentStatus: value })}>
                    <SelectTrigger className="h-16 bg-black/40 border-white/10 rounded-2xl text-white font-bold px-6">
                      <SelectValue placeholder="Status identifier" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#001c10] border-white/10 text-white rounded-2xl shadow-2xl">
                      {employmentStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value} className="focus:bg-emerald-500/10 focus:text-emerald-400 py-4 rounded-xl cursor-pointer">
                          <span className="font-bold text-xs uppercase tracking-widest">{status.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="annualIncome" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Annual Gross Velocity</Label>
                  <div className="relative">
                    <TrendingUp className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                    <Input
                      id="annualIncome"
                      type="number"
                      placeholder="Annual Income"
                      className="h-16 pl-14 bg-black/40 border-white/10 rounded-2xl text-white font-black text-xl placeholder:text-white/5"
                      value={formData.annualIncome}
                      onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Existing Loans */}
              <div className="space-y-4">
                <Label htmlFor="existingLoans" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Existing Liabilities (Monthly Sum)</Label>
                <Input
                  id="existingLoans"
                  type="number"
                  placeholder="0.00"
                  className="h-16 bg-black/40 border-white/10 rounded-2xl text-white font-black text-xl placeholder:text-white/5"
                  value={formData.existingLoans}
                  onChange={(e) => setFormData({ ...formData, existingLoans: e.target.value })}
                />
              </div>

              {/* Purpose */}
              <div className="space-y-4">
                <Label htmlFor="purpose" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Operational Objective</Label>
                <Textarea
                  id="purpose"
                  placeholder="Define the primary objective for this capital procurement..."
                  className="min-h-[150px] bg-black/40 border-white/10 rounded-2xl text-white font-medium p-6 focus:ring-emerald-500/40 resize-none"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col md:flex-row gap-4 pt-6">
              <Button
                variant="ghost"
                className="h-16 flex-1 border border-white/10 text-slate-400 font-bold hover:text-white hover:bg-white/5 rounded-2xl"
                onClick={() => router.back()}
              >
                Abort Process
              </Button>
              <Button
                onClick={handleApply}
                disabled={isSubmitting}
                className="h-16 flex-[2] bg-emerald-500 hover:bg-emerald-400 text-[#001c10] font-black rounded-2xl shadow-xl shadow-emerald-500/20 text-lg uppercase tracking-tight"
              >
                {isSubmitting ? 'Processing Application...' : 'Deploy Protocol'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
