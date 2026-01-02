import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import { sendAccountVerificationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !isAdmin(currentUser)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 })
    }

    await dbConnect()
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    user.bankAccount.verified = true
    user.bankAccount.canTransfer = true
    await user.save()

    try {
      await sendAccountVerificationEmail(
        user.email,
        `${user.bankInfo.bio.firstname} ${user.bankInfo.bio.lastname}`,
        user.bankNumber,
      )
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
      // Don't fail approval if email fails
    }

    return NextResponse.json({ message: "Account approved successfully" })
  } catch (error) {
    console.error("Account approval error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
