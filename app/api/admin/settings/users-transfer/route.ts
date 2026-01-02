import { NextResponse } from "next/server"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import dbConnect from "@/lib/database"
import User from "@/models/User"

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser()
  if (!currentUser || !isAdmin(currentUser)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
  const body = await request.json()
  const canTransfer = Boolean(body?.canTransfer)
  await dbConnect()
  const result = await User.updateMany({}, { $set: { "bankAccount.canTransfer": canTransfer } })
  return NextResponse.json({ updated: result.modifiedCount })
}
