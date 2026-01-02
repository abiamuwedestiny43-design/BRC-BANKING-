// app/api/system/local-transfer-enabled/route.ts
// Public read endpoint so the client UI can reflect whether local transfers are enabled
import { NextResponse } from "next/server"
import dbConnect from "@/lib/database"
import SystemOption from "@/models/SystemOption"

const KEY = "bank:transfer.local.enabled"

export async function GET() {
  await dbConnect()
  const opt = await SystemOption.findOne({ key: KEY }).lean()
  // default to enabled if not set
  const enabled = typeof opt?.value === "boolean" ? (opt.value as boolean) : true
  return NextResponse.json({ enabled })
}
