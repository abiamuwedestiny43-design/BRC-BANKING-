import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import { getTokenPayload, verifyPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json()

    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return NextResponse.json({ message: "Invalid PIN format" }, { status: 400 })
    }

    // Get user from cookie token
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const payload = getTokenPayload(token)
    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    await dbConnect()
    const user = await User.findById(payload.id)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const isValidPin = await verifyPassword(pin, user.bankInfo.security.pin)

    if (!isValidPin) {
      return NextResponse.json({ message: "Invalid PIN" }, { status: 401 })
    }

    if (!user.roles.includes("super-admin")) {
      return NextResponse.json({ message: "PIN verified successfully" })
    }

    return NextResponse.json({ message: "PIN verified successfully" })
  } catch (error) {
    console.error("PIN verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
