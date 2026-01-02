import { NextResponse } from "next/server"
import dbConnect from "@/lib/database"
import SystemOption from "@/models/SystemOption"

const KEY = "bank:transfer.global.enabled"

export async function GET() {
  await dbConnect()
  const opt = await SystemOption.findOne({ key: KEY }).lean()
  const enabled = typeof opt?.value === "boolean" ? (opt.value as boolean) : true
  return NextResponse.json({ enabled })
}
