import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Transfer from "@/models/Transfer"
import TransferMeta from "@/models/TransferMeta"
import Notification from "@/models/Notification"
import User from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { txRef, otpCode } = await request.json()
    if (!txRef || !otpCode) return NextResponse.json({ message: "Transaction reference and OTP required" }, { status: 400 })

    await dbConnect()

    const user = await User.findById(currentUser._id)
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 })

    const transfer = await Transfer.findOne({ txRef })
    if (!transfer) return NextResponse.json({ message: "Transfer not found" }, { status: 404 })

    if (transfer.otpCode !== otpCode) return NextResponse.json({ message: "Invalid OTP code" }, { status: 400 })
    if (transfer.otpExpiry && transfer.otpExpiry < new Date()) return NextResponse.json({ message: "OTP expired" }, { status: 400 })

    // Ensure bankBalance is a Map
    user.bankBalance = user.bankBalance instanceof Map ? user.bankBalance : new Map(Object.entries(user.bankBalance || {}))
    const currency = transfer.currency.toUpperCase()
    const currentBalance = user.bankBalance.get(currency) || 0
    const totalAmount = transfer.amount + transfer.txCharge

    if (currentBalance < totalAmount) return NextResponse.json({ message: "Insufficient balance" }, { status: 400 })

    // Debit balance
    user.bankBalance.set(currency, currentBalance - totalAmount)
    await user.save()

    // Update transfer status
    transfer.txStatus = "success"
    transfer.txType = "debit"
    await transfer.save()

    // Save TransferMeta
    const transferMeta = new TransferMeta({
      txRef: transfer.txRef, // string now
      accountNumber: user.bankNumber,
      txType: "debit",
      amount: totalAmount,
      status: true,
      userId: user._id,
    })
    await transferMeta.save()

    // Notification
    const notification = new Notification({
      userId: user._id,
      model: "bank:transfer",
      message: `Hi ${user.bankInfo.bio.firstname},
Amount ${transfer.amount.toLocaleString()} ${currency} debited.
Acc: ${user.bankNumber.slice(0, 3)}***${user.bankNumber.slice(-3)}
Desc: ${transfer.txReason || "Transfer"}
Recipient: ${transfer.bankHolder}
Time: ${new Date().toLocaleDateString()}
Total Bal: ${user.bankBalance.get(currency)?.toLocaleString()} ${currency}`,
      redirect: `/dashboard/receipt/${transfer.txRef}`,
    })
    await notification.save()

    return NextResponse.json({ message: "Transfer completed successfully", txRef: transfer.txRef })
  } catch (error) {
    console.error("OTP verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
