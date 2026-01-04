// app/admin/transactions/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, Search, Filter, ChevronLeft, ChevronRight, Activity, ShieldCheck, Zap } from "lucide-react"
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

    return (
      <div className="p-4 md:p-10 space-y-10 relative">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
              <Activity className="w-3 h-3" /> Transaction Flux
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              Global <span className="text-slate-500 italic">Transfers</span>
            </h1>
            <p className="text-slate-400 font-medium max-w-md">Monitoring all liquidity movement across the global NOVA BANK framework.</p>
          </div>

          <Button asChild className="bg-white/5 hover:bg-white/10 text-white font-bold h-12 px-8 rounded-xl border border-white/10 backdrop-blur-md">
            <Link href="/admin">
              <ChevronLeft className="mr-2 h-5 w-5" />
              Return to Command
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          {[
            { label: "Detected Nodes", value: total, desc: "Total lifecycle events", color: "text-blue-400", bg: "bg-blue-500/5" },
            { label: "Successful", value: transactions.filter(t => t.status === 'success').length, desc: "Finalized transfers", color: "text-emerald-400", bg: "bg-emerald-500/5" },
            { label: "Pending", value: transactions.filter(t => t.status === 'pending').length, desc: "Awaiting execution", color: "text-yellow-400", bg: "bg-yellow-500/5" },
            { label: "Failed/Aborted", value: transactions.filter(t => t.status === 'failed').length, desc: "System rejections", color: "text-red-400", bg: "bg-red-500/5" },
          ].map((stat, i) => (
            <Card key={i} className={`bg-white/[0.03] border-white/5 rounded-[2rem] p-6 group hover:bg-white/[0.05] transition-all`}>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{stat.label}</p>
              <div className={`text-4xl font-black ${stat.color} tracking-tighter mb-1`}>{stat.value}</div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">{stat.desc}</p>
            </Card>
          ))}
        </div>

        {/* Transactions List */}
        <Card className="bg-white/[0.03] border-white/5 rounded-[3rem] overflow-hidden relative z-10">
          <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-black text-white italic tracking-tight">Real-Time Data Feed</CardTitle>
                <CardDescription className="text-slate-500 font-medium italic">
                  Low-latency monitoring of global asset migrations.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Engine</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 shadow-inner">
            <TransactionsList
              initialTransactions={transactions}
              users={users}
              total={total}
              currentPage={page}
              totalPages={totalPages}
              currentFilters={{ status, type, search, user: userFilter }}
              isAdmin={true}
            />
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error in AdminTransactionsPage:", error)
    return (
      <div className="min-h-screen bg-[#001c10] flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <h1 className="text-2xl font-black text-red-500 uppercase tracking-widest italic">System Fault Detected</h1>
          <p className="text-slate-500">An unexpected exception occurred during data synchronization.</p>
          <Button onClick={() => window.location.reload()} className="bg-white/5 text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-xl border border-white/10">
            Retry Sync
          </Button>
        </div>
      </div>
    )
  }
}
