"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft } from "lucide-react"

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()

    const token = searchParams.get("token")
    const email = searchParams.get("email")

    useEffect(() => {
        if (!token || !email) {
            setError("Invalid reset link. Please request a new one.")
        }
    }, [token, email])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        setIsLoading(true)
        setError("")
        setMessage("")

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, email, newPassword }),
            })

            const data = await response.json()

            if (response.ok) {
                setMessage(data.message)
                setTimeout(() => {
                    router.push("/login")
                }, 3000)
            } else {
                setError(data.message || "Something went wrong")
            }
        } catch (error) {
            setError("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (!token || !email) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-gray-900">
                <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md border border-white/20">
                    <CardContent className="pt-6 text-center">
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>Invalid or missing reset token.</AlertDescription>
                        </Alert>
                        <Link href="/forgot-password">
                            <Button variant="outline" className="w-full">Request New Link</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-900">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1650&q=80')",
                }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Card */}
            <Card className="relative w-full max-w-md mx-auto animate-fade-in-up bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-white tracking-tight">Reset Password</CardTitle>
                    <CardDescription className="text-white">Enter your new password below</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {message && (
                            <Alert className="bg-green-500/20 text-green-100 border-green-500/50">
                                <AlertDescription>{message}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-gray-100">
                                New Password
                            </Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                className="bg-white/80 focus:ring-2 focus:ring-primary"
                                minLength={6}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-gray-100">
                                Confirm Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                className="bg-white/80 focus:ring-2 focus:ring-primary"
                                minLength={6}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 shadow-md"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Reset Password
                        </Button>

                        <div className="text-center">
                            <Link href="/login" className="inline-flex items-center text-sm text-gray-200 hover:text-white hover:underline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
