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

    const { txRef, imfCode } = await request.json()

    if (!txRef || !imfCode) {
      return NextResponse.json({ message: "Transaction reference and IMF code are required" }, { status: 400 })
    }

    await dbConnect()

    const transfer = await Transfer.findOne({ txRef, userId: user._id.toString() })
    if (!transfer) {
      return NextResponse.json({ message: "Transfer not found" }, { status: 404 })
    }

    if (transfer.txRegion !== "international") {
      return NextResponse.json({ message: "IMF code is only required for international transfers" }, { status: 400 })
    }

    // Check if COT was verified first
    if (!transfer.verificationSteps?.cotVerified) {
      return NextResponse.json({ message: "COT code must be verified before IMF code" }, { status: 400 })
    }

    // Get system IMF code
    const systemCodes = await SystemOption.findOne({ key: "bank:transfer.codes" })
    const validCodes = systemCodes?.value || {
      cot: "2349",
      imf: "7325",
      esi: "8159",
      dco: "9061",
      tax: "4412",
      tac: "3427",
    }
    const validImfCode = validCodes.imf || "7325"

    if (imfCode !== validImfCode) {
      return NextResponse.json({ message: "Invalid IMF code" }, { status: 400 })
    }

    // Update verification steps
    if (!transfer.verificationSteps) transfer.verificationSteps = {}
    transfer.verificationSteps.imfVerified = true
    transfer.verificationSteps.imfCode = imfCode
    transfer.verificationSteps.imfVerifiedAt = new Date()
    transfer.markModified("verificationSteps")
    await transfer.save()

    return NextResponse.json({
      message: "IMF code verified successfully",
      nextStep: "esi",
      txRef: transfer.txRef,
    })
  } catch (error) {
    console.error("IMF verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
