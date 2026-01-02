// models/Card.ts
import mongoose, { type Document, Schema } from "mongoose"

export interface ICard extends Document {
  userId: mongoose.Types.ObjectId
  cardType: "debit" | "credit"
  vendor: "mastercard" | "visacard" | "amex"
  cvv: string
  cardNumber: string
  expiry: string
  status: "pending" | "active" | "blocked" | "expired" | "rejected"
  date: Date
  appliedDate: Date
  approvedDate?: Date
  cardHolderName: string
  cardDesign: string
  monthlyLimit?: number
  dailyLimit?: number
}

const CardSchema = new Schema<ICard>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  cardType: { type: String, enum: ["debit", "credit"], default: "debit" },
  vendor: { type: String, enum: ["mastercard", "visacard", "amex"], default: "mastercard" },
  cvv: { type: String, required: true },
  cardNumber: { type: String, required: true, unique: true },
  expiry: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "active", "blocked", "expired", "rejected"],
    default: "pending",
  },
  date: { type: Date, default: Date.now },
  appliedDate: { type: Date, default: Date.now },
  approvedDate: { type: Date },
  cardHolderName: { type: String, required: true },
  cardDesign: { type: String, default: "default" },
  monthlyLimit: { type: Number, default: 5000 },
  dailyLimit: { type: Number, default: 1000 },
})

let Card: mongoose.Model<ICard>

try {
  Card = mongoose.model<ICard>("Card")
} catch {
  Card = mongoose.model<ICard>("Card", CardSchema)
}

export default Card
