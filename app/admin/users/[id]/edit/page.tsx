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
          canLocalTransfer: u.canLocalTransfer || false,
          canInternationalTransfer: u.canInternationalTransfer || false,
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
      toast({ title: "Saved", description: "User updated successfully" })
      router.push(`/admin/users/${params.id}`)
      router.refresh()
    } catch (e) {
      setError("An unexpected error occurred")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 space-y-6 pt-[60px]">
      <div>
        <h1 className="text-3xl font-bold">Edit User</h1>
        <p className="text-muted-foreground">Update user details and account configuration</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Basic information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => onChange("email", e.target.value)} />
            </div>
            <div>
              <Label>First name</Label>
              <Input value={form.firstname} onChange={(e) => onChange("firstname", e.target.value)} />
            </div>
            <div>
              <Label>Last name</Label>
              <Input value={form.lastname} onChange={(e) => onChange("lastname", e.target.value)} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => onChange("phone", e.target.value)} />
            </div>
            <div>
              <Label>Birthdate</Label>
              <Input type="date" value={form.birthdate} onChange={(e) => onChange("birthdate", e.target.value)} />
            </div>
            <div>
              <Label>Gender</Label>
              <Select value={form.gender} onValueChange={(v) => onChange("gender", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not set">Not set</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Religion</Label>
              <Input value={form.religion} onChange={(e) => onChange("religion", e.target.value)} />
            </div>
            <div>
              <Label>Currency</Label>
              <Select value={form.currency} onValueChange={(v) => onChange("currency", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
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

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
          <CardDescription>User location details</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Address</Label>
            <Input value={form.location} onChange={(e) => onChange("location", e.target.value)} />
          </div>
          <div>
            <Label>City</Label>
            <Input value={form.city} onChange={(e) => onChange("city", e.target.value)} />
          </div>
          <div>
            <Label>State</Label>
            <Input value={form.state} onChange={(e) => onChange("state", e.target.value)} />
          </div>
          <div>
            <Label>Country</Label>
            <Input value={form.country} onChange={(e) => onChange("country", e.target.value)} />
          </div>
          <div>
            <Label>Zipcode</Label>
            <Input value={form.zipcode} onChange={(e) => onChange("zipcode", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security & Permissions</CardTitle>
          <CardDescription>Account status, transfer settings, and MFA</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Verified</Label>
            <Select value={form.verified ? "true" : "false"} onValueChange={(v) => onChange("verified", v === "true")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Can Transfer (General)</Label>
            <Select
              value={form.canTransfer ? "true" : "false"}
              onValueChange={(v) => onChange("canTransfer", v === "true")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Enabled</SelectItem>
                <SelectItem value="false">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Local Transfer</Label>
            <Select
              value={form.canLocalTransfer ? "true" : "false"}
              onValueChange={(v) => onChange("canLocalTransfer", v === "true")}
              disabled={!Array.isArray(form.roles) || !form.roles.includes("super-admin")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Enabled</SelectItem>
                <SelectItem value="false">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">Super-admin only</p>
          </div>
          <div>
            <Label>International Transfer</Label>
            <Select
              value={form.canInternationalTransfer ? "true" : "false"}
              onValueChange={(v) => onChange("canInternationalTransfer", v === "true")}
              disabled={!Array.isArray(form.roles) || !form.roles.includes("super-admin")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Enabled</SelectItem>
                <SelectItem value="false">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">Super-admin only</p>
          </div>
          <div>
            <Label>OTP via Email</Label>
            <Select value={form.otpEmail ? "true" : "false"} onValueChange={(v) => onChange("otpEmail", v === "true")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Enabled</SelectItem>
                <SelectItem value="false">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Require Transfer Codes</Label>
            <Select
              value={form.transferCodeRequired ? "true" : "false"}
              onValueChange={(v) => onChange("transferCodeRequired", v === "true")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Enabled</SelectItem>
                <SelectItem value="false">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              When disabled, transfers skip all codes and redirect to receipt
            </p>
          </div>
          <div className="md:col-span-3">
            <Label>User Roles</Label>
            <div className="flex gap-6 mt-2">
              {["member", "administrator", "super-admin"].map((role) => (
                <div key={role} className="flex items-center space-x-2">
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
                    className="h-4 w-4"
                  />
                  <Label htmlFor={`role-${role}`} className="capitalize font-normal">
                    {role.replace("-", " ")}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button onClick={() => router.back()} variant="outline">
          Cancel
        </Button>
        <Button onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
