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
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Users, Plus, Trash2, Globe, Landmark, Fingerprint, ChevronRight, ShieldCheck } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function BeneficiariesPage() {
  const { toast } = useToast()
  const { data, mutate, isLoading } = useSWR("/api/user/beneficiaries", fetcher)
  const beneficiaries = data?.beneficiaries || []
  const { data: profileData } = useSWR("/api/user/profile", fetcher)
  const userLocalEnabled = profileData?.user?.bankAccount?.canLocalTransfer ?? false
  const userIntlEnabled = profileData?.user?.bankAccount?.canInternationalTransfer ?? false
  const { data: localFlagData } = useSWR("/api/system/local-transfer-enabled", fetcher)
  const systemLocalEnabled = localFlagData?.enabled ?? true
  const localPermission = userLocalEnabled && systemLocalEnabled

  const [bankRegion, setBankRegion] = useState<"local" | "international">("local")
  const [bankName, setBankName] = useState("")
  const [bankHolder, setBankHolder] = useState("")
  const [bankAccount, setBankAccount] = useState("")
  const [bankCountry, setBankCountry] = useState("")
  const [identifier, setIdentifier] = useState("")
  const [identifierCode, setIdentifierCode] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

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
      toast({ title: "Authorized", description: "Beneficiary added successfully." })
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
      toast({ title: "Removed", description: "Beneficiary removed from list." })
      mutate()
    }
  }

  return (
    <div className="min-h-screen bg-[#001c10] w-full p-4 md:p-8 lg:p-12 pt-24 md:pt-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">

        {/* Header Section */}
        <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-widest text-[10px] mb-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 w-fit rounded-full mx-auto md:mx-0">
              <Users className="h-3 w-3" />
              Registry Management
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter lowercase">
              Transfer <span className="text-slate-500 italic">Beneficiaries</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg">Manage authorized recipient details for quick transfers.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Add Form */}
          <motion.div {...fadeInUp} className="lg:col-span-12 xl:col-span-5">
            <Card className="border border-white/5 shadow-2xl bg-white/[0.03] backdrop-blur-md rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 border-b border-white/5 bg-emerald-500/5">
                <CardTitle className="text-2xl font-black text-white lowercase tracking-tighter">Add <span className="text-slate-500 italic">Receiver</span></CardTitle>
                <CardDescription className="text-slate-500 font-medium">Register a new recipient in the system.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {error && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Alert className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                      <AlertDescription className="text-red-400 font-black lowercase text-lg">{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}



                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Operational Region</Label>
                    <Select value={bankRegion} onValueChange={(v: any) => setBankRegion(v)}>
                      <SelectTrigger className="h-14 bg-white/[0.02] border-white/5 rounded-2xl text-white font-bold focus:border-emerald-500/50 transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#001c10] border-white/10 text-white rounded-2xl">
                        <SelectItem value="local" className="focus:bg-emerald-500 focus:text-[#001c10] disabled:opacity-30">Local Network</SelectItem>
                        <SelectItem value="international" className="focus:bg-emerald-500 focus:text-[#001c10] disabled:opacity-30">Cross-Border Relay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Bank Name</Label>
                    <div className="relative group">
                      <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                      <Input
                        placeholder="node_provider_name"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="pl-12 h-14 bg-white/[0.02] border-white/5 focus:bg-white/[0.04] focus:border-emerald-500/50 focus:ring-emerald-500/20 text-white font-bold transition-all rounded-2xl lowercase placeholder:text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Holder</Label>
                    <div className="relative group">
                      <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                      <Input
                        placeholder="authorized_entity_name"
                        value={bankHolder}
                        onChange={(e) => setBankHolder(e.target.value)}
                        className="pl-12 h-14 bg-white/[0.02] border-white/5 focus:bg-white/[0.04] focus:border-emerald-500/50 focus:ring-emerald-500/20 text-white font-bold transition-all rounded-2xl lowercase placeholder:text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Number / IBAN</Label>
                    <div className="relative group">
                      <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                      <Input
                        placeholder="sequence_code_alpha"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        className="pl-12 h-14 bg-white/[0.02] border-white/5 focus:bg-white/[0.04] focus:border-emerald-500/50 focus:ring-emerald-500/20 text-white font-bold transition-all rounded-2xl lowercase placeholder:text-slate-800"
                      />
                    </div>
                  </div>

                  {bankRegion === "international" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 gap-6 pt-4 border-t border-white/5">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Jurisdiction</Label>
                        <Input value={bankCountry} onChange={(e) => setBankCountry(e.target.value)} className="h-14 bg-white/[0.02] border-white/5 rounded-2xl text-white font-bold lowercase" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Type</Label>
                          <Input placeholder="SWIFT" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="h-14 bg-white/[0.02] border-white/5 rounded-2xl text-white font-bold" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Code</Label>
                          <Input placeholder="000XXX" value={identifierCode} onChange={(e) => setIdentifierCode(e.target.value)} className="h-14 bg-white/[0.02] border-white/5 rounded-2xl text-white font-bold" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <Button
                  onClick={addBeneficiary}
                  disabled={saving}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#001c10] font-black h-16 rounded-2xl shadow-xl shadow-emerald-500/20 uppercase tracking-tighter text-lg transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Add Beneficiary"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* List Display */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="lg:col-span-12 xl:col-span-7 space-y-6">
            <div className="flex items-center justify-between px-4 pb-2">
              <h2 className="text-2xl font-black text-white lowercase tracking-tighter">Active <span className="text-slate-500 italic">Beneficiaries</span></h2>
              <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                {isLoading ? "Loading..." : `${beneficiaries.length} Recipients`}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence mode="popLayout">
                {beneficiaries.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center rounded-[2.5rem] border border-dashed border-white/10 bg-white/[0.02]">
                    <Users className="h-12 w-12 text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">No beneficiaries found.</p>
                  </motion.div>
                ) : (
                  beneficiaries.map((b: any, index: number) => (
                    <motion.div
                      key={b._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                      <div className="relative p-6 rounded-3xl bg-white/[0.03] backdrop-blur-md border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 group-hover:bg-white/[0.05]">
                        <div className="flex items-center gap-5 w-full md:w-auto">
                          <div className="h-14 w-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-emerald-500 shadow-2xl overflow-hidden relative">
                            <Landmark className="h-6 w-6 relative z-10" />
                            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="font-black text-white text-lg tracking-tight lowercase">
                                {b.bankInfo.bankHolder}
                              </p>
                              <ShieldCheck className="h-3 w-3 text-emerald-500/50" />
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                {b.bankInfo.bankName}
                              </p>
                              <span className="h-1 w-1 rounded-full bg-slate-800"></span>
                              <p className="text-[10px] text-emerald-500/70 font-black tracking-[0.2em] uppercase">
                                {b.bankAccount.slice(0, 4)}••••{b.bankAccount.slice(-4)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                          <div className={cn(
                            "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                            b.bankRegion === 'local' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          )}>
                            {b.bankRegion}
                          </div>
                          <Button variant="ghost" className="h-12 w-12 rounded-xl border border-white/5 bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all group/btn" asChild>
                            <Link href={`/dashboard/transfer?accountNumber=${encodeURIComponent(b.bankAccount)}&bankName=${encodeURIComponent(b.bankInfo.bankName)}&accountHolder=${encodeURIComponent(b.bankInfo.bankHolder)}`}>
                              <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                          <Button variant="ghost" className="h-12 w-12 rounded-xl border border-red-500/10 bg-red-500/5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all" onClick={() => removeBeneficiary(b._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
