"use client"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { ChevronDown, ChevronUp, Zap, ShieldCheck, Key, Users, ArrowRight } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())
const genCode = () => Math.floor(100000 + Math.random() * 900000).toString()

export default function AdminTransferCodesPage() {
  const { toast } = useToast()
  const { data, mutate } = useSWR("/api/admin/transfer-codes", fetcher)
  const { data: usersData, mutate: mutateUsers } = useSWR("/api/admin/users", fetcher)

  const [cot, setCot] = useState("")
  const [imf, setImf] = useState("")
  const [esi, setEsi] = useState("")
  const [dco, setDco] = useState("")
  const [tax, setTax] = useState("")
  const [tac, setTac] = useState("")
  const [saving, setSaving] = useState(false)

  const [expandedSections, setExpandedSections] = useState({
    codes: true,
    users: true,
  })

  useEffect(() => {
    if (data?.codes) {
      setCot(data.codes.cot || "")
      setImf(data.codes.imf || "")
      setTac(data.codes.tac || "")
      setEsi(data.codes.esi || "")
      setDco(data.codes.dco || "")
      setTax(data.codes.tax || "")
    }
  }, [data])

  const save = async () => {
    setSaving(true)
    const res = await fetch("/api/admin/transfer-codes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cot, imf, esi, dco, tax, tac }),
    })
    if (res.ok) {
      toast({ title: "Authorized", description: "Global transfer protocols updated successfully." })
      mutate()
    } else {
      toast({ title: "Error", description: "Failed to synchronize security codes." })
    }
    setSaving(false)
  }

  const toggleUserTransfer = async (userId: string, currentState: boolean) => {
    const res = await fetch("/api/admin/users/toggle-transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, enable: !currentState }),
    })

    if (res.ok) {
      toast({
        title: "Profile Updated",
        description: `Transfer permissions ${!currentState ? "granted" : "revoked"} for user.`,
      })
      mutateUsers()
    } else {
      toast({ title: "Error", description: "User permission update failed." })
    }
  }

  return (
    <div className="p-4 md:p-10 space-y-10 relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="space-y-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
          <Key className="w-3 h-3" /> Security Codes
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
          Transfer <span className="text-slate-500 italic">Management</span>
        </h1>
        <p className="text-slate-400 font-medium max-w-md">Authorized control of global verification codes and individual user permissions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        {/* Global Transfer Codes Section */}
        <Card className="bg-white/[0.03] border-white/5 rounded-[3rem] overflow-hidden">
          <CardHeader
            onClick={() => setExpandedSections({ ...expandedSections, codes: !expandedSections.codes })}
            className="p-8 border-b border-white/5 bg-white/[0.01] cursor-pointer group flex flex-row items-center justify-between"
          >
            <div>
              <CardTitle className="text-2xl font-black text-white italic tracking-tight flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-500" /> Transfer Verification Codes
              </CardTitle>
              <CardDescription className="text-slate-500 font-medium">Global security codes for transfer auditing.</CardDescription>
            </div>
            <div className={`p-2 rounded-xl bg-white/5 text-slate-400 group-hover:text-emerald-500 transition-all ${expandedSections.codes ? '' : 'rotate-180'}`}>
              <ChevronUp className="w-5 h-5" />
            </div>
          </CardHeader>

          {expandedSections.codes && (
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "COT Code", value: cot, set: setCot, color: "text-emerald-500" },
                  { label: "IMF Code", value: imf, set: setImf, color: "text-blue-500" },
                  { label: "ESI Code", value: esi, set: setEsi, color: "text-purple-500" },
                  { label: "DCO Code", value: dco, set: setDco, color: "text-orange-500" },
                  { label: "TAX Code", value: tax, set: setTax, color: "text-red-500" },
                  { label: "TAC Code", value: tac, set: setTac, color: "text-cyan-500" },
                ].map((row) => (
                  <div key={row.label} className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors flex items-center gap-2">
                      <span className={`w-1 h-1 rounded-full ${row.color.replace('text-', 'bg-')}`}></span> {row.label}
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={row.value}
                        onChange={(e) => row.set(e.target.value)}
                        className="bg-white/5 border-white/10 rounded-xl h-12 text-white font-mono focus:border-emerald-500 focus:ring-0 transition-all"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => row.set(genCode())}
                        className="h-12 w-12 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-500 border border-white/5"
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <Button
                  onClick={save}
                  disabled={saving}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#001c10] font-black h-14 rounded-2xl shadow-xl shadow-emerald-500/20 uppercase tracking-widest text-xs"
                >
                  {saving ? "SAVING..." : "Publish Global Codes"}
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Per-User Transfer Permissions Section */}
        <Card className="bg-white/[0.03] border-white/5 rounded-[3rem] overflow-hidden flex flex-col">
          <CardHeader
            onClick={() => setExpandedSections({ ...expandedSections, users: !expandedSections.users })}
            className="p-8 border-b border-white/5 bg-white/[0.01] cursor-pointer group flex flex-row items-center justify-between"
          >
            <div>
              <CardTitle className="text-2xl font-black text-white italic tracking-tight flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-500" /> User Permissions
              </CardTitle>
              <CardDescription className="text-slate-500 font-medium">Provision or revoke transfer rights.</CardDescription>
            </div>
            <div className={`p-2 rounded-xl bg-white/5 text-slate-400 group-hover:text-blue-500 transition-all ${expandedSections.users ? '' : 'rotate-180'}`}>
              <ChevronUp className="w-5 h-5" />
            </div>
          </CardHeader>

          {expandedSections.users && (
            <CardContent className="p-0 flex-1 overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto custom-scrollbar p-6 space-y-4">
                {usersData?.users?.map((user: any) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${user.bankAccount?.canTransfer ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-slate-700/20 text-slate-500 border border-slate-700/30'}`}>
                        {user.bankInfo?.bio?.firstname?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors uppercase tracking-tight">{user.bankInfo?.bio?.firstname} {user.bankInfo?.bio?.lastname}</p>
                        <p className="text-[10px] text-slate-500 font-mono tracking-tighter truncate max-w-[150px]">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleUserTransfer(user._id, user.bankAccount?.canTransfer)}
                      className={`h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${user.bankAccount?.canTransfer
                        ? "bg-blue-500 text-white hover:bg-blue-400"
                        : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"
                        }`}
                    >
                      {user.bankAccount?.canTransfer ? "Enabled" : "Revoked"}
                    </Button>
                  </div>
                ))}
                {!usersData?.users?.length && (
                  <div className="text-center py-20 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto opacity-20">
                      <Users className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-slate-500 font-medium italic">No users found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
