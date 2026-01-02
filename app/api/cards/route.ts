// app/api/cards/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Card from "@/models/Card"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cards = await Card.find({ userId: user._id }).sort({ date: -1 })

    return NextResponse.json({ cards })
  } catch (error) {
    console.error("Error fetching cards:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
