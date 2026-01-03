// app/dashboard/transactions/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, Search, Filter, ChevronLeft, ChevronRight, Download } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils/banking"
import TransactionsList from "./TransactionsList"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Transfer from "@/models/Transfer"
import { toPlainObject } from "@/lib/serialization"

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

    // Use aggregation to fetch data and count
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
      // Apply Type Filter if present
      ...(filters.type && filters.type !== "all"
        ? [{ $match: { "meta.txType": filters.type } }]
        : []
      ),
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $sort: { createdAt: -1 } },
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
        createdAt: transfer.completedAt || transfer.createdAt,
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
  try {
    const userDoc = await getCurrentUser()
    if (!userDoc) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-green-50 to-white">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-2xl font-bold text-slate-800">Authentication Required</h1>
            <p className="text-slate-600 mt-2">Please log in to view transactions</p>
          </div>
        </div>
      )
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-start justify-center p-4 pt-[80px]">
        <div className="w-full max-w-6xl space-y-8">
          {/* Header */}
          <div className="animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">History</h1>
                <p className="text-slate-600">View all your account transactions</p>
              </div>
              <Button
                asChild
                className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-green-200 transition-all duration-300"
              >
                <Link href="/dashboard">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>

          {/* Filters Card */}
          <Card className="animate-fade-in-up animation-delay-100 border-green-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-slate-800">Filters</CardTitle>
              <CardDescription className="text-slate-600">
                Filter your transactions by status, type, or search
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionsList
                initialTransactions={transactions}
                total={total}
                currentPage={page}
                totalPages={totalPages}
                currentFilters={{ status, type, search }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in TransactionsPage:", error)
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-green-50 to-white">
        <div className="text-center max-w-md animate-fade-in-up">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h1>
          <p className="text-slate-600">
            Please try again later or contact support if the problem persists.
          </p>
        </div>
      </div>
    )
  }
}
