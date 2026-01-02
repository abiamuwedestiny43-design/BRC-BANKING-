import mongoose, { type Document, Schema } from "mongoose"

export interface IBeneficiary extends Document {
  userId: mongoose.Types.ObjectId
  bankAccount: string
  bankRegion: "local" | "international"
  bankInfo: {
    bankName: string
    bankHolder: string
    bankCountry?: string
    identifier?: string
    identifierCode?: string
  }
}

const BeneficiarySchema = new Schema<IBeneficiary>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bankAccount: { type: String, required: true },
  bankRegion: { type: String, enum: ["local", "international"], required: true },
  bankInfo: {
    bankName: { type: String, required: true },
    bankHolder: { type: String, required: true },
    bankCountry: String,
    identifier: String,
    identifierCode: String,
  },
})

let Beneficiary: mongoose.Model<IBeneficiary>

try {
  Beneficiary = mongoose.model<IBeneficiary>("Beneficiary")
} catch {
  Beneficiary = mongoose.model<IBeneficiary>("Beneficiary", BeneficiarySchema)
}

export default Beneficiary
