"use client"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, User as UserIcon, ShieldCheck, Globe, CreditCard, Mail, Phone, MapPin, Fingerprint, Zap, ShieldAlert } from "lucide-react"
import Link from "next/link"

export default function AdminEditUserPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [rolesInput, setRolesInput] = useState("")

  const [form, setForm] = useState<any>({
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
    birthdate: "",
    gender: "",
    religion: "",
    location: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    currency: "USD",
    verified: false,
    canTransfer: false,
    otpEmail: false,
    otpTransferCode: false,
    roles: [] as string[],
    canLocalTransfer: false,
    canInternationalTransfer: false,
    transferCodeRequired: true,
  })

  const onChange = (field: string, value: any) => setForm((p: any) => ({ ...p, [field]: value }))

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/admin/users/${params.id}`)
        const data = await res.json()
        if (!res.ok) {
          setError(data.message || "Failed to load user")
          return
        }
        const u = data.user
        setForm({
          email: u.email || "",
          firstname: u.bankInfo?.bio?.firstname || "",
          lastname: u.bankInfo?.bio?.lastname || "",
          phone: u.bankInfo?.bio?.phone || "",
          birthdate: u.bankInfo?.bio?.birthdate ? new Date(u.bankInfo.bio.birthdate).toISOString().slice(0, 10) : "",
          gender: u.bankInfo?.bio?.gender || "Not set",
          religion: u.bankInfo?.bio?.religion || "",
          location: u.bankInfo?.address?.location || "",
          city: u.bankInfo?.address?.city || "",
          state: u.bankInfo?.address?.state || "",
          country: u.bankInfo?.address?.country || "",
          zipcode: u.bankInfo?.address?.zipcode || "",
          currency: u.bankInfo?.system?.currency || "USD",
          verified: !!u.bankAccount?.verified,
          canTransfer: !!u.bankAccount?.canTransfer,
          otpEmail: !!u.bankOtp?.email,
          otpTransferCode: !!u.bankOtp?.transferCode,
          roles: Array.isArray(u.roles) ? u.roles : [],
          canLocalTransfer: u.bankAccount?.canLocalTransfer || false,
          canInternationalTransfer: u.bankAccount?.canInternationalTransfer || false,
          transferCodeRequired: u.transferCodeRequired !== false,
        })
        setRolesInput((Array.isArray(u.roles) ? u.roles : []).join(","))
      } catch (e) {
        setError("Failed to load user")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  const onSave = async () => {
    setSaving(true)
    setError("")
    try {
      const payload = {
        ...form,
        roles: rolesInput
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean),
      }
      const res = await fetch(`/api/admin/users/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Failed to save")
        return
      }
      toast({ title: "Profile Updated", description: "User details updated successfully." })
      router.push(`/admin/users/${params.id}`)
      router.refresh()
    } catch (e) {
      setError("An unexpected error occurred")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001c10] flex items-center justify-center">
        <div className="text-emerald-500 font-black animate-pulse tracking-[0.3em] uppercase">LOADING USER...</div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-10 space-y-10 relative bg-[#001c10] min-h-screen pt-20">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="flex items-center gap-6">
          <Button variant="ghost" onClick={() => router.back()} className="h-14 w-14 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-all p-0">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
              <Fingerprint className="w-3 h-3" /> Edit Profile
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
              Update <span className="text-slate-500 italic">User Details</span>
            </h1>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={onSave}
            disabled={saving}
            className="h-12 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-widest text-xs"
          >
            {saving ? (
              <Zap className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="bg-red-500/10 border-red-500/20 text-red-500 relative z-10 rounded-2xl">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription className="font-bold uppercase text-[10px] tracking-widest">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        {/* Core Profile Card */}
        <Card className="bg-white/[0.03] border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-md">
          <CardHeader className="p-10 border-b border-white/5 bg-white/[0.01]">
            <CardTitle className="text-2xl font-black text-white italic tracking-tight flex items-center gap-3">
              <UserIcon className="w-6 h-6 text-emerald-500" /> Personal Information
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">Core profile details for the user.</CardDescription>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</Label>
                <Input
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  className="bg-white/5 border-white/10 rounded-2xl h-12 text-white focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Forename</Label>
                <Input
                  value={form.firstname}
                  onChange={(e) => onChange("firstname", e.target.value)}
                  className="bg-white/5 border-white/10 rounded-2xl h-12 text-white focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Surname</Label>
                <Input
                  value={form.lastname}
                  onChange={(e) => onChange("lastname", e.target.value)}
                  className="bg-white/5 border-white/10 rounded-2xl h-12 text-white focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  className="bg-white/5 border-white/10 rounded-2xl h-12 text-white focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Date of Birth</Label>
                <Input
                  type="date"
                  value={form.birthdate}
                  onChange={(e) => onChange("birthdate", e.target.value)}
                  className="bg-white/5 border-white/10 rounded-2xl h-12 text-white focus:border-emerald-500 [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Gender</Label>
                <Select value={form.gender} onValueChange={(v) => onChange("gender", v)}>
                  <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-12 text-white focus:ring-emerald-500">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#001c10] border-white/10 text-white">
                    <SelectItem value="Not set">Not set</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Religion</Label>
                <Input
                  value={form.religion}
                  onChange={(e) => onChange("religion", e.target.value)}
                  className="bg-white/5 border-white/10 rounded-2xl h-12 text-white focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Currency</Label>
                <Select value={form.currency} onValueChange={(v) => onChange("currency", v)}>
                  <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-12 text-white focus:ring-emerald-500">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#001c10] border-white/10 text-white">
                    <SelectItem value="USD">USD — US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR — Euro</SelectItem>
                    <SelectItem value="GBP">GBP — British Pound</SelectItem>
                    <SelectItem value="JPY">JPY — Japanese Yen</SelectItem>
                    <SelectItem value="INR">INR — Indian Rupees</SelectItem>
                    <SelectItem value="CHF">CHF — Swiss Franc</SelectItem>
                    <SelectItem value="CAD">CAD — Canadian Dollar</SelectItem>
                    <SelectItem value="AUD">AUD — Australian Dollar</SelectItem>
                    <SelectItem value="SGD">SGD — Singapore Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geolocation Hub */}
        <Card className="bg-white/[0.03] border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-md">
          <CardHeader className="p-10 border-b border-white/5 bg-white/[0.01]">
            <CardTitle className="text-2xl font-black text-white italic tracking-tight flex items-center gap-3">
              <Globe className="w-6 h-6 text-blue-400" /> Address Details
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">Physical address information.</CardDescription>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Address</Label>
              <Input
                value={form.location}
                onChange={(e) => onChange("location", e.target.value)}
                className="bg-white/5 border-white/10 rounded-2xl h-12 text-white focus:border-emerald-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => onChange("city", e.target.value)}
                  className="bg-white/5 border-white/10 rounded-2xl h-12 text-white focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">State / Province</Label>
                <Input
                  value={form.state}
                  onChange={(e) => onChange("state", e.target.value)}
                  className="bg-white/5 border-white/10 rounded-2xl h-12 text-white focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Country</Label>
                <Input
                  value={form.country}
                  onChange={(e) => onChange("country", e.target.value)}
                  className="bg-white/5 border-white/10 rounded-2xl h-12 text-white focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Zipcode</Label>
                <Input
                  value={form.zipcode}
                  onChange={(e) => onChange("zipcode", e.target.value)}
                  className="bg-white/5 border-white/10 rounded-2xl h-12 text-white focus:border-emerald-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & System Protocol */}
        <Card className="bg-white/[0.03] border-white/5 rounded-[3rem] overflow-hidden lg:col-span-2 backdrop-blur-md">
          <CardHeader className="p-10 border-b border-white/5 bg-white/[0.01]">
            <CardTitle className="text-2xl font-black text-white italic tracking-tight flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-500" /> Account Settings
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">Access permissions, security filters, and system-level overrides.</CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-6">
                <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-4">Account Status</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Verified</Label>
                    <Select value={form.verified ? "true" : "false"} onValueChange={(v) => onChange("verified", v === "true")}>
                      <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-12 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#001c10] border-white/10 text-white">
                        <SelectItem value="true">YES (VERIFIED)</SelectItem>
                        <SelectItem value="false">NO (UNVERIFIED)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Transfer Access</Label>
                    <Select
                      value={form.canTransfer ? "true" : "false"}
                      onValueChange={(v) => onChange("canTransfer", v === "true")}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-12 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#001c10] border-white/10 text-white">
                        <SelectItem value="true">ENABLED</SelectItem>
                        <SelectItem value="false">LOCKED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4">Transfer Permissions</h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Local Transfers</Label>
                    <Select
                      value={form.canLocalTransfer ? "true" : "false"}
                      onValueChange={(v) => onChange("canLocalTransfer", v === "true")}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-12 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#001c10] border-white/10 text-white">
                        <SelectItem value="true">ALLOWED</SelectItem>
                        <SelectItem value="false">RESTRICTED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">International Transfers</Label>
                    <Select
                      value={form.canInternationalTransfer ? "true" : "false"}
                      onValueChange={(v) => onChange("canInternationalTransfer", v === "true")}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-12 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#001c10] border-white/10 text-white">
                        <SelectItem value="true">ALLOWED</SelectItem>
                        <SelectItem value="false">RESTRICTED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-[9px] font-black text-blue-500/50 uppercase tracking-widest pt-2 flex items-center gap-2 italic">
                    <ShieldCheck className="w-3 h-3" /> Managed by Administrator
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black text-purple-400 uppercase tracking-widest mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email OTP</Label>
                    <Select value={form.otpEmail ? "true" : "false"} onValueChange={(v) => onChange("otpEmail", v === "true")}>
                      <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-12 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#001c10] border-white/10 text-white">
                        <SelectItem value="true">ACTIVE</SelectItem>
                        <SelectItem value="false">BYPASS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Transfer Codes</Label>
                    <Select
                      value={form.transferCodeRequired ? "true" : "false"}
                      onValueChange={(v) => onChange("transferCodeRequired", v === "true")}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-12 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#001c10] border-white/10 text-white">
                        <SelectItem value="true">ENFORCED</SelectItem>
                        <SelectItem value="false">DISABLED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 pt-6 border-t border-white/5">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">User Roles (Permissions)</Label>
                <div className="flex flex-wrap gap-8 mt-4 bg-black/20 p-6 rounded-[2rem] border border-white/5">
                  {["member", "administrator", "super-admin"].map((role) => (
                    <div key={role} className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id={`role-${role}`}
                          checked={Array.isArray(form.roles) && form.roles.includes(role)}
                          onChange={(e) => {
                            const newRoles = Array.isArray(form.roles) ? [...form.roles] : []
                            if (e.target.checked) {
                              if (!newRoles.includes(role)) newRoles.push(role)
                            } else {
                              const idx = newRoles.indexOf(role)
                              if (idx > -1) newRoles.splice(idx, 1)
                            }
                            onChange("roles", newRoles)
                            setRolesInput(newRoles.join(", "))
                          }}
                          className="peer appearance-none h-6 w-6 rounded-lg bg-white/5 border border-white/20 checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer"
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-black font-black text-[10px] pointer-events-none opacity-0 peer-checked:opacity-100">
                          ✓
                        </div>
                      </div>
                      <Label htmlFor={`role-${role}`} className="capitalize font-black text-xs text-slate-400 group-hover:text-white transition-colors cursor-pointer tracking-widest">
                        {role.replace("-", " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center pt-10 relative z-10">
        <div className="flex gap-6 p-2 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl">
          <Button onClick={() => router.back()} variant="ghost" className="h-14 px-10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[10px]">
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={saving}
            className="h-14 px-16 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black shadow-2xl shadow-emerald-500/30 transition-all uppercase tracking-[0.2em] text-xs"
          >
            {saving ? "SAVING..." : "SAVE CHANGES"}
          </Button>
        </div>
      </div>
    </div>
  )
}

