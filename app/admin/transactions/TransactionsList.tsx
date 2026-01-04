// app/admin/transactions/TransactionsList.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, ArrowDownLeft, Search, Filter, ChevronLeft, ChevronRight, Download } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { formatCurrency } from "@/lib/utils/banking"

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
  userId?: string // Add userId to track which user the transaction belongs to
  userEmail?: string // Add user email for admin view
  userName?: string // Add user name for admin view
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
    user?: string // Add user filter for admin
  }
  users?: UserSummary[] // Add users for filter
  isAdmin?: boolean // Add admin flag
}

export default function TransactionsList({
  initialTransactions,
  total,
  currentPage,
  totalPages,
  currentFilters,
  users = [],
  isAdmin = false // Default to false for regular users
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

    // Add user filter for admin
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

  const handleExport = async () => {
    try {
      setIsLoading(true)

      // Create a query string from current filters
      const params = new URLSearchParams()
      if (filters.status !== "all") params.set("status", filters.status)
      if (filters.type !== "all") params.set("type", filters.type)
      if (filters.search) params.set("search", filters.search)
      if (isAdmin && filters.user && filters.user !== "all") params.set("user", filters.user)

      // Call the export API
      const response = await fetch(`/api/transactions/export?${params.toString()}`)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`

        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error('Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <div className={`grid grid-cols-1 gap-4 mb-6 ${isAdmin ? 'md:grid-cols-5' : 'md:grid-cols-4'}`}>
        {isAdmin && (
          <div>
            <label className="text-sm font-medium mb-2 block">User</label>
            <Select value={filters.user || "all"} onValueChange={(value) => handleFilterChange("user", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent className="bg-[#001c10] border-white/10 text-white">
                <SelectItem value="all">All Users</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <label className="text-sm font-medium mb-2 block">Status</label>
          <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Type</label>
          <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="debit">Debit</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className={isAdmin ? "md:col-span-2" : "md:col-span-2"}>
          <label className="text-sm font-medium mb-2 block">Search</label>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder={
                isAdmin
                  ? "Search by reference, recipient, description, or user"
                  : "Search by reference, recipient, or description"
              }
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
            <Button type="submit">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{isAdmin ? "All Transactions" : "Transactions"}</CardTitle>
            <CardDescription>
              {total} transactions found
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isLoading || total === 0}
            className="hidden"
          >
            <Download className="h-4 w-4 mr-2 hidden" />
            {isLoading ? "Exporting..." : "Export PDF"}
          </Button>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions found</p>
              {filters.status !== "all" || filters.type !== "all" || filters.search || (isAdmin && filters.user && filters.user !== "all") ? (
                <Button
                  variant="link"
                  onClick={() => {
                    const clearFilters = { status: "all", type: "all", search: "" }
                    if (isAdmin) {
                      (clearFilters as any).user = "all"
                    }
                    setFilters(clearFilters as any)
                    updateURL(clearFilters, 1)
                  }}
                >
                  Clear filters
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <Link
                  key={transaction._id}
                  href={`/dashboard/receipt/${transaction.txRef}`}
                  className="block transition-colors hover:bg-muted/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded gap-3 sm:gap-0">
                    {/* Left Side */}
                    <div className="flex items-start sm:items-center gap-3 flex-1 w-full">
                      <div
                        className={`p-3 rounded-full flex-shrink-0 ${transaction.txType === "credit" ? "bg-green-100" : "bg-red-100"
                          }`}
                      >
                        {transaction.txType === "credit" ? (
                          <ArrowDownLeft className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-red-600" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <p className="font-medium text-sm sm:text-base truncate">
                            {transaction.txType === "credit" ? "Money Received" : "Money Sent"}
                            {transaction.recipient && (
                              <span className="truncate"> to {transaction.recipient}</span>
                            )}
                          </p>
                          {isAdmin && transaction.userName && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 sm:mt-0 sm:ml-2">
                              {transaction.userName}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
                          <p className="truncate">Ref: {transaction.txRef}</p>
                          {transaction.description && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <p className="truncate">{transaction.description}</p>
                            </>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          {new Date(transaction.createdAt).toLocaleDateString()} •{" "}
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 sm:gap-1 text-sm">
                      <p
                        className={`font-medium ${transaction.txType === "credit" ? "text-green-600" : "text-red-600"
                          }`}
                      >
                        {transaction.txType === "credit" ? "+" : "-"}
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                      <span
                        className={`px-2 py-1 rounded text-xs ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-4 text-center sm:text-left">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * 10 + 1} to{" "}
                {Math.min(currentPage * 10, total)} of {total} transactions
              </div>

              <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden xs:inline">Previous</span>
                </Button>

                <div className="flex flex-wrap justify-center items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                  {totalPages > 5 && <span className="px-2 text-sm">...</span>}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  <span className="hidden xs:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
