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
import { ArrowLeft } from "lucide-react"
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
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New User</h1>
          <p className="text-muted-foreground">Add a new user account to the system</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Fill in the details for the new user account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Account Details</h3>
              <div className="space-y-2">
                <Label htmlFor="profileImage">Profile Picture</Label>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData((prev) => ({ ...prev, profileImageFile: e.target.files?.[0] }))}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usercode">User Code</Label>
                  <Input
                    id="usercode"
                    value={formData.usercode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, usercode: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="securityPin">Security PIN</Label>
                  <Input
                    id="securityPin"
                    type="password"
                    maxLength={4}
                    value={formData.securityPin}
                    onChange={(e) => setFormData((prev) => ({ ...prev, securityPin: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input
                    id="firstname"
                    value={formData.firstname}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstname: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input
                    id="lastname"
                    value={formData.lastname}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastname: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Address Information</h3>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipcode">Zip Code</Label>
                  <Input
                    id="zipcode"
                    value={formData.zipcode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, zipcode: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Account Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                <div className="space-y-2">
                  <Label htmlFor="initialBalance">Initial Balance</Label>
                  <Input
                    id="initialBalance"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.initialBalance}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, initialBalance: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>

              {/* Roles */}
              <div className="space-y-2">
                <Label>User Roles</Label>
                <div className="flex gap-4">
                  {["member", "administrator", "super-admin"].map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={role}
                        checked={formData.roles.includes(role)}
                        onCheckedChange={(checked) => handleRoleChange(role, checked as boolean)}
                      />
                      <Label htmlFor={role} className="capitalize">
                        {role.replace("-", " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Status */}
              <div className="space-y-2">
                <Label>Account Status</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={formData.verified}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, verified: checked as boolean }))}
                    />
                    <Label htmlFor="verified">Account Verified</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canTransfer"
                      checked={formData.canTransfer}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, canTransfer: checked as boolean }))
                      }
                    />
                    <Label htmlFor="canTransfer">Can Transfer</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create User"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/users">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
