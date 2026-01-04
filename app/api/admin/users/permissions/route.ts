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

    const { userId, type, enabled } = await request.json()

    if (!userId || !type) {
      return NextResponse.json({ message: "User ID and Type are required" }, { status: 400 })
    }

    await dbConnect()
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    if (type === "local") {
      user.bankAccount.canLocalTransfer = enabled
    } else if (type === "international") {
      user.bankAccount.canInternationalTransfer = enabled
    } else if (type === "all") {
      user.bankAccount.canTransfer = enabled
    } else {
      return NextResponse.json({ message: "Invalid type" }, { status: 400 })
    }

    await user.save()

    return NextResponse.json({
      message: `Protocol updated successfully`,
      user: {
        id: user._id,
        canLocalTransfer: user.bankAccount.canLocalTransfer,
        canInternationalTransfer: user.bankAccount.canInternationalTransfer,
        canTransfer: user.bankAccount.canTransfer
      }
    })
  } catch (error) {
    console.error("Update permissions error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !isAdmin(currentUser)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const identifier = searchParams.get("identifier")

    if (!identifier) {
      return NextResponse.json({ message: "Identifier is required" }, { status: 400 })
    }

    console.log(`[Permission API] Searching for identity node with identifier: ${identifier}`)
    await dbConnect()
    
    let user = null
    // Try by ID first
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(identifier).select("bankAccount email bankInfo.bio")
    }
    
    // If not found by ID, try by email (case-insensitive)
    if (!user) {
      user = await User.findOne({ 
        email: { $regex: new RegExp(`^${identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") } 
      }).select("bankAccount email bankInfo.bio")
    }

    if (!user) {
      return NextResponse.json({ message: "Identity node not found." }, { status: 404 })
    }

    return NextResponse.json({
      id: user._id,
      email: user.email,
      name: `${user.bankInfo.bio.firstname} ${user.bankInfo.bio.lastname}`,
      canLocalTransfer: user.bankAccount.canLocalTransfer,
      canInternationalTransfer: user.bankAccount.canInternationalTransfer,
      canTransfer: user.bankAccount.canTransfer
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
