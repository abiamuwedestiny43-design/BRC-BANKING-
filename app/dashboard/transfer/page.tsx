"use client"

import type React from "react"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Globe, MapPin } from "lucide-react"
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

  // Fetch public system flag for local transfer availability
  const { data: localFlagData } = useSWR("/api/system/local-transfer-enabled", fetcher)
  const localEnabled: boolean = localFlagData?.enabled ?? true

  // Fetch profile to get admin-assigned currency
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
          ;(async () => {
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
            } catch {}
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white py-10 px-4 pt-[80px]">
      <div className="w-full max-w-2xl animate-fade-in-up">
        <div className="text-center pb-8">
          <h1 className="text-4xl font-bold text-gray-900 animate-slide-up">Transfer Money</h1>
          <p className="text-lg text-gray-600 animate-slide-up delay-200">
            Send money <span className="text-green-600 font-medium">locally</span> or{" "}
            <span className="text-green-600 font-medium">internationally</span> with ease
          </p>
        </div>

        {!localEnabled && (
          <div className="mb-4">
            <Alert variant="destructive">
              <AlertDescription>Local transfers are currently disabled by the administrator.</AlertDescription>
            </Alert>
          </div>
        )}

        <Card className="shadow-lg border-0 rounded-2xl animate-fade-in-up delay-300">
          <CardHeader className="bg-green-600 p-8 text-white rounded-t-2xl">
            <CardTitle className="text-3xl md-text-4xl font-bold">New Transfer</CardTitle>
            <CardDescription className="text-slate-100 text-lg font-medium">
              Choose transfer type and enter recipient details
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Transfer Type */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Transfer Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={transferType === "local" ? "default" : "outline"}
                    className={cn(
                      "h-20 flex-col transition-all",
                      transferType === "local"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "hover:border-green-500",
                    )}
                    onClick={() => setTransferType("local")}
                    disabled={!localEnabled}
                  >
                    <MapPin className="h-6 w-6 mb-2" />
                    Local Transfer
                  </Button>
                  <Button
                    type="button"
                    variant={transferType === "international" ? "default" : "outline"}
                    className={cn(
                      "h-20 flex-col transition-all",
                      transferType === "international"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "hover:border-green-500",
                    )}
                    onClick={() => setTransferType("international")}
                  >
                    <Globe className="h-6 w-6 mb-2" />
                    Wire Transfer
                  </Button>
                </div>
              </div>

              {/* Select Saved Beneficiary */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Use a saved beneficiary (optional)</Label>
                <RadioGroup
                  value={selectedBeneficiaryId || ""}
                  onValueChange={(v) => setSelectedBeneficiaryId(v || null)}
                  className="grid gap-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="" id="bene-none" />
                    <Label htmlFor="bene-none">None</Label>
                  </div>
                  {beneficiaries.map((b: any) => (
                    <div key={b._id} className="flex items-center gap-2">
                      <RadioGroupItem value={b._id} id={`bene-${b._id}`} />
                      <Label htmlFor={`bene-${b._id}`}>
                        {b.bankInfo.bankHolder} — {b.bankInfo.bankName} • {b.bankAccount} ({b.bankRegion})
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Recipient Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => handleChange("bankName", e.target.value)}
                    required
                    disabled={isLoading}
                    className="focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => handleChange("accountNumber", e.target.value)}
                    required
                    disabled={isLoading}
                    className="focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountHolder">Account Holder Name</Label>
                  <Input
                    id="accountHolder"
                    value={formData.accountHolder}
                    onChange={(e) => handleChange("accountHolder", e.target.value)}
                    required
                    disabled={isLoading}
                    className="focus:ring-green-500"
                  />
                </div>

                {transferType === "international" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      {/* Expanded country list */}
                      <Select value={formData.country} onValueChange={(value) => handleChange("country", value)}>
                        <SelectTrigger className="focus:ring-green-500">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          {[
                            "Afghanistan",
                            "Albania",
                            "Algeria",
                            "Andorra",
                            "Angola",
                            "Antigua and Barbuda",
                            "Argentina",
                            "Armenia",
                            "Australia",
                            "Austria",
                            "Azerbaijan",
                            "Bahamas",
                            "Bahrain",
                            "Bangladesh",
                            "Barbados",
                            "Belarus",
                            "Belgium",
                            "Belize",
                            "Benin",
                            "Bhutan",
                            "Bolivia",
                            "Bosnia and Herzegovina",
                            "Botswana",
                            "Brazil",
                            "Brunei",
                            "Bulgaria",
                            "Burkina Faso",
                            "Burundi",
                            "Cabo Verde",
                            "Cambodia",
                            "Cameroon",
                            "Canada",
                            "Central African Republic",
                            "Chad",
                            "Chile",
                            "China",
                            "Colombia",
                            "Comoros",
                            "Congo, Democratic Republic of the",
                            "Congo, Republic of the",
                            "Costa Rica",
                            "Cote d'Ivoire",
                            "Croatia",
                            "Cuba",
                            "Cyprus",
                            "Czech Republic",
                            "Denmark",
                            "Djibouti",
                            "Dominica",
                            "Dominican Republic",
                            "Ecuador",
                            "Egypt",
                            "El Salvador",
                            "Equatorial Guinea",
                            "Eritrea",
                            "Estonia",
                            "Eswatini",
                            "Ethiopia",
                            "Fiji",
                            "Finland",
                            "France",
                            "Gabon",
                            "Gambia",
                            "Georgia",
                            "Germany",
                            "Ghana",
                            "Greece",
                            "Grenada",
                            "Guatemala",
                            "Guinea",
                            "Guinea-Bissau",
                            "Guyana",
                            "Haiti",
                            "Honduras",
                            "Hungary",
                            "Iceland",
                            "India",
                            "Indonesia",
                            "Iran",
                            "Iraq",
                            "Ireland",
                            "Israel",
                            "Italy",
                            "Jamaica",
                            "Japan",
                            "Jordan",
                            "Kazakhstan",
                            "Kenya",
                            "Kiribati",
                            "Kuwait",
                            "Kyrgyzstan",
                            "Laos",
                            "Latvia",
                            "Lebanon",
                            "Lesotho",
                            "Liberia",
                            "Libya",
                            "Liechtenstein",
                            "Lithuania",
                            "Luxembourg",
                            "Madagascar",
                            "Malawi",
                            "Malaysia",
                            "Maldives",
                            "Mali",
                            "Malta",
                            "Marshall Islands",
                            "Mauritania",
                            "Mauritius",
                            "Mexico",
                            "Micronesia",
                            "Moldova",
                            "Monaco",
                            "Mongolia",
                            "Montenegro",
                            "Morocco",
                            "Mozambique",
                            "Myanmar",
                            "Namibia",
                            "Nauru",
                            "Nepal",
                            "Netherlands",
                            "New Zealand",
                            "Nicaragua",
                            "Niger",
                            "Nigeria",
                            "North Korea",
                            "North Macedonia",
                            "Norway",
                            "Oman",
                            "Pakistan",
                            "Palau",
                            "Panama",
                            "Papua New Guinea",
                            "Paraguay",
                            "Peru",
                            "Philippines",
                            "Poland",
                            "Portugal",
                            "Qatar",
                            "Romania",
                            "Russia",
                            "Rwanda",
                            "Saint Kitts and Nevis",
                            "Saint Lucia",
                            "Saint Vincent and the Grenadines",
                            "Samoa",
                            "San Marino",
                            "Sao Tome and Principe",
                            "Saudi Arabia",
                            "Senegal",
                            "Serbia",
                            "Seychelles",
                            "Sierra Leone",
                            "Singapore",
                            "Slovakia",
                            "Slovenia",
                            "Solomon Islands",
                            "Somalia",
                            "South Africa",
                            "South Korea",
                            "South Sudan",
                            "Spain",
                            "Sri Lanka",
                            "Sudan",
                            "Suriname",
                            "Sweden",
                            "Switzerland",
                            "Syria",
                            "Taiwan",
                            "Tajikistan",
                            "Tanzania",
                            "Thailand",
                            "Timor-Leste",
                            "Togo",
                            "Tonga",
                            "Trinidad and Tobago",
                            "Tunisia",
                            "Turkey",
                            "Turkmenistan",
                            "Tuvalu",
                            "Uganda",
                            "Ukraine",
                            "United Arab Emirates",
                            "United Kingdom",
                            "United States",
                            "Uruguay",
                            "Uzbekistan",
                            "Vanuatu",
                            "Vatican City",
                            "Venezuela",
                            "Vietnam",
                            "Yemen",
                            "Zambia",
                            "Zimbabwe",
                          ].map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="routingCode">Routing / SWIFT Code</Label>
                      <Input
                        id="routingCode"
                        value={formData.routingCode}
                        onChange={(e) => handleChange("routingCode", e.target.value)}
                        disabled={isLoading}
                        className="focus:ring-green-500"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Transfer Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    required
                    disabled={isLoading}
                    className="focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  {/* Lock currency to admin-assigned */}
                  <Select value={formData.currency} onValueChange={() => {}} disabled>
                    <SelectTrigger className="focus:ring-green-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={assignedCurrency || "USD"}>{assignedCurrency || "USD"}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Your currency is set by an administrator.</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  disabled={isLoading}
                  placeholder="Purpose of transfer"
                  className="focus:ring-green-500"
                />
              </div>

              {/* Save as Beneficiary */}
              <div className="space-y-2">
                <Label>Save recipient as beneficiary?</Label>
                <RadioGroup
                  value={saveBeneficiaryChoice}
                  onValueChange={(v: "yes" | "no") => setSaveBeneficiaryChoice(v)}
                  className="flex gap-6"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id="save-no" value="no" />
                    <Label htmlFor="save-no">No</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id="save-yes" value="yes" />
                    <Label htmlFor="save-yes">Yes</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Initiate Transfer
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* OTP Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Enter OTP Code</DialogTitle>
            <DialogDescription>
              We've sent a 6-digit OTP code to your registered email address. Please enter it below to complete the
              transfer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>OTP Code</Label>
              <Input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit OTP"
                className="focus:ring-green-500"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleOtpVerification} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? "Verifying..." : "Verify & Complete Transfer"}
              </Button>
              <Button variant="outline" onClick={() => setShowOtpDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
