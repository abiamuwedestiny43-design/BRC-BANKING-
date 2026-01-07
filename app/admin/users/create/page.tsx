"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, UserPlus } from "lucide-react"
import Link from "next/link"

export default function CreateUserPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    currency: "USD",
    roles: ["member"] as string[],
    verified: false,
    canTransfer: false,
    initialBalance: 0,
    usercode: "",
    securityPin: "",
    profileImageFile: null as File | null,
  })

  const handleRoleChange = (role: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      roles: checked ? [...prev.roles.filter((r) => r !== role), role] : prev.roles.filter((r) => r !== role),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        router.push("/admin/users")
      } else {
        const error = await response.json()
        alert(error.message || "Failed to create user")
      }
    } catch (error) {
      console.error("Create user error:", error)
      alert("Failed to create user")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-10 space-y-10 relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col gap-4 relative z-10">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="w-fit rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
        >
          <Link href="/admin/users">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
            <UserPlus className="w-3 h-3" /> Account Creation
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            Create New <span className="text-slate-500 italic">Account</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-md">Open a new user account with full banking access and privileges.</p>
        </div>
      </div>

      <Card className="max-w-4xl bg-white/[0.03] border-white/5 rounded-[2.5rem] relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/5 rounded-full blur-3xl"></div>

        <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
          <CardTitle className="text-2xl font-black text-white italic tracking-tight">Account Details</CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            Complete all required fields to register the new user account
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Account Credentials */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                Account Credentials
              </h3>

              <div className="space-y-2">
                <Label htmlFor="profileImage" className="text-slate-300 font-medium">Profile Picture</Label>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData((prev) => ({ ...prev, profileImageFile: e.target.files?.[0] || null }))}
                  className="block w-full text-sm text-slate-400 font-medium file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-500 file:text-[#001c10] hover:file:bg-emerald-400 file:transition-all file:cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300 font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:border-emerald-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300 font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                    className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:border-emerald-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usercode" className="text-slate-300 font-medium">User Access Code</Label>
                  <Input
                    id="usercode"
                    value={formData.usercode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, usercode: e.target.value }))}
                    required
                    className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:border-emerald-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="securityPin" className="text-slate-300 font-medium">Security PIN</Label>
                  <Input
                    id="securityPin"
                    type="password"
                    maxLength={4}
                    value={formData.securityPin}
                    onChange={(e) => setFormData((prev) => ({ ...prev, securityPin: e.target.value }))}
                    required
                    className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:border-emerald-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="text-slate-300 font-medium">First Name</Label>
                  <Input
                    id="firstname"
                    value={formData.firstname}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstname: e.target.value }))}
                    required
                    className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:border-emerald-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="text-slate-300 font-medium">Last Name</Label>
                  <Input
                    id="lastname"
                    value={formData.lastname}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastname: e.target.value }))}
                    required
                    className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:border-emerald-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-300 font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                  className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:border-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                Address Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-slate-300 font-medium">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  required
                  className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:border-emerald-500 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-slate-300 font-medium">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                    required
                    className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:border-emerald-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-slate-300 font-medium">State / Province</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                    required
                    className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:border-emerald-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-slate-300 font-medium">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                    required
                    className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:border-emerald-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipcode" className="text-slate-300 font-medium">Postal / Zip Code</Label>
                  <Input
                    id="zipcode"
                    value={formData.zipcode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, zipcode: e.target.value }))}
                    required
                    className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:border-emerald-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Account Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                Account Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-slate-300 font-medium">Primary Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:border-emerald-500 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#001c10] border-white/10 rounded-xl">
                      <SelectItem value="USD" className="text-white hover:bg-white/5">USD — US Dollar</SelectItem>
                      <SelectItem value="EUR" className="text-white hover:bg-white/5">EUR — Euro</SelectItem>
                      <SelectItem value="GBP" className="text-white hover:bg-white/5">GBP — British Pound</SelectItem>
                      <SelectItem value="JPY" className="text-white hover:bg-white/5">JPY — Japanese Yen</SelectItem>
                      <SelectItem value="INR" className="text-white hover:bg-white/5">INR — Indian Rupees</SelectItem>
                      <SelectItem value="CHF" className="text-white hover:bg-white/5">CHF — Swiss Franc</SelectItem>
                      <SelectItem value="CAD" className="text-white hover:bg-white/5">CAD — Canadian Dollar</SelectItem>
                      <SelectItem value="AUD" className="text-white hover:bg-white/5">AUD — Australian Dollar</SelectItem>
                      <SelectItem value="SGD" className="text-white hover:bg-white/5">SGD — Singapore Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initialBalance" className="text-slate-300 font-medium">Starting Balance</Label>
                  <Input
                    id="initialBalance"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.initialBalance}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, initialBalance: Number.parseFloat(e.target.value) || 0 }))
                    }
                    className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:border-emerald-500 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Access Levels */}
              <div className="space-y-3">
                <Label className="text-slate-300 font-medium">Access Levels</Label>
                <div className="flex flex-wrap gap-4">
                  {["member", "administrator", "super-admin"].map((role) => (
                    <div key={role} className="flex items-center space-x-2 bg-white/5 px-4 py-3 rounded-xl border border-white/10 hover:border-emerald-500/30 transition-all">
                      <Checkbox
                        id={role}
                        checked={formData.roles.includes(role)}
                        onCheckedChange={(checked) => handleRoleChange(role, checked as boolean)}
                        className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                      />
                      <Label htmlFor={role} className="capitalize text-white font-medium cursor-pointer">
                        {role.replace("-", " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Permissions */}
              <div className="space-y-3">
                <Label className="text-slate-300 font-medium">Account Permissions</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2 bg-white/5 px-4 py-3 rounded-xl border border-white/10 hover:border-emerald-500/30 transition-all">
                    <Checkbox
                      id="verified"
                      checked={formData.verified}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, verified: checked as boolean }))}
                      className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                    <Label htmlFor="verified" className="text-white font-medium cursor-pointer">Account Verified</Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/5 px-4 py-3 rounded-xl border border-white/10 hover:border-emerald-500/30 transition-all">
                    <Checkbox
                      id="canTransfer"
                      checked={formData.canTransfer}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, canTransfer: checked as boolean }))
                      }
                      className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                    <Label htmlFor="canTransfer" className="text-white font-medium cursor-pointer">Transfer Enabled</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-emerald-500 hover:bg-emerald-400 text-[#001c10] font-black h-12 px-8 rounded-xl shadow-xl shadow-emerald-500/20 transition-all"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
                className="h-12 px-8 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-all"
              >
                <Link href="/admin/users">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
