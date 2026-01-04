// app/dashboard/transactions/page.tsx
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import TransactionsList from "./TransactionsList"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Transfer from "@/models/Transfer"
import { toPlainObject } from "@/lib/serialization"
import { redirect } from "next/navigation"

async function getTransactionsData(userId: string, page: number = 1, limit: number = 10, filters: any = {}) {
  await dbConnect()

  const matchStage: any = { userId }

  if (filters.status && filters.status !== "all") {
    matchStage.txStatus = filters.status
  }

  if (filters.search) {
    matchStage.$or = [
      { txRef: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
      { "accountHolder": { $regex: filters.search, $options: "i" } }
    ]
  }

  try {
    const skip = (page - 1) * limit

    const [result] = await Transfer.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "transfermetas",
          localField: "txRef",
          foreignField: "txRef",
          as: "meta"
        }
      },
      { $unwind: { path: "$meta", preserveNullAndEmptyArrays: true } },
      ...(filters.type && filters.type !== "all"
        ? [{ $match: { "meta.txType": filters.type } }]
        : []
      ),
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $sort: { txDate: -1 } },
            { $skip: skip },
            { $limit: limit }
          ]
        }
      }
    ])

    const transfers = result.data || []
    const total = result.metadata[0]?.total || 0

    const transactions = transfers.map((transfer: any) => {
      const txType = transfer.meta?.txType || 'debit'
      return {
        _id: transfer._id.toString(),
        txRef: transfer.txRef,
        txType: txType,
        amount: transfer.amount,
        currency: transfer.currency,
        createdAt: transfer.completedAt || transfer.txDate || transfer.createdAt || new Date(),
        status: transfer.txStatus,
        recipient: txType === 'credit' ? (transfer.senderName || transfer.accountHolder) : transfer.accountHolder,
        description: transfer.description,
      }
    })

    return { transactions, total, page, totalPages: Math.ceil(total / limit) }
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return { transactions: [], total: 0, page: 1, totalPages: 0 }
  }
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const userDoc = await getCurrentUser()
  if (!userDoc) {
    redirect("/login")
  }

  const user = toPlainObject(userDoc)
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1
  const status = (searchParams.status as string) || "all"
  const type = (searchParams.type as string) || "all"
  const search = (searchParams.search as string) || ""

  const { transactions, total, totalPages } = await getTransactionsData(
    user._id.toString(),
    page,
    10,
    { status, type, search }
  )

  return (
    <div className="min-h-screen bg-[#001c10] w-full p-4 md:p-8 lg:p-12 pt-24 md:pt-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10">
        <TransactionsList
          initialTransactions={transactions}
          total={total}
          currentPage={page}
          totalPages={totalPages}
          currentFilters={{ status, type, search }}
        />
      </div>
    </div>
  )
}
