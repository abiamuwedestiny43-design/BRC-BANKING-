import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Transfer from "@/models/Transfer"
import SystemOption from "@/models/SystemOption"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { txRef, cotCode } = await request.json()

    if (!txRef || !cotCode) {
      return NextResponse.json({ message: "Transaction reference and COT code are required" }, { status: 400 })
    }

    await dbConnect()

    const transfer = await Transfer.findOne({ txRef, userId: user._id.toString() })
    if (!transfer) {
      return NextResponse.json({ message: "Transfer not found" }, { status: 404 })
    }

    if (transfer.txRegion !== "international") {
      return NextResponse.json({ message: "COT code is only required for international transfers" }, { status: 400 })
    }

    // Get system COT code
    const systemCodes = await SystemOption.findOne({ key: "bank:transfer.codes" })
    const validCodes = systemCodes?.value || {
      cot: "2349",
      imf: "7325",
      esi: "8159",
      dco: "9061",
      tax: "4412",
      tac: "3427",
    }
    const validCotCode = validCodes.cot || "2349"

    if (cotCode !== validCotCode) {
      return NextResponse.json({ message: "Invalid COT code" }, { status: 400 })
    }

    // Update verification steps
    if (!transfer.verificationSteps) transfer.verificationSteps = {}
    transfer.verificationSteps.cotVerified = true
    transfer.verificationSteps.cotCode = cotCode
    transfer.verificationSteps.cotVerifiedAt = new Date()
    transfer.markModified("verificationSteps")
    await transfer.save()

    return NextResponse.json({
      message: "COT code verified successfully",
      nextStep: "imf",
      txRef: transfer.txRef,
    })
  } catch (error) {
    console.error("COT verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
