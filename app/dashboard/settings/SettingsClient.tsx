// app/dashboard/settings/SettingsClient.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    CheckCircle,
    AlertCircle,
    User,
    Lock,
    Camera,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    ShieldAlert,
    Calendar,
    Globe,
    Settings,
    Bell,
    CreditCard
} from "lucide-react"
import type { IUser } from "@/models/User"
import { cn } from "@/lib/utils"

interface SettingsPageProps {
    user: IUser
}

export default function SettingsClient({ user }: SettingsPageProps) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("profile")
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{
        type: "success" | "error"
        text: string
    } | null>(null)

    // profile state
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

    // hydrate profile
    useEffect(() => {
        if (user) {
            setProfileData({
                firstname: user?.bankInfo?.bio?.firstname || "",
                lastname: user?.bankInfo?.bio?.lastname || "",
                email: user?.email || "",
                phone: user?.bankInfo?.bio?.phone || "",
                birthdate: (() => {
                    if (!user?.bankInfo?.bio?.birthdate) return ""
                    const d = new Date(user.bankInfo.bio.birthdate)
                    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0]
                })(),
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
        Object.entries(profileData).forEach(([key, value]) => {
            if (value) changedFields[key] = value
        })

        if (Object.keys(changedFields).length === 0) {
            setMessage({ type: "error", text: "Please fill in at least one field" })
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
                setMessage({ type: "success", text: "Profile updated successfully!" })
                router.refresh()
            } else {
                setMessage({ type: "error", text: data.error || "Failed to update profile" })
            }
        } catch {
            setMessage({ type: "error", text: "An error occurred while updating profile" })
        } finally {
            setIsLoading(false)
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match" })
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
                setMessage({ type: "success", text: "Password changed successfully!" })
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
            } else {
                setMessage({ type: "error", text: data.error || "Failed to change password" })
            }
        } catch {
            setMessage({ type: "error", text: "An error occurred while changing password" })
        } finally {
            setIsLoading(false)
        }
    }

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] w-full p-4 md:p-8 lg:p-12 pt-24 md:pt-32">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header Section */}
                <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Settings</h1>
                        <p className="text-slate-500 text-lg">Manage your account preferences and security.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden md:block text-right mr-2">
                            <p className="text-sm font-semibold text-slate-900">{profileData.firstname} {profileData.lastname}</p>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Personal Account</p>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-green-200">
                            {profileData.firstname?.[0]}{profileData.lastname?.[0]}
                        </div>
                    </div>
                </motion.div>

                {message && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <Alert className={cn(
                            "border-none shadow-md backdrop-blur-md",
                            message.type === "success" ? "bg-green-500/10 text-green-700" : "bg-red-500/10 text-red-700"
                        )}>
                            {message.type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                            <AlertDescription className="font-medium ml-2">{message.text}</AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Navigation Sidebar */}
                    <motion.div {...fadeInUp} className="lg:col-span-3">
                        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-md sticky top-32">
                            <CardContent className="p-2">
                                <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                                    {[
                                        { id: "profile", label: "Edit Profile", icon: User },
                                        { id: "password", label: "Password", icon: Lock },
                                        { id: "preferences", label: "Preferences", icon: Settings },
                                        { id: "notifications", label: "Notifications", icon: Bell },
                                        { id: "billing", label: "Plans & Billing", icon: CreditCard },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 whitespace-nowrap",
                                                activeTab === item.id
                                                    ? "bg-green-600 text-white shadow-lg shadow-green-200"
                                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                            )}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            <span className="text-sm font-semibold">{item.label}</span>
                                        </button>
                                    ))}
                                </nav>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Main Content Area */}
                    <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="lg:col-span-9 space-y-8">

                        <AnimatePresence mode="wait">
                            {activeTab === "profile" && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <Card className="border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-white/90 backdrop-blur-md">
                                        <div className="h-32 bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 relative">
                                            <div className="absolute -bottom-12 left-8 p-1 rounded-3xl bg-white shadow-xl">
                                                <div className="h-24 w-24 rounded-2xl bg-slate-100 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                                                    {user?.profileImage ? (
                                                        <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <User className="h-10 w-10 text-slate-300" />
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Camera className="text-white h-6 w-6" />
                                                    </div>
                                                    <input
                                                        type="file"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0]
                                                            if (file) {
                                                                const formData = new FormData()
                                                                formData.append("file", file)
                                                                const res = await fetch("/api/user/profile-image", { method: "POST", body: formData })
                                                                if (res.ok) {
                                                                    setMessage({ type: "success", text: "Profile picture updated!" })
                                                                    router.refresh()
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <CardHeader className="pt-16 pb-0">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <CardTitle className="text-2xl font-bold">Personal Profile</CardTitle>
                                                    <CardDescription>Keep your information updated to stay secure.</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pt-8">
                                            <form onSubmit={handleProfileUpdate} className="space-y-8">

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-bold text-slate-700">First Name</Label>
                                                        <div className="relative group">
                                                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                                                            <Input
                                                                value={profileData.firstname}
                                                                onChange={(e) => setProfileData({ ...profileData, firstname: e.target.value })}
                                                                className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-green-400 transition-all rounded-xl"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-bold text-slate-700">Last Name</Label>
                                                        <div className="relative group">
                                                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                                                            <Input
                                                                value={profileData.lastname}
                                                                onChange={(e) => setProfileData({ ...profileData, lastname: e.target.value })}
                                                                className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-green-400 transition-all rounded-xl"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-bold text-slate-700">Email Address</Label>
                                                        <div className="relative group">
                                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                                                            <Input
                                                                type="email"
                                                                value={profileData.email}
                                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                                className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-green-400 transition-all rounded-xl"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-bold text-slate-700">Phone Number</Label>
                                                        <div className="relative group">
                                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                                                            <Input
                                                                value={profileData.phone}
                                                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                                className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-green-400 transition-all rounded-xl"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-bold text-slate-700">Birth Date</Label>
                                                        <div className="relative group">
                                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                                                            <Input
                                                                type="date"
                                                                value={profileData.birthdate}
                                                                onChange={(e) => setProfileData({ ...profileData, birthdate: e.target.value })}
                                                                className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-green-400 transition-all rounded-xl"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-bold text-slate-700">Location / Address</Label>
                                                        <div className="relative group">
                                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                                                            <Input
                                                                value={profileData.location}
                                                                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                                                className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-green-400 transition-all rounded-xl"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-bold text-slate-700">City</Label>
                                                        <div className="relative group">
                                                            <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                                                            <Input
                                                                value={profileData.city}
                                                                onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                                                className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-green-400 transition-all rounded-xl"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-bold text-slate-700">Zip Code</Label>
                                                        <div className="relative group">
                                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                                                            <Input
                                                                value={profileData.zipcode}
                                                                onChange={(e) => setProfileData({ ...profileData, zipcode: e.target.value })}
                                                                className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-green-400 transition-all rounded-xl"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end pt-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={isLoading}
                                                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-green-100 transition-all hover:scale-105 active:scale-95"
                                                    >
                                                        {isLoading ? "Saving..." : "Save Changes"}
                                                    </Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {activeTab === "password" && (
                                <motion.div
                                    key="password"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <Card className="border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-white/90 backdrop-blur-md">
                                        <CardHeader className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-8">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white/10 rounded-2xl">
                                                    <Lock className="h-6 w-6 text-green-400" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-2xl font-bold">Security Settings</CardTitle>
                                                    <CardDescription className="text-slate-400">Manage your password and authentication.</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <form onSubmit={handlePasswordChange} className="max-w-md space-y-6">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-bold text-slate-700">Current Password</Label>
                                                    <Input
                                                        type="password"
                                                        value={passwordData.currentPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                        className="h-11 bg-slate-100/50 border-slate-200 rounded-xl"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-bold text-slate-700">New Password</Label>
                                                    <Input
                                                        type="password"
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                        className="h-11 bg-slate-100/50 border-slate-200 rounded-xl"
                                                    />
                                                    <p className="text-xs text-slate-500">Minimum 8 characters with numbers and symbols.</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-bold text-slate-700">Confirm New Password</Label>
                                                    <Input
                                                        type="password"
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                        className="h-11 bg-slate-100/50 border-slate-200 rounded-xl"
                                                    />
                                                </div>
                                                <Button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="w-full bg-slate-900 hover:bg-black text-white font-bold h-12 rounded-xl shadow-lg transition-all"
                                                >
                                                    {isLoading ? "Updating..." : "Change Password"}
                                                </Button>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                            {activeTab === "notifications" && (
                                <motion.div
                                    key="notifications"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <Card className="border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-white/90 backdrop-blur-md">
                                        <CardHeader className="bg-gradient-to-br from-green-600 to-green-700 text-white p-8">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white/10 rounded-2xl">
                                                    <Bell className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-2xl font-bold">Notification Preferences</CardTitle>
                                                    <CardDescription className="text-green-100">Choose how you want to be notified.</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-8 space-y-6">
                                            {[
                                                { title: "Email Alerts", desc: "Receive email for every transaction.", icon: Mail, enabled: true },
                                                { title: "Security Alerts", desc: "Get notified about suspicious logins.", icon: ShieldAlert, enabled: true },
                                                { title: "Marketing", desc: "Receive updates about new features.", icon: Settings, enabled: false },
                                                { title: "SMS Notifications", desc: "Get text messages for transfers.", icon: Phone, enabled: true },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-green-600 shadow-sm transition-colors">
                                                            <item.icon className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900">{item.title}</p>
                                                            <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                    <div className={cn(
                                                        "h-6 w-11 rounded-full relative cursor-pointer transition-colors",
                                                        item.enabled ? "bg-green-600" : "bg-slate-200"
                                                    )}>
                                                        <div className={cn(
                                                            "h-4 w-4 bg-white rounded-full absolute top-1 transition-all",
                                                            item.enabled ? "left-6" : "left-1"
                                                        )} />
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="pt-4">
                                                <Button className="w-full bg-slate-900 hover:bg-black text-white font-bold h-12 rounded-xl">
                                                    Update Preferences
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Account Security Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-md overflow-hidden">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <ShieldCheck className="h-5 w-5 text-green-600" />
                                        Verification Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-4 rounded-2xl bg-slate-50 flex items-center justify-between border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            {user?.bankAccount?.verified ? (
                                                <div className="p-2 bg-green-100 rounded-full"><CheckCircle className="h-4 w-4 text-green-600" /></div>
                                            ) : (
                                                <div className="p-2 bg-yellow-100 rounded-full"><AlertCircle className="h-4 w-4 text-yellow-600" /></div>
                                            )}
                                            <span className="font-semibold text-slate-700">Identity Verified</span>
                                        </div>
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            user?.bankAccount?.verified ? "bg-green-600 text-white" : "bg-yellow-500 text-white"
                                        )}>
                                            {user?.bankAccount?.verified ? "Success" : "Pending"}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-md overflow-hidden">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <ShieldAlert className="h-5 w-5 text-green-600" />
                                        Withdrawal Access
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-4 rounded-2xl bg-slate-50 flex items-center justify-between border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            {user?.bankAccount?.canTransfer ? (
                                                <div className="p-2 bg-green-100 rounded-full"><CheckCircle className="h-4 w-4 text-green-600" /></div>
                                            ) : (
                                                <div className="p-2 bg-red-100 rounded-full"><ShieldAlert className="h-4 w-4 text-red-600" /></div>
                                            )}
                                            <span className="font-semibold text-slate-700">Transfer Status</span>
                                        </div>
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            user?.bankAccount?.canTransfer ? "bg-green-600 text-white" : "bg-red-500 text-white"
                                        )}>
                                            {user?.bankAccount?.canTransfer ? "Enabled" : "Restricted"}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
