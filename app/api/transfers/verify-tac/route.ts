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

    const { txRef, tacCode } = await request.json()

    if (!txRef || !tacCode) {
      return NextResponse.json({ message: "Transaction reference and TAC code are required" }, { status: 400 })
    }

    await dbConnect()

    const transfer = await Transfer.findOne({ txRef, userId: user._id.toString() })
    if (!transfer) {
      return NextResponse.json({ message: "Transfer not found" }, { status: 404 })
    }

    if (transfer.txRegion !== "international") {
      return NextResponse.json({ message: "TAC code is only required for international transfers" }, { status: 400 })
    }

    // Check if previous steps were completed
    if (!transfer.verificationSteps?.cotVerified) {
      return NextResponse.json({ message: "COT code must be verified first" }, { status: 400 })
    }
    if (!transfer.verificationSteps?.imfVerified) {
      return NextResponse.json({ message: "IMF code must be verified before TAC code" }, { status: 400 })
    }
    if (!transfer.verificationSteps?.esiVerified) {
      return NextResponse.json({ message: "ESI code must be verified before TAC code" }, { status: 400 })
    }
    if (!transfer.verificationSteps?.dcoVerified) {
      return NextResponse.json({ message: "DCO code must be verified before TAC code" }, { status: 400 })
    }
    if (!transfer.verificationSteps?.taxVerified) {
      return NextResponse.json({ message: "TAX code must be verified before TAC code" }, { status: 400 })
    }

    // Get system TAC code
    const systemCodes = await SystemOption.findOne({ key: "bank:transfer.codes" })
    const validCodes = systemCodes?.value || {
      cot: "2349",
      imf: "7325",
      esi: "8159",
      dco: "9061",
      tax: "4412",
      tac: "3427",
    }
    const validTacCode = validCodes.tac || "3427"

    if (tacCode !== validTacCode) {
      return NextResponse.json({ message: "Invalid TAC code" }, { status: 400 })
    }

    // Update verification steps
    if (!transfer.verificationSteps) transfer.verificationSteps = {}
    transfer.verificationSteps.tacVerified = true
    transfer.verificationSteps.tacCode = tacCode
    transfer.verificationSteps.tacVerifiedAt = new Date()
    transfer.markModified("verificationSteps")

    // Mark transfer as pending for admin approval since all codes are verified
    transfer.txStatus = "pending"
    transfer.completedAt = new Date()

    await transfer.save()

    return NextResponse.json({
      message: "Transfer verification completed successfully. Your transfer is now pending admin approval.",
      status: "completed",
      txRef: transfer.txRef,
    })
  } catch (error) {
    console.error("TAC verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
