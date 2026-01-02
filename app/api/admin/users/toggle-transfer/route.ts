import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import dbConnect from "@/lib/database"
import User from "@/models/User"

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

    user.bankAccount.canTransfer = !user.bankAccount.canTransfer
    await user.save()

    return NextResponse.json({
      message: `Transfer ${user.bankAccount.canTransfer ? "enabled" : "disabled"} successfully`,
    })
  } catch (error) {
    console.error("Toggle transfer error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
