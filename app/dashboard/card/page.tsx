import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Card from "@/models/Card"
import { toPlainObject } from "@/lib/serialization"
import { redirect } from "next/navigation"
import CardsClient from "./CardsClient"

async function getUserCards(userId: string) {
  await dbConnect()
  const cards = await Card.find({ userId }).sort({ date: -1 })
  return cards.map(card => toPlainObject(card))
}

export default async function CardsPage() {
  const userDoc = await getCurrentUser()
  if (!userDoc) {
    redirect("/login")
  }

  const user = toPlainObject(userDoc)
  const cards = await getUserCards(user._id.toString())

  return <CardsClient cards={cards} />
}
