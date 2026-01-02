import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Card from "@/models/Card"
import { toPlainObject } from "@/lib/serialization"
import { Button } from "@/components/ui/button"
import { Card as UICard, CardContent } from "@/components/ui/card"
import { Plus, CreditCard } from "lucide-react"
import Link from "next/link"
import CardComponent from "@/components/cards/CardComponent"

async function getUserCards(userId: string) {
  await dbConnect()
  const cards = await Card.find({ userId }).sort({ date: -1 })
  return cards.map(card => toPlainObject(card))
}

export default async function CardsPage() {
  const userDoc = await getCurrentUser()
  if (!userDoc) {
    return <div className="min-h-screen flex items-center justify-center">Unauthorized</div>
  }

  const user = toPlainObject(userDoc)
  const cards = await getUserCards(user._id.toString())

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4 pt-[80px]">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">My Cards</h1>
            <p className="text-slate-600 mt-1">Manage your debit and credit cards</p>
          </div>
          <Button 
            asChild 
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-200 transition-all duration-300"
          >
            <Link href="/dashboard/card/apply" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Apply for New Card
            </Link>
          </Button>
        </div>

        {/* Empty State */}
        {cards.length === 0 ? (
          <UICard className="animate-fade-in-up animation-delay-100">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CreditCard className="h-16 w-16 text-slate-500 mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No cards yet</h3>
              <p className="text-slate-600 text-center mb-6 max-w-md">
                You haven't applied for any cards yet. Apply for your first card to get started.
              </p>
              <Button 
                asChild 
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-200 transition-all duration-300"
              >
                <Link href="/dashboard/card/apply">
                  Apply for Your First Card
                </Link>
              </Button>
            </CardContent>
          </UICard>
        ) : null}

        {/* Active Cards Section */}
        {cards.filter((card: any) => card.status === "active" || card.status === "pending").length > 0 && (
          <div className="mt-12 animate-fade-in-up animation-delay-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cards
                .filter((card: any) => card.status === "active" || card.status === "pending")
                .map((card: any, index: number) => (
                  <div 
                    key={card._id} 
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${150 + index * 50}ms` }}
                  >
                    <CardComponent key={card._id} card={card} showDetails={true} />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
