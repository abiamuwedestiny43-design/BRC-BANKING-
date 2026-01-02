import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/database"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import SystemOption from "@/models/SystemOption"

const KEY = "bank:transfer.codes"

export async function GET() {
  try {
    await dbConnect()
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const opt = await SystemOption.findOne({ key: KEY }).lean()
    return NextResponse.json({
      codes: opt?.value || { cot: "", imf: "", esi: "", dco: "", tax: "", tac: "" },
    })
  } catch (e) {
    console.error("Transfer codes GET error:", e)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    const user = await getCurrentUser()
    if (!user || !isAdmin(user)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { cot, imf, esi, dco, tax, tac } = await request.json()
    const value = {
      cot: String(cot || "").trim(),
      imf: String(imf || "").trim(),
      esi: String(esi || "").trim(),
      dco: String(dco || "").trim(),
      tax: String(tax || "").trim(),
      tac: String(tac || "").trim(),
    }

    await SystemOption.findOneAndUpdate(
      { key: KEY },
      { $set: { value, epoch: Math.floor(Date.now() / 1000) } },
      { upsert: true },
    )

    return NextResponse.json({ message: "Transfer codes updated" })
  } catch (e) {
    console.error("Transfer codes PUT error:", e)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
