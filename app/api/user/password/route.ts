// app/api/user/password/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import { verifyPassword, hashPassword } from "@/lib/auth"
import { sendPasswordChangeEmail } from "@/lib/email"

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect()
    const userDoc = await getCurrentUser()
    
    if (!userDoc) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters long" }, { status: 400 })
    }

    // Verify current password
    const user = await User.findById(userDoc._id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword)

    // Update password
    user.password = hashedNewPassword
    await user.save()

    // Send confirmation email
    try {
      await sendPasswordChangeEmail(
        user.email,
        `${user.bankInfo.bio.firstname} ${user.bankInfo.bio.lastname}`
      )
    } catch (emailError) {
      console.error("Failed to send password change email:", emailError)
    }

    return NextResponse.json({ 
      message: "Password changed successfully"
    })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
