"use client"
import useSWR from "swr"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function BeneficiariesPage() {
  const { toast } = useToast()
  const { data, mutate, isLoading } = useSWR("/api/user/beneficiaries", fetcher)
  const beneficiaries = data?.beneficiaries || []

  const [bankRegion, setBankRegion] = useState<"local" | "international">("local")
  const [bankName, setBankName] = useState("")
  const [bankHolder, setBankHolder] = useState("")
  const [bankAccount, setBankAccount] = useState("")
  const [bankCountry, setBankCountry] = useState("")
  const [identifier, setIdentifier] = useState("")
  const [identifierCode, setIdentifierCode] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const addBeneficiary = async () => {
    setError("")
    setSaving(true)
    try {
      const res = await fetch("/api/user/beneficiaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bankRegion,
          bankAccount,
          bankInfo: { bankName, bankHolder, bankCountry, identifier, identifierCode },
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Failed to add beneficiary")
        return
      }
      toast({ title: "Added", description: "Beneficiary added successfully" })
      setBankName("")
      setBankHolder("")
      setBankAccount("")
      setBankCountry("")
      setIdentifier("")
      setIdentifierCode("")
      mutate()
    } finally {
      setSaving(false)
    }
  }

  const removeBeneficiary = async (id: string) => {
    const res = await fetch("/api/user/beneficiaries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      toast({ title: "Removed", description: "Beneficiary deleted" })
      mutate()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-start justify-center p-4 pt-8">
      <div className="w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Beneficiaries</h1>
          <p className="text-slate-600">Save recipients for faster transfers</p>
        </div>

        <Card className="border-green-200">
          <CardHeader>
            <CardTitle>Add New Beneficiary</CardTitle>
            <CardDescription>Provide recipient bank details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Region</Label>
                <Select value={bankRegion} onValueChange={(v: any) => setBankRegion(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Bank Name</Label>
                <Input value={bankName} onChange={(e) => setBankName(e.target.value)} />
              </div>
              <div>
                <Label>Account Holder</Label>
                <Input value={bankHolder} onChange={(e) => setBankHolder(e.target.value)} />
              </div>
              <div>
                <Label>Account Number / IBAN</Label>
                <Input value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} />
              </div>
              {bankRegion === "international" && (
                <>
                  <div>
                    <Label>Country</Label>
                    <Input value={bankCountry} onChange={(e) => setBankCountry(e.target.value)} />
                  </div>
                  <div>
                    <Label>Identifier (e.g. SWIFT)</Label>
                    <Input value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
                  </div>
                  <div>
                    <Label>Identifier Code</Label>
                    <Input value={identifierCode} onChange={(e) => setIdentifierCode(e.target.value)} />
                  </div>
                </>
              )}
            </div>
            <Button onClick={addBeneficiary} disabled={saving}>
              {saving ? "Saving..." : "Add Beneficiary"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader>
            <CardTitle>Saved Beneficiaries</CardTitle>
            <CardDescription>{isLoading ? "Loading..." : `${beneficiaries.length} saved`}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {beneficiaries.length === 0 ? (
              <p className="text-slate-600">No beneficiaries saved yet.</p>
            ) : (
              beneficiaries.map((b: any) => (
                <div key={b._id} className="p-3 rounded-lg border flex items-center justify-between">
                  <div className="text-sm">
                    <p className="font-medium text-slate-800">
                      {b.bankInfo.bankHolder} — {b.bankInfo.bankName}
                    </p>
                    <p className="text-slate-600">
                      {b.bankAccount} • {b.bankRegion}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <Link
                        href={`/dashboard/transfer?accountNumber=${encodeURIComponent(b.bankAccount)}&bankName=${encodeURIComponent(b.bankInfo.bankName)}&accountHolder=${encodeURIComponent(b.bankInfo.bankHolder)}`}
                      >
                        Use
                      </Link>
                    </Button>
                    <Button variant="destructive" onClick={() => removeBeneficiary(b._id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
