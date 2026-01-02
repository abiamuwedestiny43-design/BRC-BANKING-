import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Beneficiary from "@/models/Beneficiary"
import mongoose from "mongoose"

export async function GET() {
  try {
    await dbConnect()
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const list = await Beneficiary.find({ userId: user._id }).sort({ _id: -1 }).lean()
    return NextResponse.json({
      beneficiaries: list.map((b) => ({
        _id: b._id.toString(),
        bankAccount: b.bankAccount,
        bankRegion: b.bankRegion,
        bankInfo: b.bankInfo,
      })),
    })
  } catch (e) {
    console.error("Beneficiaries GET error:", e)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    if (!body.bankAccount || !body.bankInfo?.bankName || !body.bankInfo?.bankHolder || !body.bankRegion) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const doc = await Beneficiary.create({
      userId: user._id,
      bankAccount: String(body.bankAccount),
      bankRegion: body.bankRegion === "international" ? "international" : "local",
      bankInfo: {
        bankName: String(body.bankInfo.bankName),
        bankHolder: String(body.bankInfo.bankHolder),
        bankCountry: body.bankInfo.bankCountry || undefined,
        identifier: body.bankInfo.identifier || undefined,
        identifierCode: body.bankInfo.identifierCode || undefined,
      },
    })

    return NextResponse.json(
      { message: "Beneficiary added", beneficiary: { _id: doc._id.toString() } },
      { status: 201 },
    )
  } catch (e) {
    console.error("Beneficiaries POST error:", e)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect()
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await request.json()
    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: "Valid beneficiary id required" }, { status: 400 })
    }

    await Beneficiary.deleteOne({ _id: id, userId: user._id })
    return NextResponse.json({ message: "Beneficiary deleted" })
  } catch (e) {
    console.error("Beneficiaries DELETE error:", e)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
