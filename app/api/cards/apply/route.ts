// app/api/cards/apply/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Card from "@/models/Card"
import User from "@/models/User"
import { sendCardApplicationEmail } from "@/lib/email"
import { generateCardNumber, generateCVV, generateExpiryDate } from "@/lib/utils/card"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { cardType, vendor } = await request.json()

    if (!cardType || !vendor) {
      return NextResponse.json({ error: "Card type and vendor are required" }, { status: 400 })
    }

    // Check if user already has a pending application for the same card type
    const existingPendingCard = await Card.findOne({
      userId: user._id,
      cardType,
      status: "pending"
    })

    if (existingPendingCard) {
      return NextResponse.json({ error: "You already have a pending application for this card type" }, { status: 400 })
    }

    // Generate card details
    const cardNumber = generateCardNumber(vendor)
    const cvv = generateCVV()
    const expiry = generateExpiryDate()

    // Create new card application
    const card = new Card({
      userId: user._id,
      cardType,
      vendor,
      cvv,
      cardNumber,
      expiry,
      cardHolderName: `${user.bankInfo.bio.firstname} ${user.bankInfo.bio.lastname}`,
      status: "pending"
    })

    await card.save()

    // Send email notification
    await sendCardApplicationEmail(
      user.email,
      user.bankInfo.bio.firstname,
      cardType,
      vendor
    )

    return NextResponse.json({ 
      message: "Card application submitted successfully", 
      card: {
        id: card._id,
        cardType,
        vendor,
        status: card.status
      }
    })
  } catch (error) {
    console.error("Error applying for card:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
