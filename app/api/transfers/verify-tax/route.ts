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

    const { txRef, taxCode } = await request.json()
    if (!txRef || !taxCode) {
      return NextResponse.json({ message: "Transaction reference and TAX code are required" }, { status: 400 })
    }

    await dbConnect()
    const transfer = await Transfer.findOne({ txRef, userId: user._id.toString() })
    if (!transfer) return NextResponse.json({ message: "Transfer not found" }, { status: 404 })
    if (transfer.txRegion !== "international") {
      return NextResponse.json({ message: "TAX code is only required for international transfers" }, { status: 400 })
    }
    if (!transfer.verificationSteps?.dcoVerified) {
      return NextResponse.json({ message: "DCO must be verified before TAX" }, { status: 400 })
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
    const validTaxCode = validCodes.tax || "4412"

    if (taxCode !== validTaxCode) {
      return NextResponse.json({ message: "Invalid TAX code" }, { status: 400 })
    }

    if (!transfer.verificationSteps) transfer.verificationSteps = {}
    transfer.verificationSteps.taxVerified = true
    transfer.verificationSteps.taxCode = taxCode
    transfer.verificationSteps.taxVerifiedAt = new Date()
    transfer.markModified("verificationSteps")
    await transfer.save()

    return NextResponse.json({ message: "TAX code verified successfully", nextStep: "tac", txRef: transfer.txRef })
  } catch (error) {
    console.error("TAX verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
