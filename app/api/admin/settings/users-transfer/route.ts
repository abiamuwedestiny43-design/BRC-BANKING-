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
  const enabled = Boolean(body?.enabled)
  const type = body?.type || "all"
  
  await dbConnect()
  
  let updateObj = {}
  if (type === "local") {
    updateObj = { "bankAccount.canLocalTransfer": enabled }
  } else if (type === "international") {
    updateObj = { "bankAccount.canInternationalTransfer": enabled }
  } else {
    updateObj = { "bankAccount.canTransfer": enabled }
  }
  
  const result = await User.updateMany({}, { $set: updateObj })
  return NextResponse.json({ updated: result.modifiedCount })
}
