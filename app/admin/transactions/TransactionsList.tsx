// app/admin/transactions/TransactionsList.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, ArrowDownLeft, Search, Filter, ChevronLeft, ChevronRight, Download, Activity, User as UserIcon, Calendar, Hash } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { formatCurrency } from "@/lib/utils/banking"
import { Badge } from "@/components/ui/badge"

interface Transaction {
  _id: string
  txRef: string
  txType: "debit" | "credit"
  amount: number
  currency: string
  createdAt: Date
  status: string
  recipient?: string
  description?: string
  userId?: string
  userEmail?: string
  userName?: string
}

interface UserSummary {
  id: string
  name: string
  email: string
}

interface TransactionsListProps {
  initialTransactions: Transaction[]
  total: number
  currentPage: number
  totalPages: number
  currentFilters: {
    status: string
    type: string
    search: string
    user?: string
  }
  users?: UserSummary[]
  isAdmin?: boolean
}

export default function TransactionsList({
  initialTransactions,
  total,
  currentPage,
  totalPages,
  currentFilters,
  users = [],
  isAdmin = false
}: TransactionsListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [filters, setFilters] = useState(currentFilters)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setTransactions(initialTransactions)
  }, [initialTransactions])

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    updateURL(newFilters, 1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateURL(filters, 1)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateURL(filters, newPage)
    }
  }

  const updateURL = (newFilters: any, page: number) => {
    const params = new URLSearchParams(searchParams.toString())

    if (newFilters.status !== "all") params.set("status", newFilters.status)
    else params.delete("status")

    if (newFilters.type !== "all") params.set("type", newFilters.type)
    else params.delete("type")

    if (newFilters.search) params.set("search", newFilters.search)
    else params.delete("search")

    if (isAdmin && newFilters.user && newFilters.user !== "all") {
      params.set("user", newFilters.user)
    } else if (isAdmin) {
      params.delete("user")
    }

    if (page > 1) params.set("page", page.toString())
    else params.delete("page")

    const path = isAdmin ? "/admin/transactions" : "/dashboard/transactions"
    router.push(`${path}?${params.toString()}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 shadow-[0_0_10px_rgba(16,185,129,0.1)]">SUCCESS</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 shadow-[0_0_10px_rgba(234,179,8,0.1)]">PENDING</Badge>
      case "failed":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 shadow-[0_0_10px_rgba(239,68,68,0.1)]">FAILED</Badge>
      case "cancelled":
        return <Badge className="bg-slate-500/10 text-slate-500 border-slate-500/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">CANCELLED</Badge>
      default:
        return <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">{status.toUpperCase()}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Filters Hub */}
      <Card className="bg-white/[0.02] border-white/5 rounded-[2.5rem] p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          {isAdmin && (
            <div className="lg:col-span-3 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Client Identity</label>
              <Select value={filters.user || "all"} onValueChange={(value) => handleFilterChange("user", value)}>
                <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:ring-emerald-500/20 capitalize font-medium">
                  <SelectValue placeholder="All Clients" />
                </SelectTrigger>
                <SelectContent className="bg-[#001c10] border-emerald-500/20 text-white backdrop-blur-xl">
                  <SelectItem value="all">All Accounts</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id} className="focus:bg-emerald-500 focus:text-black">
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="lg:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Status</label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:ring-emerald-500/20 capitalize font-medium">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-[#001c10] border-emerald-500/20 text-white backdrop-blur-xl">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="success">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="lg:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Transaction Type</label>
            <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
              <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:ring-emerald-500/20 capitalize font-medium">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-[#001c10] border-emerald-500/20 text-white backdrop-blur-xl">
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`${isAdmin ? "lg:col-span-5" : "lg:col-span-8"} space-y-2`}>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Search Records</label>
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/50" />
                <Input
                  placeholder="Reference, name, or transaction details..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-12 bg-white/5 border-white/10 rounded-xl h-12 text-white focus:border-emerald-500/50 transition-all font-medium"
                />
              </div>
              <Button type="submit" className="h-12 px-6 rounded-xl bg-emerald-500 text-[#001c10] font-black hover:bg-emerald-400 shadow-xl shadow-emerald-500/20">
                Search
              </Button>
            </form>
          </div>
        </div>
      </Card>

      {/* Results Deck */}
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white/[0.01] border border-white/5 rounded-[3rem]">
            <Activity className="w-12 h-12 text-slate-700 mx-auto" />
            <p className="text-slate-500 font-medium italic">No transactions found matching the current filters.</p>
            <Button
              variant="link"
              className="text-emerald-500 font-black uppercase tracking-widest text-[10px]"
              onClick={() => {
                const clearFilters = { status: "all", type: "all", search: "" }
                if (isAdmin) (clearFilters as any).user = "all"
                setFilters(clearFilters as any)
                updateURL(clearFilters, 1)
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {transactions.map((transaction) => (
              <Link
                key={transaction._id}
                href={isAdmin ? `/admin/transactions/${transaction._id}` : `/dashboard/receipt/${transaction.txRef}`}
                className="group block"
              >
                <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] group-hover:border-emerald-500/20 transition-all duration-300 relative overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                      {/* Icon Cluster */}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${transaction.txType === "credit"
                        ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                        : "bg-red-500/5 border-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.05)]"
                        }`}>
                        {transaction.txType === "credit" ? (
                          <ArrowDownLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
                        ) : (
                          <ArrowUpRight className="h-6 w-6 group-hover:scale-110 transition-transform" />
                        )}
                      </div>

                      {/* Info Cluster */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <p className="font-black text-white uppercase tracking-tight text-lg">
                            {transaction.txType === "credit" ? "Credit" : "Debit"}
                          </p>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          <span className="text-slate-500 font-mono tracking-tighter">REF_{transaction.txRef.toUpperCase()}</span>
                          {transaction.recipient && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-700" />
                              <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">TO: {transaction.recipient}</span>
                            </>
                          )}
                          {isAdmin && transaction.userName && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-700" />
                              <span className="text-emerald-500 font-black uppercase tracking-widest text-[9px] flex items-center gap-1">
                                <UserIcon className="w-2 h-2" /> {transaction.userName}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Value Cluster */}
                    <div className="flex items-center md:items-end flex-row md:flex-col justify-between md:justify-center gap-2">
                      <p className={`text-2xl font-black tracking-tighter ${transaction.txType === "credit" ? "text-emerald-500" : "text-white"
                        }`}>
                        {transaction.txType === "credit" ? "+" : "-"}{formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <Calendar className="w-3 h-3 opacity-50" />
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Decorative background number/ID */}
                  <div className="absolute right-[-2%] bottom-[-20%] text-9xl font-black text-white/[0.02] pointer-events-none select-none italic">
                    {transaction.txRef.slice(-4)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Audit Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between mt-12 gap-6 p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              Showing <span className="text-white">{(currentPage - 1) * 10 + 1}</span> — <span className="text-white">{Math.min(currentPage * 10, total)}</span> of <span className="text-white">{total}</span> Transactions
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-10 px-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] disabled:opacity-20"
              >
                <ChevronLeft className="h-4 w-4 mr-2" /> Prev
              </Button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) pageNum = i + 1
                  else if (currentPage <= 3) pageNum = i + 1
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
                  else pageNum = currentPage - 2 + i

                  return (
                    <Button
                      key={pageNum}
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-xl font-black text-[10px] transition-all ${currentPage === pageNum
                        ? "bg-emerald-500 text-[#001c10] shadow-lg shadow-emerald-500/20"
                        : "bg-white/5 border border-white/5 text-slate-500 hover:text-white"
                        }`}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-10 px-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] disabled:opacity-20"
              >
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
