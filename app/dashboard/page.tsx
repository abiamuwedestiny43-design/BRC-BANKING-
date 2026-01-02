import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, Eye, ChevronRight, Plus } from "lucide-react"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { formatCurrency } from "@/lib/utils/banking"
import dbConnect from "@/lib/database"
import Transfer from "@/models/Transfer"
import { toPlainObject } from "@/lib/serialization"
import CardComponent from "@/components/cards/CardComponent"
import CardModel from "@/models/Card"
import LoansPage from "./loans/page"

// Add this helper function
async function getUserCards(userId: string) {
  await dbConnect()
  const cards = await CardModel.find({ userId }).sort({ date: -1 }).lean()
  return cards.map((card) => ({
    _id: card._id.toString(),
    cardNumber: card.cardNumber,
    cardHolderName: card.cardHolderName,
    expiry: card.expiry,
    cvv: card.cvv,
    vendor: card.vendor,
    cardType: card.cardType,
    status: card.status,
    dailyLimit: card.dailyLimit,
    monthlyLimit: card.monthlyLimit,
  }))
}

async function getRecentTransfers(userId: string) {
  await dbConnect()

  try {
    const transfers = await Transfer.find({ userId }).sort({ createdAt: -1 }).limit(5).lean()

    return transfers.map((transfer) => ({
      _id: transfer._id.toString(),
      txRef: transfer.txRef,
      txType: "debit", // Note: You may want to infer this from transfer.direction
      amount: transfer.amount,
      currency: transfer.currency,
      createdAt: transfer.createdAt,
      status: transfer.txStatus,
    }))
  } catch (error) {
    console.error("Error fetching transfers:", error)
    return []
  }
}

export default async function DashboardPage() {
  try {
    const userDoc = await getCurrentUser()
    if (!userDoc) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800">Authentication Required</h1>
            <p className="text-slate-600 mt-2">Please log in to access your dashboard.</p>
          </div>
        </div>
      )
    }

    const user = toPlainObject(userDoc)
    if (!user?._id) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Data Error</h1>
            <p className="text-slate-600 mt-2">Invalid user data. Please contact support.</p>
          </div>
        </div>
      )
    }

    const recentTransfers = await getRecentTransfers(user._id.toString())
    const userCards = await getUserCards(user._id.toString())

    // Balance handling
    let balance = 0
    const currency = user.bankInfo?.system?.currency || "USD"
    if (typeof user.bankBalance === "object" && user.bankBalance !== null) {
      balance = user.bankBalance[currency] || 0
    }

    const firstName = user.bankInfo?.bio?.firstname || "User"
    const bankNumber = user.bankNumber || "N/A"

    // Filter active/pending cards
    const activeCards = userCards.filter((card: any) => card.status === "active" || card.status === "pending")

    return (
      <div className="min-h-screen bg-gradient-to-br pt-[80px] from-green-50 to-white flex items-start justify-center p-4">
        <div className="w-full max-w-5xl space-y-8">
          {/* Welcome Header */}
          <div className="animate-fade-in-up flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-slate-800">Welcome back, {firstName}!</h1>
            <p className="text-slate-600">Here's your account overview</p>
          </div>

          {/* Account Balance Card */}
          <Card className="animate-fade-in-up animation-delay-100 border-green-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-slate-800">Account Balance</CardTitle>
                <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-green-100">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="text-slate-600">Account: {bankNumber}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-800 mb-6">{formatCurrency(balance, currency)}</div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-green-200 transition-all duration-300"
                >
                  <Link href="/dashboard/transfer">
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Send Money
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="flex-1 border-green-300 text-slate-700 hover:bg-green-50 bg-transparent"
                >
                  <Link href="/dashboard/transactions">View Transactions</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* My Cards Section */}
          <Card className="animate-fade-in-up animation-delay-300 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-slate-800">My Cards</CardTitle>
                <CardDescription className="text-slate-600">
                  {activeCards.length > 0 ? "Your active and pending cards" : "You haven't applied for a card yet"}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:bg-green-100">
                <Link href="/dashboard/card" className="flex items-center">
                  {activeCards.length > 0 ? "View All" : "Apply Now"}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {activeCards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeCards.map((card: any, index: number) => (
                    <div key={card._id} className="animate-fade-in-up">
                      <CardComponent card={card} showDetails={true} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Placeholder Card 1 */}
                  <div className="relative w-full max-w-sm mx-auto">
                    <div className="relative rounded-2xl p-6 text-white shadow-2xl min-h-[210px] backdrop-blur-sm border border-white/20 bg-gradient-to-br from-blue-800 to-slate-900">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <div className="text-2xl font-bold">Corporate Bank</div>
                          <div className="text-sm opacity-80">Debit Card</div>
                        </div>
                        <div className="w-12 h-12 bg-amber-900/30 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-amber-200">?</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="text-xl font-mono tracking-wider">•••• •••• •••• ••••</div>
                      </div>

                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs opacity-80">Card Holder</div>
                          <div className="text-sm font-medium">—</div>
                        </div>
                        <div>
                          <div className="text-xs opacity-80">Expires</div>
                          <div className="text-sm font-medium">—/—</div>
                        </div>
                      </div>

                      <div className="absolute top-1 right-4">
                        <span className="px-2 py-1 bg-amber-900 text-amber-100 text-xs rounded-full font-medium">
                          Not Applied
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Placeholder Card 2 */}
                  <div className="relative w-full max-w-sm mx-auto">
                    <div className="relative rounded-2xl p-6 text-white shadow-2xl min-h-[210px] backdrop-blur-sm border border-white/20 bg-gradient-to-br from-slate-800 to-blue-900">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <div className="text-2xl font-bold">Corporate Bank</div>
                          <div className="text-sm opacity-80">Credit Card</div>
                        </div>
                        <div className="w-12 h-12 bg-amber-900/30 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-amber-200">?</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="text-xl font-mono tracking-wider">•••• •••• •••• ••••</div>
                      </div>

                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs opacity-80">Card Holder</div>
                          <div className="text-sm font-medium">—</div>
                        </div>
                        <div>
                          <div className="text-xs opacity-80">Expires</div>
                          <div className="text-sm font-medium">—/—</div>
                        </div>
                      </div>

                      <div className="absolute top-1 right-4">
                        <span className="px-2 py-1 bg-amber-900 text-amber-100 text-xs rounded-full font-medium">
                          Not Applied
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Below Cards */}
                  <div className="md:col-span-2 flex flex-col items-center justify-center pt-4">
                    <p className="text-slate-600 text-center max-w-md mb-4">
                      Apply for a virtual or physical card to make purchases, withdraw cash, and manage your spending
                      securely.
                    </p>
                    <Button
                      asChild
                      className="bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-amber-200 transition-shadow"
                    >
                      <Link href="/dashboard/card/apply" className="flex items-center">
                        <Plus className="mr-2 h-4 w-4" />
                        Apply for Your First Card
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Status & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Status */}
            <Card className="animate-fade-in-up animation-delay-200 border-green-200">
              <CardHeader>
                <CardTitle className="text-slate-800">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Verification Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${user.bankAccount?.verified ? "bg-green-100 text-slate-800" : "bg-red-100 text-red-800"
                      }`}
                  >
                    {user.bankAccount?.verified ? "Verified" : "Unverified"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Transfer Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${user.bankAccount?.canTransfer ? "bg-green-100 text-slate-800" : "bg-red-100 text-red-800"
                      }`}
                  >
                    {user.bankAccount?.canTransfer ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="animate-fade-in-up animation-delay-200 border-green-200">
              <CardHeader>
                <CardTitle className="text-slate-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { href: "/dashboard/transfer", label: "Transfer Money" },
                  { href: "/dashboard/transactions", label: "View Transactions" },
                  { href: "/dashboard/notifications", label: "View Notifications" },
                  { href: "/dashboard/beneficiaries", label: "Manage Beneficiaries" }, // added
                ].map((action, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="w-full justify-start text-slate-700 border-green-200 hover:bg-green-50 hover:border-green-300 transition-colors bg-transparent"
                    asChild
                  >
                    <Link href={action.href}>{action.label}</Link>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          <LoansPage />

          {/* Recent Transactions */}
          <Card className="animate-fade-in-up animation-delay-300 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-slate-800">Recent Transactions</CardTitle>
                <CardDescription className="text-slate-600">Your latest account activity</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:bg-green-100">
                <Link href="/dashboard/transactions" className="flex items-center">
                  View More <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentTransfers.length > 0 ? (
                <div className="space-y-3">
                  {recentTransfers.map((transfer: any, index: number) => (
                    <Link key={transfer._id} href={`/dashboard/receipt/${transfer.txRef}`} className="block group">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-green-100 hover:bg-green-50 transition-colors duration-200">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-2.5 rounded-full ${transfer.txType === "credit" ? "bg-green-100 text-slate-600" : "bg-red-100 text-red-600"
                              }`}
                          >
                            {transfer.txType === "credit" ? (
                              <ArrowDownLeft className="h-5 w-5" />
                            ) : (
                              <ArrowUpRight className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 group-hover:text-slate-700">
                              {transfer.txType === "credit" ? "Money Received" : "Money Sent"}
                            </p>
                            <p className="text-sm text-slate-600">
                              {new Date(transfer.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold ${transfer.txType === "credit" ? "text-slate-600" : "text-red-600"
                              }`}
                          >
                            {transfer.txType === "credit" ? "+" : "−"}
                            {formatCurrency(transfer.amount, transfer.currency || currency)}
                          </p>
                          <p className="text-sm text-slate-600 capitalize">{transfer.status}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-slate-600">No recent transactions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in DashboardPage:", error)
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-green-50 to-white">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h1>
          <p className="text-slate-600">Please try again later or contact support if the problem persists.</p>
        </div>
      </div>
    )
  }
}
