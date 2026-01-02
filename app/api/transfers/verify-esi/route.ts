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

    const { txRef, esiCode } = await request.json()
    if (!txRef || !esiCode) {
      return NextResponse.json({ message: "Transaction reference and ESI code are required" }, { status: 400 })
    }

    await dbConnect()
    const transfer = await Transfer.findOne({ txRef, userId: user._id.toString() })
    if (!transfer) return NextResponse.json({ message: "Transfer not found" }, { status: 404 })
    if (transfer.txRegion !== "international") {
      return NextResponse.json({ message: "ESI code is only required for international transfers" }, { status: 400 })
    }
    if (!transfer.verificationSteps?.cotVerified || !transfer.verificationSteps?.imfVerified) {
      return NextResponse.json({ message: "COT and IMF must be verified before ESI" }, { status: 400 })
    }

    const systemCodes = await SystemOption.findOne({ key: "bank:transfer.codes" })
    const validCodes = systemCodes?.value || {
      cot: "2349",
      imf: "7325",
      esi: "8159",
      dco: "9061",
      tax: "4412",
      tac: "3427",
    }
    const validEsiCode = validCodes.esi || "8159"

    if (esiCode !== validEsiCode) {
      return NextResponse.json({ message: "Invalid ESI code" }, { status: 400 })
    }

    if (!transfer.verificationSteps) transfer.verificationSteps = {}
    transfer.verificationSteps.esiVerified = true
    transfer.verificationSteps.esiCode = esiCode
    transfer.verificationSteps.esiVerifiedAt = new Date()
    transfer.markModified("verificationSteps")
    await transfer.save()

    return NextResponse.json({ message: "ESI code verified successfully", nextStep: "dco", txRef: transfer.txRef })
  } catch (error) {
    console.error("ESI verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
