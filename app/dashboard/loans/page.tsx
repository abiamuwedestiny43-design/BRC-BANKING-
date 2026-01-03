// app/dashboard/loans/page.tsx
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Loan from "@/models/Loan"
import { toPlainObject } from "@/lib/serialization"
import { redirect } from "next/navigation"
import LoansClient from "./LoansClient"

async function getUserLoans(userId: string) {
  await dbConnect()
  const loans = await Loan.find({ userId }).sort({ appliedDate: -1 })
  return loans.map(loan => toPlainObject(loan))
}

export default async function LoansPage() {
  const userDoc = await getCurrentUser()
  if (!userDoc) {
    redirect("/login")
  }

  const user = toPlainObject(userDoc)
  const loans = await getUserLoans(user._id.toString())

  return <LoansClient loans={loans} />
}
