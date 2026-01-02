// app/dashboard/settings/page.tsx
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, User, Lock } from "lucide-react"
import type { IUser } from "@/models/User"

interface SettingsPageProps {
  user: IUser
}

export default function SettingsPage({ user }: SettingsPageProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  // profile state with safe defaults
  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    birthdate: "",
    gender: "",
    religion: "",
    location: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
  })

  // hydrate profile when user arrives
  useEffect(() => {
    if (user) {
      setProfileData({
        firstname: user?.bankInfo?.bio?.firstname || "",
        lastname: user?.bankInfo?.bio?.lastname || "",
        email: user?.email || "",
        phone: user?.bankInfo?.bio?.phone || "",
        birthdate: user?.bankInfo?.bio?.birthdate
          ? new Date(user.bankInfo.bio.birthdate).toISOString().split("T")[0]
          : "",
        gender: user?.bankInfo?.bio?.gender || "",
        religion: user?.bankInfo?.bio?.religion || "",
        location: user?.bankInfo?.address?.location || "",
        city: user?.bankInfo?.address?.city || "",
        state: user?.bankInfo?.address?.state || "",
        country: user?.bankInfo?.address?.country || "",
        zipcode: user?.bankInfo?.address?.zipcode || "",
      })
    }
  }, [user])

  // password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const changedFields: any = {}

    // Check each field and only include if it has content
    if (profileData.firstname) changedFields.firstname = profileData.firstname
    if (profileData.lastname) changedFields.lastname = profileData.lastname
    if (profileData.email) changedFields.email = profileData.email
    if (profileData.phone) changedFields.phone = profileData.phone
    if (profileData.birthdate) changedFields.birthdate = profileData.birthdate
    if (profileData.gender) changedFields.gender = profileData.gender
    if (profileData.religion) changedFields.religion = profileData.religion
    if (profileData.location) changedFields.location = profileData.location
    if (profileData.city) changedFields.city = profileData.city
    if (profileData.state) changedFields.state = profileData.state
    if (profileData.country) changedFields.country = profileData.country
    if (profileData.zipcode) changedFields.zipcode = profileData.zipcode

    if (Object.keys(changedFields).length === 0) {
      setMessage({
        type: "error",
        text: "Please fill in at least one field",
      })
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changedFields),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Profile updated successfully!",
        })
        router.refresh()
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to update profile",
        })
      }
    } catch {
      setMessage({
        type: "error",
        text: "An error occurred while updating profile",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        type: "error",
        text: "New passwords do not match",
      })
      setIsLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long",
      })
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Password changed successfully!",
        })
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to change password",
        })
      }
    } catch {
      setMessage({
        type: "error",
        text: "An error occurred while changing password",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container min-h-screen bg-gradient-to-br from-green-50 to-white mx-auto p-8 pt-[60px] md:p-[100px] w-full animate-fade-in-up animation-delay-200">
      <div className="mb-8 animate-fade-in-up animation-delay-200">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile information and security settings</p>
      </div>

      {message && (
        <Alert
          className={`mb-6 ${message.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 animate-fade-in-up animation-delay-200">
        {/* ✅ TabsList with green border */}
        <TabsList className="grid w-full grid-cols-2 border border-green-500 rounded-lg">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Edit Profile</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center space-x-2">
            <Lock className="h-4 w-4" />
            <span>Change Password</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          {/* ✅ Profile Card with green border */}
          <Card className="animate-fade-in-up animation-delay-200 border border-green-500 rounded-lg">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className=" space-y-4 animate-fade-in-up animation-delay-200">
                <div>
                  <Label>Profile Picture</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const formData = new FormData()
                        formData.append("file", file)
                        const res = await fetch("/api/user/profile-image", {
                          method: "POST",
                          body: formData,
                        })
                        if (res.ok) {
                          const data = await res.json()
                          setMessage({
                            type: "success",
                            text: "Profile picture uploaded successfully!",
                          })
                          router.refresh()
                        }
                      }
                    }}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={profileData.firstname}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          firstname: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={profileData.lastname}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          lastname: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          {/* ❌ No border here for contrast */}
          <Card className="animate-fade-in-up animation-delay-200 border border-green-500">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label>Current Password</Label>
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ✅ Account Security Card with green border */}
      <Card className="mt-6 animate-fade-in-up animation-delay-200 border border-green-500 rounded-lg">
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Your account security status and information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Account Verification</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    user?.bankAccount?.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {user?.bankAccount?.verified ? "Verified" : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Transfer Permissions</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    user?.bankAccount?.canTransfer ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {user?.bankAccount?.canTransfer ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Login</span>
                <span className="text-sm text-muted-foreground">
                  {user?.lastSeen ? new Date(user.lastSeen).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Member Since</span>
                <span className="text-sm text-muted-foreground">
                  {user?.registerTime ? new Date(user.registerTime).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
