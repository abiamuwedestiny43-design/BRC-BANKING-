// app/api/loans/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Loan from "@/models/Loan"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const loans = await Loan.find({ userId: user._id }).sort({ appliedDate: -1 })

    return NextResponse.json({ loans })
  } catch (error) {
    console.error("Error fetching loans:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
