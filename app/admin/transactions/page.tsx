// app/admin/transactions/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, Search, Filter, ChevronLeft, ChevronRight, Activity, ShieldCheck, Zap, Database, Globe, Lock, Clock } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils/banking"
import TransactionsList from "./TransactionsList"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Transfer from "@/models/Transfer"
import User from "@/models/User"
import { toPlainObject } from "@/lib/serialization"

async function getAllTransactionsData(page: number = 1, limit: number = 10, filters: any = {}) {
  await dbConnect()

  const query: any = {}

  if (filters.status && filters.status !== "all") {
    query.txStatus = filters.status
  }

  if (filters.type && filters.type !== "all") {
    query.txType = filters.type
  }

  if (filters.user && filters.user !== "all") {
    query.userId = filters.user
  }

  if (filters.search) {
    query.$or = [
      { txRef: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
      { "accountHolder": { $regex: filters.search, $options: "i" } }
    ]
  }

  try {
    const skip = (page - 1) * limit
    const transfers = await Transfer.find(query)
      .populate('userId', 'bankInfo.bio email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Transfer.countDocuments(query)

    const transactions = transfers.map(transfer => ({
      _id: transfer._id.toString(),
      txRef: transfer.txRef,
      txType: (transfer.txType || "debit") as "debit" | "credit",
      amount: transfer.amount,
      currency: transfer.currency,
      createdAt: transfer.completedAt || transfer.txDate || new Date(),
      status: transfer.txStatus,
      recipient: transfer.accountHolder,
      description: transfer.description,
      userId: (transfer.userId as any)?._id?.toString(),
      userName: (transfer.userId as any)?.bankInfo?.bio
        ? `${(transfer.userId as any).bankInfo.bio.firstname} ${(transfer.userId as any).bankInfo.bio.lastname}`
        : 'Unknown User',
      userEmail: (transfer.userId as any)?.email || 'No Email'
    }))

    return { transactions, total, page, totalPages: Math.ceil(total / limit) }
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return { transactions: [], total: 0, page: 1, totalPages: 0 }
  }
}

async function getAllUsers() {
  await dbConnect()
  try {
    const users = await User.find({})
      .select('_id bankInfo.bio email')
      .lean()

    return users.map((user: any) => ({
      id: user._id.toString(),
      name: user.bankInfo?.bio
        ? `${user.bankInfo.bio.firstname} ${user.bankInfo.bio.lastname}`
        : 'Unknown User',
      email: user.email
    }))
      .sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export default async function AdminTransactionsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  try {
    const userDoc = await getCurrentUser()
    if (!userDoc) {
      return (
        <div className="min-h-screen bg-[#001c10] flex items-center justify-center p-6 text-center">
          <div className="space-y-4">
            <h1 className="text-2xl font-black text-white uppercase tracking-widest">Authentication Breach</h1>
            <p className="text-slate-500">Authorized personnel only.</p>
            <Button asChild className="bg-emerald-500 text-black font-black uppercase tracking-widest text-xs px-8 py-4 rounded-xl">
              <Link href="/login">Re-authenticate</Link>
            </Button>
          </div>
        </div>
      )
    }

    const page = searchParams.page ? parseInt(searchParams.page as string) : 1
    const status = (searchParams.status as string) || "all"
    const type = (searchParams.type as string) || "all"
    const search = (searchParams.search as string) || ""
    const userFilter = (searchParams.user as string) || "all"

    const { transactions, total, totalPages } = await getAllTransactionsData(
      page,
      10,
      { status, type, search, user: userFilter }
    )

    const users = await getAllUsers()

    // Get stats for current view (could also get global stats)
    const successCount = transactions.filter(t => t.status === 'success').length
    const pendingCount = transactions.filter(t => t.status === 'pending').length
    const failedCount = transactions.filter(t => t.status === 'failed').length

    return (
      <div className="p-4 md:p-10 space-y-10 relative pb-20">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
              <Activity className="w-3 h-3" /> Transaction History
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
              Global <span className="text-slate-500 italic font-medium">Transfers</span>
            </h1>
            <p className="text-slate-400 font-medium max-w-xl text-lg leading-relaxed">
              Monitoring global movement of assets across the PRIMEHARBOR BANK ecosystem. Transaction status and records.
            </p>
          </div>

          <div className="flex gap-4">
            <Button asChild variant="ghost" className="h-14 px-8 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black border border-white/5 backdrop-blur-md uppercase tracking-widest text-[10px] gap-2">
              <Link href="/admin">
                <ChevronLeft className="h-4 w-4" /> Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {[
            { label: "Total Transactions", value: total, icon: Database, color: "text-blue-400", bg: "bg-blue-500/5", border: "border-blue-500/10" },
            { label: "Completed", value: successCount, icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/5", border: "border-emerald-500/10" },
            { label: "Pending Review", value: pendingCount, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/5", border: "border-yellow-500/10" },
            { label: "Failed", value: failedCount, icon: Lock, color: "text-red-400", bg: "bg-red-500/5", border: "border-red-500/10" },
          ].map((stat, i) => (
            <Card key={i} className={`bg-white/[0.02] ${stat.border} rounded-[2rem] p-8 group hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <stat.icon className={`w-16 h-16 ${stat.color}`} />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">{stat.label}</p>
                <div className={`text-5xl font-black ${stat.color} tracking-tighter mb-2`}>{stat.value}</div>
                <div className="w-12 h-1 bg-white/5 rounded-full">
                  <div className={`h-full rounded-full ${stat.bg.replace('/5', '')} w-1/2`}></div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Live Feed Container */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-black text-white italic tracking-tight">Real-Time Data Streams</h2>
            <div className="h-px bg-white/5 flex-1" />
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Updates</span>
            </div>
          </div>

          <TransactionsList
            initialTransactions={transactions}
            users={users}
            total={total}
            currentPage={page}
            totalPages={totalPages}
            currentFilters={{ status, type, search, user: userFilter }}
            isAdmin={true}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in AdminTransactionsPage:", error)
    return (
      <div className="min-h-screen bg-[#001c10] flex items-center justify-center p-6 text-center">
        <div className="space-y-6">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-red-500 uppercase tracking-widest italic mb-2">System Fault Detected</h1>
            <p className="text-slate-500 font-medium">An unexpected exception occurred during data synchronization.</p>
          </div>
          <Button onClick={() => window.location.reload()} className="h-14 px-10 rounded-2xl bg-white/5 text-white font-black uppercase tracking-widest text-[10px] border border-white/10 hover:bg-white/10 transition-all">
            Retry
          </Button>
        </div>
      </div>
    )
  }
}
