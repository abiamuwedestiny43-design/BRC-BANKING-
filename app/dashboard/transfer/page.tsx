"use client"

import type React from "react"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Loader2,
  Globe,
  MapPin,
  ArrowRightLeft,
  CreditCard,
  Banknote,
  CheckCircle2,
  ArrowRight,
  User,
  ShieldCheck,
  Search,
  BookUser,
  AlertCircle
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function TransferPage() {
  const [transferType, setTransferType] = useState<"local" | "international">("local")
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    amount: "",
    currency: "USD",
    description: "",
    country: "",
    routingCode: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [pendingTransfer, setPendingTransfer] = useState<any>(null)

  const [saveBeneficiaryChoice, setSaveBeneficiaryChoice] = useState<"no" | "yes">("no")
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string | null>(null)

  const router = useRouter()
  const params = useSearchParams()
  const { toast } = useToast()

  const { data: beneData } = useSWR("/api/user/beneficiaries", fetcher)
  const beneficiaries = beneData?.beneficiaries || []
  const { data: localFlagData } = useSWR("/api/system/local-transfer-enabled", fetcher)
  const localEnabled: boolean = localFlagData?.enabled ?? true
  const { data: profileData } = useSWR("/api/user/profile", fetcher)
  const assignedCurrency = profileData?.user?.currency

  useEffect(() => {
    if (assignedCurrency) {
      setFormData((prev) => ({ ...prev, currency: assignedCurrency }))
    }
  }, [assignedCurrency])

  useEffect(() => {
    const accountNumber = params.get("accountNumber")
    const bankName = params.get("bankName")
    const accountHolder = params.get("accountHolder")
    if (accountNumber || bankName || accountHolder) {
      setFormData((prev) => ({
        ...prev,
        bankName: bankName || prev.bankName,
        accountNumber: accountNumber || prev.accountNumber,
        accountHolder: accountHolder || prev.accountHolder,
      }))
    }
  }, [params])

  useEffect(() => {
    if (!selectedBeneficiaryId) return
    const b = beneficiaries.find((x: any) => x._id === selectedBeneficiaryId)
    if (!b) return
    setTransferType(b.bankRegion === "international" ? "international" : "local")
    setFormData((prev) => ({
      ...prev,
      bankName: b.bankInfo.bankName || "",
      accountNumber: b.bankAccount || "",
      accountHolder: b.bankInfo.bankHolder || "",
      country: b.bankInfo.bankCountry || "",
      routingCode: b.bankInfo.identifierCode || "",
    }))
  }, [selectedBeneficiaryId, beneficiaries])

  useEffect(() => {
    if (!localEnabled && transferType === "local") {
      setTransferType("international")
    }
  }, [localEnabled, transferType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/transfers/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          transferType,
          amount: Number.parseFloat(formData.amount),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setPendingTransfer(data.transfer)

        if (saveBeneficiaryChoice === "yes") {
          ; (async () => {
            try {
              await fetch("/api/user/beneficiaries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  bankRegion: transferType === "international" ? "international" : "local",
                  bankAccount: formData.accountNumber,
                  bankInfo: {
                    bankName: formData.bankName,
                    bankHolder: formData.accountHolder,
                    bankCountry: formData.country || undefined,
                    identifier: transferType === "international" ? "Routing/SWIFT" : undefined,
                    identifierCode: formData.routingCode || undefined,
                  },
                }),
              })
            } catch { }
          })()
        }

        if (transferType === "local") {
          setShowOtpDialog(true)
        } else {
          router.push(`/dashboard/transfer/verify/cot/${data.transfer.txRef}`)
        }
      } else {
        setError(data.message || "Transfer initiation failed")
        toast({ variant: "destructive", description: data.message || "Transfer initiation failed" })
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      toast({ variant: "destructive", description: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpVerification = async () => {
    const isSixDigits = /^\d{6}$/.test(otpCode)
    if (!isSixDigits) {
      setError("Please enter a valid 6-digit OTP")
      toast({ variant: "destructive", description: "Invalid OTP: please enter 6 digits." })
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/transfers/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txRef: pendingTransfer.txRef,
          otpCode,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        toast({ description: "OTP verified. Completing transfer..." })
        router.push(`/dashboard/receipt/${pendingTransfer.txRef}`)
      } else {
        setError(data.message || "OTP verification failed")
        toast({ variant: "destructive", description: data.message || "OTP verification failed" })
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      toast({ variant: "destructive", description: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] w-full p-4 md:p-8 lg:p-12 pt-24 md:pt-32">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header Section */}
        <motion.div {...fadeInUp} className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-2xl mb-2">
            <ArrowRightLeft className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Transfer Funds</h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
            Securely send money to any bank account worldwide.
            Choose between <span className="text-green-600 font-bold">local priority</span> and <span className="text-blue-600 font-bold">international wire</span>.
          </p>
        </motion.div>

        {!localEnabled && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Alert variant="destructive" className="border-none shadow-lg bg-red-50 text-red-700 rounded-2xl">
              <ShieldCheck className="h-5 w-5" />
              <AlertDescription className="font-bold ml-2">Local transfers are currently disabled by the administrator.</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-10">
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <Card className="border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-white/90 backdrop-blur-md rounded-[2.5rem]">
              <div className="h-4 bg-gradient-to-r from-green-600 via-green-400 to-green-600" />
              <CardHeader className="p-8 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight">Transaction Details</CardTitle>
                    <CardDescription className="text-slate-500 font-medium pt-1">Provide the recipient's banking information below.</CardDescription>
                  </div>
                  <div className="flex bg-slate-100 p-1 rounded-2xl shadow-inner border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setTransferType("local")}
                      disabled={!localEnabled}
                      className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all",
                        transferType === "local" ? "bg-white text-green-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      <MapPin className="h-4 w-4" /> Local
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransferType("international")}
                      className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all",
                        transferType === "international" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      <Globe className="h-4 w-4" /> Wire
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8 pt-6">
                <form onSubmit={handleSubmit} className="space-y-10">
                  {error && (
                    <Alert variant="destructive" className="rounded-2xl border-none bg-red-50 text-red-700">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="font-bold">{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Beneficiary Quick Select */}
                  <div className="space-y-4">
                    <Label className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                      <BookUser className="h-4 w-4 text-green-600" />
                      Quick Select Beneficiary
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div
                        onClick={() => setSelectedBeneficiaryId(null)}
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3",
                          !selectedBeneficiaryId ? "border-green-500 bg-green-50/50 shadow-md" : "border-slate-100 bg-slate-50 hover:border-slate-200"
                        )}
                      >
                        <div className={cn("h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all", !selectedBeneficiaryId ? "border-green-600 bg-green-600" : "border-slate-300")}>
                          {!selectedBeneficiaryId && <CheckCircle2 className="h-4 w-4 text-white" />}
                        </div>
                        <span className="font-bold text-slate-700">New Recipient</span>
                      </div>
                      {beneficiaries.map((b: any) => (
                        <div
                          key={b._id}
                          onClick={() => setSelectedBeneficiaryId(b._id)}
                          className={cn(
                            "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group",
                            selectedBeneficiaryId === b._id ? "border-green-500 bg-green-50/50 shadow-md" : "border-slate-100 bg-slate-50 hover:border-slate-200"
                          )}
                        >
                          <div className="flex items-center gap-3 flex-1 overflow-hidden">
                            <div className={cn("h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all", selectedBeneficiaryId === b._id ? "border-green-600 bg-green-600" : "border-slate-300")}>
                              {selectedBeneficiaryId === b._id && <CheckCircle2 className="h-4 w-4 text-white" />}
                            </div>
                            <div className="truncate">
                              <p className="font-black text-slate-900 text-sm truncate">{b.bankInfo.bankHolder}</p>
                              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-tight">{b.bankInfo.bankName} • {b.bankAccount}</p>
                            </div>
                          </div>
                          <span className={cn("text-[8px] font-black px-2 py-0.5 rounded uppercase ml-2", b.bankRegion === 'international' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600')}>
                            {b.bankRegion === 'international' ? 'Wire' : 'Local'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="bankName" className="text-sm font-bold text-slate-700">Bank Name</Label>
                      <div className="relative group">
                        <Banknote className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                        <Input
                          id="bankName"
                          placeholder="e.g. JPMorgan Chase"
                          value={formData.bankName}
                          onChange={(e) => handleChange("bankName", e.target.value)}
                          required
                          disabled={isLoading}
                          className="pl-10 h-12 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-green-400 transition-all rounded-xl font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountNumber" className="text-sm font-bold text-slate-700">Account Number</Label>
                      <div className="relative group">
                        <CreditCard className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                        <Input
                          id="accountNumber"
                          placeholder="Enter account number"
                          value={formData.accountNumber}
                          onChange={(e) => handleChange("accountNumber", e.target.value)}
                          required
                          disabled={isLoading}
                          className="pl-10 h-12 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-green-400 transition-all rounded-xl font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 col-span-1 md:col-span-2">
                      <Label htmlFor="accountHolder" className="text-sm font-bold text-slate-700">Account Holder Name</Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                        <Input
                          id="accountHolder"
                          placeholder="Legal name of recipient"
                          value={formData.accountHolder}
                          onChange={(e) => handleChange("accountHolder", e.target.value)}
                          required
                          disabled={isLoading}
                          className="pl-10 h-12 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-green-400 transition-all rounded-xl font-bold"
                        />
                      </div>
                    </div>

                    {transferType === "international" && (
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="country" className="text-sm font-bold text-slate-700">Country</Label>
                          <Select value={formData.country} onValueChange={(value) => handleChange("country", value)}>
                            <SelectTrigger className="h-12 bg-slate-50/50 border-slate-200 rounded-xl font-bold focus:ring-green-400">
                              <SelectValue placeholder="Select beneficiary country" />
                            </SelectTrigger>
                            <SelectContent className="max-h-72 rounded-xl">
                              {[
                                "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
                              ].map((c) => (
                                <SelectItem key={c} value={c} className="rounded-lg">
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="routingCode" className="text-sm font-bold text-slate-700">Swift / Routing Code</Label>
                          <div className="relative group">
                            <Globe className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                            <Input
                              id="routingCode"
                              placeholder="8 or 11 characters"
                              value={formData.routingCode}
                              onChange={(e) => handleChange("routingCode", e.target.value)}
                              disabled={isLoading}
                              className="pl-10 h-12 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-green-400 transition-all rounded-xl font-bold uppercase"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-sm font-bold text-slate-700">Transfer Amount</Label>
                      <div className="relative group">
                        <span className="absolute left-3 top-3 text-lg font-black text-slate-300 group-focus-within:text-green-600 transition-colors">$</span>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={(e) => handleChange("amount", e.target.value)}
                          required
                          disabled={isLoading}
                          className="pl-8 h-14 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-green-400 shadow-inner transition-all rounded-xl text-xl font-black"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency" className="text-sm font-bold text-slate-700">Currency</Label>
                      <Select value={formData.currency} onValueChange={() => { }} disabled>
                        <SelectTrigger className="h-14 bg-slate-100 border-none rounded-xl font-black text-slate-600 cursor-not-allowed">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value={assignedCurrency || "USD"}>{assignedCurrency || "USD"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-bold text-slate-700">Note / Description <span className="text-slate-400 font-medium">(Optional)</span></Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      disabled={isLoading}
                      placeholder="e.g. Rent payment, Business invoice"
                      className="min-h-[100px] bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-green-400 transition-all rounded-[2rem] p-6 font-medium"
                    />
                  </div>

                  <div className="p-6 bg-slate-50/80 border border-slate-100 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <BookUser className="h-5 w-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-700">Save Beneficiary</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Store for future quick-pay</p>
                      </div>
                    </div>
                    <RadioGroup
                      value={saveBeneficiaryChoice}
                      onValueChange={(v: "yes" | "no") => setSaveBeneficiaryChoice(v)}
                      className="flex bg-white p-1 rounded-xl shadow-inner border border-slate-200"
                    >
                      <div className="flex items-center">
                        <RadioGroupItem id="save-no" value="no" className="sr-only" />
                        <Label
                          htmlFor="save-no"
                          className={cn(
                            "cursor-pointer px-6 py-1.5 rounded-lg text-xs font-black transition-all",
                            saveBeneficiaryChoice === "no" ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          No
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem id="save-yes" value="yes" className="sr-only" />
                        <Label
                          htmlFor="save-yes"
                          className={cn(
                            "cursor-pointer px-6 py-1.5 rounded-lg text-xs font-black transition-all",
                            saveBeneficiaryChoice === "yes" ? "bg-green-600 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          Yes
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-slate-900 hover:bg-black text-white font-black h-16 rounded-2xl shadow-2xl shadow-slate-200 transition-all hover:scale-[1.01] active:scale-[0.99] group text-lg"
                    >
                      {isLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <>
                          Initiate Secure Transfer
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                    <p className="items-center justify-center flex gap-1.5 text-[10px] font-black uppercase text-slate-400 tracking-widest pt-2">
                      <ShieldCheck className="h-3 w-3" />
                      Encrypted & Verified Transaction
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* OTP Dialog */}
      <AnimatePresence>
        {showOtpDialog && (
          <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
            <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-10 max-w-md overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
              <DialogHeader className="space-y-4">
                <div className="h-16 w-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="h-8 w-8 text-green-600" />
                </div>
                <DialogTitle className="text-3xl font-black text-slate-900 text-center uppercase tracking-tighter">Enter OTP</DialogTitle>
                <DialogDescription className="text-center text-slate-500 font-medium text-base">
                  A security code has been sent to your email. Enter the <span className="text-slate-900 font-black">6-digit</span> code to authorize this transaction.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-10 pt-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center block">Security Code</Label>
                  <Input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="• • • • • •"
                    className="h-20 text-center text-4xl font-black tracking-[1rem] bg-slate-50 border-none rounded-2xl shadow-inner focus:ring-green-400 placeholder:text-slate-200"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button onClick={handleOtpVerification} disabled={isLoading} className="h-14 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl shadow-xl shadow-green-100 text-lg">
                    {isLoading ? "Verifying..." : "Confirm & Send"}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowOtpDialog(false)} className="h-12 font-bold text-slate-400 hover:text-slate-600">
                    Cancel Transaction
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}
