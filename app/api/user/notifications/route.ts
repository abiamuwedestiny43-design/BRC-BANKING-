import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Notification from "@/models/Notification"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const url = new URL(request.url)
    const viewed = url.searchParams.get("viewed")
    const filter: any = { userId: user._id, hidden: false }
    if (viewed === "true") filter.viewed = true
    if (viewed === "false") filter.viewed = false

    const notifications = await Notification.find(filter).sort({ period: -1 }).limit(100).lean()
    return NextResponse.json({
      notifications: notifications.map((n) => ({
        _id: n._id.toString(),
        message: n.message,
        period: n.period,
        viewed: !!n.viewed,
        redirect: n.redirect || null,
        image: n.image || null,
      })),
    })
  } catch (e) {
    console.error("Notifications GET error:", e)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH() {
  try {
    await dbConnect()
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    await Notification.updateMany({ userId: user._id, viewed: false }, { $set: { viewed: true } })
    return NextResponse.json({ message: "Marked as read" })
  } catch (e) {
    console.error("Notifications PATCH error:", e)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
