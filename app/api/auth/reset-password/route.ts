import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import { sendPasswordChangeEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const { token, email, newPassword } = await request.json()

    if (!token || !email || !newPassword) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({ 
      email: email.toLowerCase(),
      vCode: resetTokenHash,
      resetPasswordExpiry: { $gt: Date.now() }
    })

    if (!user) {
      return NextResponse.json({ 
        message: "Invalid or expired reset token" 
      }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // Update password and clear reset token
    user.password = hashedPassword
    user.vCode = undefined
    user.resetPasswordExpiry = undefined
    await user.save()

    // Send confirmation email
    try {
      await sendPasswordChangeEmail(
        user.email,
        `${user.bankInfo.bio.firstname} ${user.bankInfo.bio.lastname}`
      )
    } catch (emailError) {
      console.error("Failed to send password change email:", emailError)
      // Continue even if email fails
    }

    return NextResponse.json({ 
      message: "Password reset successfully. You can now login with your new password." 
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
