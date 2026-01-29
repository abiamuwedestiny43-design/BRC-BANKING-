import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import Transfer from "@/models/Transfer"
import TransferMeta from "@/models/TransferMeta"
import Notification from "@/models/Notification"
import { isValidObjectId } from "mongoose"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !isAdmin(currentUser)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ message: "Valid User ID is required" }, { status: 400 })
    }

    await dbConnect()
    const user = await User.findById(id).lean()
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        _id: user._id?.toString(),
        email: user.email,
        roles: user.roles || [],
        bankInfo: user.bankInfo,
        bankOtp: user.bankOtp,
        bankAccount: user.bankAccount,
        bankNumber: user.bankNumber,
        usercode: user.usercode,
        transferCodeRequired: user.transferCodeRequired,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !isAdmin(currentUser)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ message: "Valid User ID is required" }, { status: 400 })
    }

    await dbConnect()
    const body = await request.json()

    // Build safe whitelist update payload
    const $set: Record<string, any> = {}
    const setIfExists = (path: string, val: any) => {
      if (typeof val !== "undefined") $set[path] = val
    }

    setIfExists("email", body.email)
    setIfExists("bankInfo.bio.firstname", body.firstname)
    setIfExists("bankInfo.bio.lastname", body.lastname)
    setIfExists("bankInfo.bio.phone", body.phone)
    setIfExists("bankInfo.bio.birthdate", body.birthdate ? new Date(body.birthdate) : null)
    setIfExists("bankInfo.bio.gender", body.gender)
    setIfExists("bankInfo.bio.religion", body.religion)
    setIfExists("bankInfo.address.location", body.location)
    setIfExists("bankInfo.address.city", body.city)
    setIfExists("bankInfo.address.state", body.state)
    setIfExists("bankInfo.address.country", body.country)
    setIfExists("bankInfo.address.zipcode", body.zipcode)
    setIfExists("bankInfo.system.currency", body.currency)
    setIfExists("bankAccount.verified", body.verified)
    setIfExists("bankAccount.canTransfer", body.canTransfer)
    setIfExists("bankAccount.canLocalTransfer", body.canLocalTransfer)
    setIfExists("bankAccount.canInternationalTransfer", body.canInternationalTransfer)
    setIfExists("bankOtp.email", body.otpEmail)
    setIfExists("bankOtp.transferCode", body.otpTransferCode)

    if (typeof body.transferCodeRequired !== "undefined") {
      $set["transferCodeRequired"] = body.transferCodeRequired === true || body.transferCodeRequired === "true"
    }

    if (Array.isArray(body.roles)) {
      const roles = body.roles.filter((r: unknown) => typeof r === "string")
      setIfExists("roles", roles)
    }

    // Prevent email duplication
    if (typeof body.email === "string") {
      const existing = await User.findOne({ email: body.email, _id: { $ne: id } })
      if (existing) {
        return NextResponse.json({ message: "Email already taken by another user" }, { status: 400 })
      }
    }

    const updated = await User.findByIdAndUpdate(id, { $set }, { new: true })
    if (!updated) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User updated successfully" })
  } catch (error) {
    console.error("Patch user error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !isAdmin(currentUser)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    if (!id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 })
    }

    await dbConnect()

    // Check if user exists
    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Prevent deletion of admin users
    if (user.roles.includes("administrator") || user.roles.includes("super-admin")) {
      return NextResponse.json({ message: "Cannot delete admin users" }, { status: 403 })
    }

    // Delete related data
    await Transfer.deleteMany({
      $or: [{ bankAccount: user.bankNumber }, { senderAccount: user.bankNumber }],
    })

    await TransferMeta.deleteMany({ userId: user._id })
    await Notification.deleteMany({ userId: user._id })

    // Delete the user
    await User.findByIdAndDelete(id)

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
