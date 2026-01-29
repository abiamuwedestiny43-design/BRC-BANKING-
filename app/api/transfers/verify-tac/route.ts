import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Transfer from "@/models/Transfer"
import Notification from "@/models/Notification"
import SystemOption from "@/models/SystemOption"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { txRef, tacCode } = await request.json()

    if (!txRef || !tacCode) {
      return NextResponse.json({ message: "Transaction reference and Authorization Code are required" }, { status: 400 })
    }

    await dbConnect()

    const transfer = await Transfer.findOne({ txRef, userId: user._id.toString() })
    if (!transfer) {
      return NextResponse.json({ message: "Transfer not found" }, { status: 404 })
    }

    if (transfer.txRegion !== "international") {
      return NextResponse.json({ message: "Authorization Code is only required for international transfers" }, { status: 400 })
    }

    // Check if previous steps were completed
    if (!transfer.verificationSteps?.cotVerified || 
        !transfer.verificationSteps?.imfVerified || 
        !transfer.verificationSteps?.esiVerified || 
        !transfer.verificationSteps?.dcoVerified || 
        !transfer.verificationSteps?.taxVerified) {
      return NextResponse.json({ message: "All previous security codes must be verified first" }, { status: 400 })
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
      return NextResponse.json({ message: "Invalid Authorization Code" }, { status: 400 })
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

    // Notification for verification completion
    const completionNotification = new Notification({
      userId: user._id,
      model: "bank:transfer",
      message: `Hi ${user.bankInfo?.bio?.firstname || 'User'},
Your international wire of ${transfer.amount.toLocaleString()} ${transfer.currency} to ${transfer.bankHolder} has cleared all security tiers and is now Processing.
Ref: ${transfer.txRef}`,
      redirect: `/dashboard/receipt/${transfer.txRef}`,
    })
    await completionNotification.save()

    return NextResponse.json({
      message: "Transfer verification complete. Status: Processing.",
      status: "completed",
      txRef: transfer.txRef,
    })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
