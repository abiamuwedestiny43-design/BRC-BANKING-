// app/api/admin/cards/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Card from "@/models/Card"
import User from "@/models/User"
import { sendCardStatusUpdateEmail } from "@/lib/email"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const user = await getCurrentUser()
    
    if (!user || !user.roles.includes('super-admin')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const query: any = {}
    if (status && status !== 'all') {
      query.status = status
    }

    const cards = await Card.find(query)
      .populate('userId', 'bankInfo bankNumber email')
      .sort({ date: -1 })

    return NextResponse.json({ cards })
  } catch (error) {
    console.error("Error fetching cards:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect()
    const user = await getCurrentUser()
    
    if (!user || !user.roles.includes('super-admin')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { cardId, status } = await request.json()

    if (!cardId || !status) {
      return NextResponse.json({ error: "Card ID and status are required" }, { status: 400 })
    }

    const card = await Card.findById(cardId).populate('userId')
    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    const previousStatus = card.status
    card.status = status
    
    if (status === 'active') {
      card.approvedDate = new Date()
    }

    await card.save()

    // Send email notification if status changed
    if (previousStatus !== status) {
      const userInfo = card.userId as any
      await sendCardStatusUpdateEmail(
        userInfo?.email,
        userInfo?.bankInfo?.bio?.firstname,
        card.cardType,
        card.vendor,
        status,
        status === 'active' ? card.cardNumber : undefined
      )
    }

    return NextResponse.json({ 
      message: "Card status updated successfully",
      card 
    })
  } catch (error) {
    console.error("Error updating card status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
