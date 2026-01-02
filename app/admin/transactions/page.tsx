// app/admin/transactions/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, Search, Filter, ChevronLeft, ChevronRight, Download } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils/banking"
import TransactionsList from "./TransactionsList"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Transfer from "@/models/Transfer"
import User from "@/models/User" // Import User model
import { toPlainObject } from "@/lib/serialization"

// Updated function to fetch all transactions (admin view)
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
      .populate('userId', 'name email') // Populate user data
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Transfer.countDocuments(query)
    
    const transactions = transfers.map(transfer => ({
      _id: transfer._id.toString(),
      txRef: transfer.txRef,
      txType: transfer.txType as "debit" | "credit",
      amount: transfer.amount,
      currency: transfer.currency,
      createdAt: transfer.completedAt || transfer.createdAt,
      status: transfer.txStatus,
      recipient: transfer.accountHolder,
      description: transfer.description,
      userId: (transfer.userId as any)?._id?.toString(),
      userName: (transfer.userId as any)?.name || 'Unknown User',
      userEmail: (transfer.userId as any)?.email || 'No Email'
    }))
    
    return { transactions, total, page, totalPages: Math.ceil(total / limit) }
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return { transactions: [], total: 0, page: 1, totalPages: 0 }
  }
}

// Function to get all users for the filter dropdown
async function getAllUsers() {
  await dbConnect()
  try {
    const users = await User.find({})
      .select('_id name email')
      .sort({ name: 1 })
      .lean()
    
    return users.map(user => ({
      id: user._id.toString(),
      name: user.name || 'Unknown User',
      email: user.email
    }))
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
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-green-50 to-white">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-2xl font-bold text-slate-800">Authentication Required</h1>
            <p className="text-slate-600 mt-2">Please log in to view transactions</p>
          </div>
        </div>
      )
    }

    const user = toPlainObject(userDoc)
    
    // Check if user is admin (you might want to add an admin field to your User model)
    // For now, we'll assume this page is only accessible to admins
    const isAdmin = true // You should implement proper admin check
    
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-start justify-center md:p-4 pt-[80px]">
        <div className="w-full max-w-7xl space-y-8"> {/* Increased max-width */}
          {/* Header */}
          <div className="animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Admin - All Transactions</h1>
                <p className="text-slate-600">View all user transactions across the platform</p>
              </div>
              <Button 
                asChild 
                className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-green-200 transition-all duration-300"
              >
                <Link href="/admin">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Admin Dashboard
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in-up animation-delay-100">
            <Card className="border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{total}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card className="border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Successful</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {transactions.filter(t => t.status === 'success').length}
                </div>
                <p className="text-xs text-muted-foreground">Completed transactions</p>
              </CardContent>
            </Card>
            <Card className="border-yellow-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {transactions.filter(t => t.status === 'pending').length}
                </div>
                <p className="text-xs text-muted-foreground">Awaiting completion</p>
              </CardContent>
            </Card>
            <Card className="border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {transactions.filter(t => t.status === 'failed').length}
                </div>
                <p className="text-xs text-muted-foreground">Unsuccessful transactions</p>
              </CardContent>
            </Card>
          </div>

          {/* Transactions List */}
          <Card className="animate-fade-in-up animation-delay-200 border-green-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-slate-800">All Transactions</CardTitle>
              <CardDescription className="text-slate-600">
                Monitor and filter transactions from all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionsList 
                initialTransactions={transactions}
                total={total}
                currentPage={page}
                totalPages={totalPages}
                currentFilters={{ status, type, search, user: userFilter }}
                isAdmin={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in AdminTransactionsPage:", error)
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
