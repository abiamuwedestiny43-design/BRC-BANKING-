import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { verifyPIN, logAuditEvent, getClientIP } from "@/lib/security"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { pin } = await request.json()

    if (!pin || pin.length !== 4) {
      return NextResponse.json({ message: "Invalid PIN format" }, { status: 400 })
    }

    const isValid = await verifyPIN(user._id.toString(), pin)
    const ip = getClientIP(request)

    logAuditEvent({
      userId: user._id.toString(),
      action: "pin_verification",
      details: { success: isValid },
      ipAddress: ip,
      userAgent: request.headers.get("user-agent") || "unknown",
      success: isValid,
    })

    if (!isValid) {
      return NextResponse.json({ message: "Invalid PIN" }, { status: 401 })
    }

    return NextResponse.json({ message: "PIN verified successfully" })
  } catch (error) {
    console.error("PIN verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
