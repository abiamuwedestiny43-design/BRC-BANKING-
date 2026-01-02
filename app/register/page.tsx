"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    phone: "",
    birthdate: "",
    gender: "",
    pin: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.pin.length !== 4) {
      setError("PIN must be 4 digits")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/dashboard")
      } else {
        setError(data.message || "Registration failed")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1650&q=80')",
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Register Card */}
      <Card className="relative w-full max-w-2xl mx-auto animate-fade-in-up bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white tracking-tight">Corporate Bank</CardTitle>
          <CardDescription className="text-gray-200">Create your secure account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* First + Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname" className="text-gray-100">First Name</Label>
                <Input
                  id="firstname"
                  value={formData.firstname}
                  onChange={(e) => handleChange("firstname", e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/80 focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname" className="text-gray-100">Last Name</Label>
                <Input
                  id="lastname"
                  value={formData.lastname}
                  onChange={(e) => handleChange("lastname", e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/80 focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-100">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                disabled={isLoading}
                className="bg-white/80 focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-100">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={isLoading}
                className="bg-white/80 focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Birthdate + Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthdate" className="text-gray-100">Birth Date</Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => handleChange("birthdate", e.target.value)}
                  disabled={isLoading}
                  className="bg-white/80 focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-gray-100">Gender</Label>
                <Select onValueChange={(value) => handleChange("gender", value)}>
                  <SelectTrigger className="bg-white/80 focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Password + Confirm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-100">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/80 focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-100">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/80 focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* PIN */}
            <div className="space-y-2">
              <Label htmlFor="pin" className="text-gray-100">4-Digit PIN</Label>
              <Input
                id="pin"
                type="password"
                maxLength={4}
                value={formData.pin}
                onChange={(e) => handleChange("pin", e.target.value.replace(/\D/g, ""))}
                required
                disabled={isLoading}
                placeholder="Enter 4-digit PIN"
                className="bg-white/80 focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 shadow-md"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>

            {/* Login link */}
            <div className="text-center text-sm text-gray-200">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
