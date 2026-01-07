"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Settings, ShieldCheck, Zap, Globe, Lock, Cpu, Database } from "lucide-react"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localEnabled, setLocalEnabled] = useState(true)
  const [globalEnabled, setGlobalEnabled] = useState(true)
  const [bulkBusy, setBulkBusy] = useState(false)
  const [singleBusy, setSingleBusy] = useState(false)
  const [singleUserId, setSingleUserId] = useState("")
  const [foundUser, setFoundUser] = useState<any>(null)

  const toggleUserPerm = async (type: "local" | "international", enabled: boolean) => {
    if (!foundUser) return
    setError(null)
    try {
      const res = await fetch("/api/admin/users/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: foundUser.id, type, enabled }),
      })
      const data = await res.json()
      if (!res.ok) setError(data?.message || "Protocol update failed.")
      else {
        setFoundUser({ ...foundUser, [type === "local" ? "canLocalTransfer" : "canInternationalTransfer"]: enabled })
      }
    } catch {
      setError("System failure during protocol sync.")
    }
  }

  useEffect(() => {
    let mounted = true
      ; (async () => {
        try {
          const [localRes, globalRes] = await Promise.all([
            fetch("/api/admin/settings/local-transfer"),
            fetch("/api/admin/settings/global-transfer"),
          ])
          const localData = await localRes.json()
          const globalData = await globalRes.json()

          if (!mounted) return
          if (!localRes.ok) setError(localData?.message || "Failed to load settings")
          else setLocalEnabled(Boolean(localData.enabled))

          if (!globalRes.ok) setError((prev) => prev || globalData?.message || "Failed to load settings")
          else setGlobalEnabled(Boolean(globalData.enabled))
        } catch {
          setError("Failed to load settings")
        } finally {
          if (mounted) setLoading(false)
        }
      })()
    return () => {
      mounted = false
    }
  }, [])

  const handleSaveGlobal = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/settings/global-transfer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: globalEnabled }),
      })
      const data = await res.json()
      if (!res.ok) setError(data?.message || "Failed to save")
    } catch {
      setError("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveLocal = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/settings/local-transfer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: localEnabled }),
      })
      const data = await res.json()
      if (!res.ok) setError(data?.message || "Failed to save")
    } catch {
      setError("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const bulkSetUsersTransfer = async (enabled: boolean, type: "all" | "local" | "international" = "all") => {
    setBulkBusy(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/settings/users-transfer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled, type }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.message || "Failed to update users")
      }
    } catch {
      setError("Failed to update users")
    } finally {
      setBulkBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-emerald-500 font-black animate-pulse flex items-center gap-3 uppercase tracking-widest">
        <Cpu className="w-5 h-5 animate-spin" />
        Accessing System Variables...
      </div>
    )
  }

  return (
    <div className="p-4 md:p-10 space-y-10 relative max-w-5xl">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <div className="space-y-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
          <Settings className="w-3 h-3" /> System Architecture
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
          Global <span className="text-slate-500 italic">Settings</span>
        </h1>
        <p className="text-slate-400 font-medium max-w-md">Fine-tuning of core infrastructure and security parameters.</p>
      </div>

      {error && (
        <Alert className="bg-red-500/10 border-red-500/20 text-red-400 rounded-2xl relative z-10">
          <AlertDescription className="font-bold flex items-center gap-2">
            <Lock className="w-4 h-4" /> {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-white/[0.03] border-white/5 rounded-[3rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
              <CardTitle className="text-2xl font-black text-white italic tracking-tight">Transfer Protocols</CardTitle>
              <CardDescription className="text-slate-500 font-medium">Control the global flow of assets across the PRIMEHARBOR framework.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-12">
              {/* Global Transfers */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/5 group hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all">
                <div className="space-y-1">
                  <Label className="text-lg font-black text-white flex items-center gap-2 italic">
                    <Globe className="w-4 h-4 text-emerald-500" /> UNIFIED TRANSFERS
                  </Label>
                  <p className="text-sm text-slate-500 max-w-sm">Disable ALL asset migrations (Local & International) cluster-wide.</p>
                </div>
                <div className="flex items-center gap-6">
                  <Switch
                    checked={globalEnabled}
                    onCheckedChange={setGlobalEnabled}
                    className="data-[state=checked]:bg-emerald-500"
                    disabled={saving}
                  />
                  <Button
                    onClick={handleSaveGlobal}
                    disabled={saving}
                    className="bg-white/5 hover:bg-white/10 text-white font-bold px-6 rounded-xl border border-white/10 h-10 text-xs"
                  >
                    {saving ? "..." : "SYNC"}
                  </Button>
                </div>
              </div>

              {/* Local Transfers */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/5 group hover:bg-blue-500/5 hover:border-blue-500/20 transition-all">
                <div className="space-y-1">
                  <Label className="text-lg font-black text-white flex items-center gap-2 italic">
                    <Database className="w-4 h-4 text-blue-500" /> INTRASYSTEM ASSETS
                  </Label>
                  <p className="text-sm text-slate-500 max-w-sm">Restrict migrations within the internal PRIMEHARBOR BANK node network.</p>
                </div>
                <div className="flex items-center gap-6">
                  <Switch
                    checked={localEnabled}
                    onCheckedChange={setLocalEnabled}
                    className="data-[state=checked]:bg-blue-500"
                    disabled={saving}
                  />
                  <Button
                    onClick={handleSaveLocal}
                    disabled={saving}
                    className="bg-white/5 hover:bg-white/10 text-white font-bold px-6 rounded-xl border border-white/10 h-10 text-xs"
                  >
                    {saving ? "..." : "SYNC"}
                  </Button>
                </div>
              </div>

              <Separator className="bg-white/5" />

              {/* Bulk Override */}
              <div className="space-y-8">
                <div className="space-y-1">
                  <Label className="text-xl font-black text-white italic">BULK PERMISSION OVERRIDE</Label>
                  <p className="text-sm text-slate-500 font-medium">Atomic permission updates for the entire user registry. Use with caution.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Unified */}
                  <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Unified Protocol</p>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => bulkSetUsersTransfer(true, "all")}
                        disabled={bulkBusy}
                        className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black hover:bg-emerald-500 hover:text-black transition-all uppercase tracking-widest text-[9px] h-10"
                      >
                        Enable All
                      </Button>
                      <Button
                        onClick={() => bulkSetUsersTransfer(false, "all")}
                        disabled={bulkBusy}
                        className="w-full bg-red-500/10 border border-red-500/20 text-red-500 font-black hover:bg-red-500 transition-all uppercase tracking-widest text-[9px] h-10"
                      >
                        Revoke All
                      </Button>
                    </div>
                  </div>

                  {/* Local */}
                  <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Local Details</p>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => bulkSetUsersTransfer(true, "local")}
                        disabled={bulkBusy}
                        className="w-full bg-blue-500/10 border border-blue-500/20 text-blue-500 font-black hover:bg-blue-500 hover:text-black transition-all uppercase tracking-widest text-[9px] h-10"
                      >
                        Enable Local
                      </Button>
                      <Button
                        onClick={() => bulkSetUsersTransfer(false, "local")}
                        disabled={bulkBusy}
                        className="w-full bg-red-500/10 border border-red-500/20 text-red-500 font-black hover:bg-red-500 transition-all uppercase tracking-widest text-[9px] h-10"
                      >
                        Revoke Local
                      </Button>
                    </div>
                  </div>

                  {/* International */}
                  <div className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Intl Protocols</p>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => bulkSetUsersTransfer(true, "international")}
                        disabled={bulkBusy}
                        className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black hover:bg-emerald-500 hover:text-black transition-all uppercase tracking-widest text-[9px] h-10"
                      >
                        Enable Intl
                      </Button>
                      <Button
                        onClick={() => bulkSetUsersTransfer(false, "international")}
                        disabled={bulkBusy}
                        className="w-full bg-red-500/10 border border-red-500/20 text-red-500 font-black hover:bg-red-500 transition-all uppercase tracking-widest text-[9px] h-10"
                      >
                        Revoke Intl
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-8">
          <Card className="bg-white/[0.03] border-white/5 rounded-[2.5rem] p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl"></div>
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 italic">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> INDIVIDUAL OVERRIDE
            </h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 leading-relaxed">
              Target specific identity Details for precise protocol modulation.
            </p>

            <div className="space-y-6">
              <div className="relative">
                <Input
                  placeholder="Identity Node (Email/ID)"
                  value={singleUserId}
                  onChange={(e) => setSingleUserId(e.target.value)}
                  className="bg-white/5 border-white/10 rounded-xl h-12 text-white font-mono text-xs focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
                <Button
                  size="sm"
                  onClick={async () => {
                    if (!singleUserId) return
                    setSingleBusy(true)
                    setError(null)
                    try {
                      const res = await fetch(`/api/admin/users/permissions?identifier=${encodeURIComponent(singleUserId)}`)
                      const data = await res.json()
                      if (!res.ok) {
                        setError(data?.message || "Node signature not found.")
                        setFoundUser(null)
                      } else {
                        setFoundUser(data)
                      }
                    } catch {
                      setError("Network interrupt during node lookup.")
                    } finally {
                      setSingleBusy(false)
                    }
                  }}
                  className="absolute right-1 top-1 h-10 px-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-black text-[10px] uppercase tracking-widest"
                >
                  {singleBusy ? "..." : "FETCH"}
                </Button>
              </div>

              {foundUser && (
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black text-xs uppercase">
                      {foundUser.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-tight">{foundUser.name}</p>
                      <p className="text-[9px] text-slate-500 italic truncate max-w-[150px]">{foundUser.email}</p>
                    </div>
                  </div>

                  <Separator className="bg-white/5" />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Local Transfer</span>
                      <Switch
                        checked={foundUser.canLocalTransfer}
                        onCheckedChange={(val) => toggleUserPerm("local", val)}
                        className="data-[state=checked]:bg-blue-500 scale-75"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intl Transfer</span>
                      <Switch
                        checked={foundUser.canInternationalTransfer}
                        onCheckedChange={(val) => toggleUserPerm("international", val)}
                        className="data-[state=checked]:bg-emerald-500 scale-75"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#003d24] to-[#001c10] border-emerald-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[100px]"></div>
            <div className="relative z-10 space-y-4">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Global Master Key</p>
              <h3 className="text-xl font-black text-white italic tracking-tight italic">System Integrity</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Changes made in this module propagate instantly through our global server architecture. Proceed with highest caution.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
