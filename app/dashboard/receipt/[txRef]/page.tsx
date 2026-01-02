// app/dashboard/receipt/[txRef]/page.tsx
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Transfer from "@/models/Transfer"
import { redirect } from "next/navigation"
import ReceiptPage from "../ReceiptPage" // client component in same folder

type Props = { params: { txRef: string } }

async function getTransfer(txRef: string) {
  await dbConnect()
  return Transfer.findOne({ txRef }).lean()
}

export default async function Page({ params }: Props) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const transfer = await getTransfer(params.txRef)
  if (!transfer) redirect("/dashboard")

  // Pass plain JSON to client component
  return <ReceiptPage transfer={JSON.parse(JSON.stringify(transfer))} />
}
