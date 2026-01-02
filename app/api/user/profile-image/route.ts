import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import { getTokenPayload } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const payload = getTokenPayload(token)
    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    await dbConnect()
    const user = await User.findByIdAndUpdate(payload.id, { profileImage: dataUrl }, { new: true })

    return NextResponse.json({
      message: "Profile image uploaded successfully",
      profileImage: dataUrl,
    })
  } catch (error) {
    console.error("Image upload error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
