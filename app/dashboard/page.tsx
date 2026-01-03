import { getCurrentUser } from "@/lib/auth"
import { formatCurrency } from "@/lib/utils/banking"
import dbConnect from "@/lib/database"
import Transfer from "@/models/Transfer"
import { toPlainObject } from "@/lib/serialization"
import CardModel from "@/models/Card"
import DashboardClient from "./DashboardClient"
import LoansPage from "./loans/page"

async function getUserCards(userId: string) {
  await dbConnect()
  const cards = await CardModel.find({ userId }).sort({ date: -1 }).lean()
  return cards.map((card: any) => ({
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
    const transfers = await Transfer.aggregate([
      { $match: { userId } },
      { $sort: { txDate: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "transfermetas",
          localField: "txRef",
          foreignField: "txRef",
          as: "meta"
        }
      },
      { $unwind: { path: "$meta", preserveNullAndEmptyArrays: true } }
    ])

    return transfers.map((transfer) => {
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
      }
    })
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
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8fafc]">
          <div className="text-center p-12 bg-white rounded-[2rem] shadow-2xl">
            <h1 className="text-3xl font-black text-slate-800">Authentication Required</h1>
            <p className="text-slate-500 mt-4 font-medium">Please log in to access your dashboard.</p>
          </div>
        </div>
      )
    }

    const user = toPlainObject(userDoc)
    if (!user?._id) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8fafc]">
          <div className="text-center p-12 bg-white rounded-[2rem] shadow-2xl">
            <h1 className="text-3xl font-black text-red-600">Data Error</h1>
            <p className="text-slate-500 mt-4 font-medium">Invalid user data. Please contact support.</p>
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
      <DashboardClient
        user={user}
        balance={balance}
        currency={currency}
        firstName={firstName}
        bankNumber={bankNumber}
        recentTransfers={recentTransfers}
        activeCards={activeCards}
        loansSection={<LoansPage />}
      />
    )
  } catch (error) {
    console.error("Error in DashboardPage:", error)
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8fafc]">
        <div className="text-center p-12 bg-white rounded-[2rem] shadow-2xl max-w-md">
          <h1 className="text-3xl font-black text-red-600 mb-4">Something went wrong</h1>
          <p className="text-slate-500 font-medium">Please try again later or contact support if the problem persists.</p>
        </div>
      </div>
    )
  }
}
