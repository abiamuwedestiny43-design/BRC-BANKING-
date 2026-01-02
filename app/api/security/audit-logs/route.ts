import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import { getAuditLogs } from "@/lib/security"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const userId = isAdmin(user) ? searchParams.get("userId") : user._id.toString()

    const logs = getAuditLogs(userId || undefined, limit)

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("Audit logs error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
