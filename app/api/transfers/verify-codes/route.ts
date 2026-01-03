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

    const { txRef, transferCodes } = await request.json()

    if (!txRef || !transferCodes) {
      return NextResponse.json({ message: "Transaction reference and codes are required" }, { status: 400 })
    }

    await dbConnect()

    const transfer = await Transfer.findOne({ txRef })
    if (!transfer) {
      return NextResponse.json({ message: "Transfer not found" }, { status: 404 })
    }

    // Get system transfer codes
    const systemCodes = await SystemOption.findOne({ key: "bank:transfer.codes" })
    const validCodes = systemCodes?.value || {
      cot: "2349",
      imf: "7325",
      esi: "8159",
      dco: "9061",
      tax: "4412",
      tac: "3427",
    }

    const requiredCodes = {
      cot: validCodes.cot,
      imf: validCodes.imf,
      esi: validCodes.esi,
      dco: validCodes.dco,
      tax: validCodes.tax,
      tac: validCodes.tac,
    }

    if (
      transferCodes.cot !== requiredCodes.cot ||
      transferCodes.imf !== requiredCodes.imf ||
      transferCodes.esi !== requiredCodes.esi ||
      transferCodes.dco !== requiredCodes.dco ||
      transferCodes.tax !== requiredCodes.tax ||
      transferCodes.tac !== requiredCodes.tac
    ) {
      return NextResponse.json({ message: "Invalid transfer codes" }, { status: 400 })
    }

    // Store the codes in transfer record
    transfer.transferCodes = transferCodes
    transfer.txStatus = "pending" // Keep as pending for admin approval
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
      message: "Transfer codes verified. Your transfer is now pending admin approval.",
      txRef: transfer.txRef,
    })
  } catch (error) {
    console.error("Code verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
