import { NextResponse } from "next/server"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import dbConnect from "@/lib/database"
import SystemOption from "@/models/SystemOption"

const KEY = "bank:transfer.global.enabled"

export async function GET() {
  const currentUser = await getCurrentUser()
  if (!currentUser || !isAdmin(currentUser)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
  await dbConnect()
  const opt = await SystemOption.findOne({ key: KEY }).lean()
  const enabled = typeof opt?.value === "boolean" ? (opt.value as boolean) : true
  return NextResponse.json({ enabled })
}

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser()
  if (!currentUser || !isAdmin(currentUser)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
  await dbConnect()
  const body = await request.json()
  const enabled = Boolean(body?.enabled)
  await SystemOption.findOneAndUpdate(
    { key: KEY },
    { key: KEY, value: enabled, epoch: Math.floor(Date.now() / 1000) },
    { upsert: true, new: true },
  )
  return NextResponse.json({ message: "Updated", enabled })
}
