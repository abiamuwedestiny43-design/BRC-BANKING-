"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  ArrowRightLeft,
  Calendar,
  Hash,
  Clock,
  XCircle,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { formatCurrency } from "@/lib/utils/banking"
import { cn } from "@/lib/utils"

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
  }
}

export default function TransactionsList({
  initialTransactions,
  total,
  currentPage,
  totalPages,
  currentFilters,
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

    if (page > 1) params.set("page", page.toString())
    else params.delete("page")

    router.push(`/dashboard/transactions?${params.toString()}`)
  }

  const handleExport = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (filters.status !== "all") params.set("status", filters.status)
      if (filters.type !== "all") params.set("type", filters.type)
      if (filters.search) params.set("search", filters.search)
      const response = await fetch(`/api/transactions/export?${params.toString()}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Export error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return { color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 }
      case "pending":
        return { color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", icon: Clock }
      case "cancelled":
        return { color: "text-slate-500 bg-white/5 border-white/10", icon: XCircle }
      default:
        return { color: "text-red-400 bg-red-500/10 border-red-500/20", icon: AlertCircle }
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 relative">

      {/* Header Section */}
      <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-widest text-[10px] mb-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 w-fit rounded-full">
            <ArrowRightLeft className="h-3 w-3" />
            Transactions
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            Transaction <span className="text-slate-500 italic">History</span>
          </h1>
          <p className="text-slate-400 font-medium">Keep track of your spending and income activities across the network.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handleExport}
            disabled={isLoading || total === 0}
            className="h-12 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-bold text-white flex items-center gap-2 transition-all"
          >
            <Download className="h-4 w-4 text-emerald-500" />
            {isLoading ? "Exporting..." : "Download CSV"}
          </Button>
          <Button asChild className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-[#001c10] rounded-xl shadow-xl shadow-emerald-500/20 font-black">
            <Link href="/dashboard" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Filter Card */}
      <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
        <Card className="border-white/5 bg-white/[0.03] backdrop-blur-md overflow-hidden rounded-[2.5rem]">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">

              <div className="lg:col-span-3 space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Status</Label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl font-bold text-white focus:ring-emerald-500">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#002a18] border-white/10 text-white rounded-xl">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="success">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:col-span-3 space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Type</Label>
                <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                  <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl font-bold text-white focus:ring-emerald-500">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#002a18] border-white/10 text-white rounded-xl">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="debit">Debit</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:col-span-6 space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Search</Label>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                    <Input
                      placeholder="Search transactions..."
                      value={filters.search}
                      onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                      className="pl-10 h-12 bg-white/5 border-white/10 focus:bg-white/10 focus:ring-emerald-500 transition-all rounded-xl font-bold text-white"
                    />
                  </div>
                  <Button type="submit" className="h-12 w-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#001c10] shadow-lg shadow-emerald-500/20">
                    <Filter className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transactions List Area */}
      <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-black text-white flex items-center gap-3">
            Transactions
            <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-widest">{total} Found</span>
          </h2>
          {(filters.status !== "all" || filters.type !== "all" || filters.search) && (
            <button
              onClick={() => {
                setFilters({ status: "all", type: "all", search: "" })
                updateURL({ status: "all", type: "all", search: "" }, 1)
              }}
              className="text-[10px] font-black text-red-400 hover:text-red-300 uppercase tracking-widest border-b border-red-400/30 pb-0.5"
            >
              Reset Filters
            </button>
          )}
        </div>

        <Card className="border-white/5 bg-white/[0.03] overflow-hidden rounded-[3rem]">
          <CardContent className="p-0">
            {transactions.length === 0 ? (
              <div className="py-24 text-center space-y-4">
                <div className="h-24 w-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-slate-700">
                  <Search className="h-12 w-12" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-black text-white">No Matching Data</p>
                  <p className="text-slate-500 font-medium">Clear filters to resume tracking.</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {transactions.map((transaction, idx) => {
                  const status = getStatusConfig(transaction.status)
                  return (
                    <Link
                      key={transaction._id}
                      href={`/dashboard/receipt/${transaction.txRef}`}
                      className="p-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/[0.04] transition-all group border-l-4 border-transparent hover:border-emerald-500"
                    >
                      <div className="flex items-center gap-8 flex-1">
                        <div className={cn(
                          "h-16 w-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all group-hover:scale-110 duration-500",
                          transaction.txType === "credit" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                        )}>
                          {transaction.txType === "credit" ? <ArrowDownLeft className="h-8 w-8" /> : <ArrowUpRight className="h-8 w-8" />}
                        </div>
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <p className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors truncate">
                              {transaction.txType === "credit" ? "Credit" : "Debit"}
                              <span className="font-medium text-slate-500 ml-3 italic">
                                {transaction.recipient ? `• ${transaction.recipient}` : ""}
                              </span>
                            </p>
                            <span className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border", status.color)}>
                              {transaction.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-slate-500 font-black text-[10px] uppercase tracking-widest">
                            <span className="flex items-center gap-1.5 bg-[#001c10] px-2.5 py-1 rounded text-emerald-500 border border-emerald-500/20 shadow-sm">
                              <Hash className="h-3 w-3" />
                              {transaction.txRef}
                            </span>
                            <span className="flex items-center gap-1.5 opacity-60">
                              <Calendar className="h-3 w-3" />
                              {new Date(transaction.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1.5 opacity-60">
                              <Clock className="h-3 w-3" />
                              {new Date(transaction.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 md:mt-0 flex md:flex-col items-end justify-between md:justify-center gap-3 ml-0 md:ml-10 pl-0 md:pl-10 border-l-0 md:border-l border-white/5">
                        <p className={cn(
                          "text-3xl font-black tracking-tighter",
                          transaction.txType === "credit" ? "text-emerald-400" : "text-white"
                        )}>
                          {transaction.txType === "credit" ? "+" : "−"}
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </p>
                        <div className="flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-emerald-400 transition-colors">View Details</span>
                          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Improved Pagination */}
        {totalPages > 1 && (
          <motion.div {...fadeInUp} className="flex flex-col md:flex-row items-center justify-between p-8 bg-white/[0.03] backdrop-blur border border-white/5 rounded-[3rem] gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Showing <span className="text-white">{(currentPage - 1) * 10 + 1}</span> - <span className="text-white">{Math.min(currentPage * 10, total)}</span> <span className="mx-2 opacity-30">|</span> Total Transactions: <span className="text-emerald-500">{total}</span>
            </p>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 text-white disabled:opacity-20 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-1.5 bg-black/20 p-1.5 rounded-2xl border border-white/5">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) pageNum = i + 1
                  else if (currentPage <= 3) pageNum = i + 1
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
                  else pageNum = currentPage - 2 + i

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={cn(
                        "h-10 min-w-[40px] px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        currentPage === pageNum ? "bg-emerald-500 text-[#001c10] shadow-xl shadow-emerald-500/20 scale-105" : "text-slate-500 hover:text-white"
                      )}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 text-white disabled:opacity-20 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <label className={cn("block text-sm font-medium", className)}>{children}</label>
}
