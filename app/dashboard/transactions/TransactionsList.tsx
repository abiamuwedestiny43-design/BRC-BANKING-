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
        return { color: "text-green-600 bg-green-50", icon: CheckCircle2 }
      case "pending":
        return { color: "text-yellow-600 bg-yellow-50", icon: Clock }
      case "cancelled":
        return { color: "text-gray-500 bg-gray-50", icon: XCircle }
      default:
        return { color: "text-red-600 bg-red-50", icon: AlertCircle }
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">

      {/* Header Section */}
      <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-green-600 font-black uppercase tracking-widest text-xs mb-2">
            <ArrowRightLeft className="h-4 w-4" />
            Statement
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Transaction History</h1>
          <p className="text-slate-500 text-lg font-medium">Keep track of your spending and income activities.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isLoading || total === 0}
            className="h-12 px-6 rounded-xl border-none shadow-lg shadow-slate-200 bg-white hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4 text-green-600" />
            {isLoading ? "Exporting..." : "Download CSV"}
          </Button>
          <Button asChild className="h-12 px-6 bg-slate-900 hover:bg-black text-white rounded-xl shadow-xl shadow-slate-200 font-bold">
            <Link href="/dashboard" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Filter Card */}
      <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
        <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-md overflow-hidden rounded-[2rem]">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">

              <div className="lg:col-span-3 space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Account Status</Label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger className="h-12 bg-slate-50/50 border-slate-100 rounded-xl font-bold focus:ring-green-400">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">Everywhere</SelectItem>
                    <SelectItem value="pending">En Route</SelectItem>
                    <SelectItem value="success">Confirmed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:col-span-3 space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Flow Type</Label>
                <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                  <SelectTrigger className="h-12 bg-slate-50/50 border-slate-100 rounded-xl font-bold focus:ring-green-400">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Flow</SelectItem>
                    <SelectItem value="debit">Outbound</SelectItem>
                    <SelectItem value="credit">Inbound</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:col-span-6 space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Deep Search</Label>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                    <Input
                      placeholder="Search references, payees..."
                      value={filters.search}
                      onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                      className="pl-10 h-12 bg-slate-50/50 border-slate-100 focus:bg-white focus:ring-green-400 transition-all rounded-xl font-bold"
                    />
                  </div>
                  <Button type="submit" className="h-12 w-12 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200">
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
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            All Logs
            <span className="text-xs font-bold bg-slate-100 text-slate-400 px-3 py-1 rounded-full">{total} Found</span>
          </h2>
          {(filters.status !== "all" || filters.type !== "all" || filters.search) && (
            <button
              onClick={() => {
                setFilters({ status: "all", type: "all", search: "" })
                updateURL({ status: "all", type: "all", search: "" }, 1)
              }}
              className="text-xs font-bold text-red-500 hover:underline"
            >
              Clear All Filters
            </button>
          )}
        </div>

        <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/90 backdrop-blur-md overflow-hidden rounded-[2.5rem]">
          <CardContent className="p-0">
            {transactions.length === 0 ? (
              <div className="py-24 text-center space-y-4">
                <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-300">
                  <Search className="h-10 w-10" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-black text-slate-900">Zero Results</p>
                  <p className="text-slate-400 font-medium">Try broadening your search or filters.</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {transactions.map((transaction, idx) => {
                  const status = getStatusConfig(transaction.status)
                  return (
                    <Link
                      key={transaction._id}
                      href={`/dashboard/receipt/${transaction.txRef}`}
                      className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/80 transition-all group border-l-4 border-transparent hover:border-green-500"
                    >
                      <div className="flex items-center gap-6 flex-1">
                        <div className={cn(
                          "h-16 w-16 rounded-[1.5rem] flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 duration-300",
                          transaction.txType === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        )}>
                          {transaction.txType === "credit" ? <ArrowDownLeft className="h-7 w-7" /> : <ArrowUpRight className="h-7 w-7" />}
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-black text-slate-900 group-hover:text-green-700 transition-colors truncate">
                              {transaction.txType === "credit" ? "Incoming Funds" : "Payment to"}
                              <span className="font-medium text-slate-400 ml-2">
                                {transaction.recipient ? `• ${transaction.recipient}` : ""}
                              </span>
                            </p>
                            <span className={cn("text-[8px] font-black uppercase px-2 py-0.5 rounded ml-auto md:ml-0", status.color)}>
                              {transaction.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-slate-500 font-bold text-xs uppercase tracking-tighter">
                            <span className="flex items-center gap-1 bg-slate-50 px-2.4 py-1 rounded-lg">
                              <Hash className="h-3 w-3" />
                              {transaction.txRef}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(transaction.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(transaction.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex md:flex-col items-end justify-between md:justify-center gap-2 ml-0 md:ml-8 pl-0 md:pl-8 border-l-0 md:border-l border-slate-100">
                        <p className={cn(
                          "text-2xl font-black",
                          transaction.txType === "credit" ? "text-green-600" : "text-slate-900"
                        )}>
                          {transaction.txType === "credit" ? "+" : "−"}
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </p>
                        <div className="flex items-center gap-1 group-hover:text-green-600 transition-colors cursor-pointer">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-green-600">View Receipt</span>
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
          <motion.div {...fadeInUp} className="flex flex-col md:flex-row items-center justify-between p-6 bg-white/50 backdrop-blur rounded-[2rem] gap-4">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">
              Showing <span className="text-slate-900">{(currentPage - 1) * 10 + 1}</span> - <span className="text-slate-900">{Math.min(currentPage * 10, total)}</span> of <span className="text-slate-900">{total}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-10 w-10 rounded-xl border-none shadow-md bg-white text-slate-700 disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-inner border border-slate-100">
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
                        "h-8 min-w-[32px] px-2 rounded-lg text-xs font-black transition-all",
                        currentPage === pageNum ? "bg-slate-900 text-white shadow-md scale-105" : "text-slate-400 hover:text-slate-700"
                      )}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-10 w-10 rounded-xl border-none shadow-md bg-white text-slate-700 disabled:opacity-30"
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
