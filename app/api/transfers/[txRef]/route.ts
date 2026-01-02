import { NextResponse, type NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Transfer from "@/models/Transfer"

export async function GET(_: NextRequest, { params }: { params: { txRef: string } }) {
  try {
    await dbConnect()
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const transfer = await Transfer.findOne({ txRef: params.txRef, userId: user._id.toString() }).lean()
    if (!transfer) return NextResponse.json({ message: "Transfer not found" }, { status: 404 })

    return NextResponse.json({
      transfer: {
        txRef: transfer.txRef,
        amount: transfer.amount,
        currency: transfer.currency,
        accountHolder: transfer.accountHolder || transfer.bankHolder,
        bankName: transfer.bankName,
        txRegion: transfer.txRegion,
        txStatus: transfer.txStatus,
      },
    })
  } catch (e) {
    console.error("Transfer GET error:", e)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
