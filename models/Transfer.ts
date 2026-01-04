import mongoose, { type Document, Schema } from "mongoose"

export interface ITransfer extends Document {
  userId: string
  amount: number
  currency: string
  txRef: string
  txDate: Date
  txReason?: string
  txRegion: "local" | "international"
  transferType: "local" | "international"
  txCharge: number
  txStatus: "pending" | "success" | "failed" | "cancelled"
  bankCountry?: string
  bankName: string
  bankAccount: string
  accountNumber: string
  bankHolder: string
  accountHolder: string
  identifier?: string
  identifierCode?: string
  routingCode?: string
  country?: string
  description?: string
  senderName?: string
  senderAccount?: string
  transferCodes?: {
    cot?: string
    imf?: string
    tac?: string
    tax?: string
    esi?: string //
    dco?: string //
  }
  verificationSteps?: {
    cotVerified?: boolean
    cotCode?: string
    cotVerifiedAt?: Date
    imfVerified?: boolean
    imfCode?: string
    imfVerifiedAt?: Date
    esiVerified?: boolean
    esiCode?: string
    esiVerifiedAt?: Date
    dcoVerified?: boolean
    dcoCode?: string
    dcoVerifiedAt?: Date
    taxVerified?: boolean
    taxCode?: string
    taxVerifiedAt?: Date
    tacVerified?: boolean
    tacCode?: string
    tacVerifiedAt?: Date
  }
  otpCode?: string
  otpExpiry?: Date
  completedAt?: Date
  txType?: "debit" | "credit"
  createdAt: Date
  updatedAt: Date
}

const TransferSchema = new Schema<ITransfer>(
  {
    userId: { type: String, required: true, index: true, ref: "User" },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "USD" },
    txRef: { type: String, required: true, unique: true },
    txDate: { type: Date, default: Date.now },
    txReason: String,
    txType: { type: String, enum: ["debit", "credit"] },
    txRegion: { type: String, enum: ["local", "international"], required: true },
    transferType: { type: String, enum: ["local", "international"], required: true },
    txCharge: { type: Number, default: 0 },
    txStatus: {
      type: String,
      enum: ["pending", "success", "failed", "cancelled"],
      default: "pending",
    },
    bankCountry: String,
    bankName: { type: String, required: true },
    bankAccount: { type: String, required: true },
    accountNumber: { type: String, required: true },
    bankHolder: { type: String, required: true },
    accountHolder: { type: String, required: true },
    identifier: String,
    identifierCode: String,
    routingCode: String,
    country: String,
    description: String,
    senderName: String,
    senderAccount: String,
    transferCodes: {
      cot: String,
      imf: String,
      tac: String,
      tax: String,
      esi: String, //
      dco: String, //
    },
    verificationSteps: {
      cotVerified: { type: Boolean, default: false },
      cotCode: String,
      cotVerifiedAt: Date,
      imfVerified: { type: Boolean, default: false },
      imfCode: String,
      imfVerifiedAt: Date,
      esiVerified: { type: Boolean, default: false },
      esiCode: String,
      esiVerifiedAt: Date,
      dcoVerified: { type: Boolean, default: false },
      dcoCode: String,
      dcoVerifiedAt: Date,
      taxVerified: { type: Boolean, default: false },
      taxCode: String,
      taxVerifiedAt: Date,
      tacVerified: { type: Boolean, default: false },
      tacCode: String,
      tacVerifiedAt: Date,
    },
    otpCode: String,
    otpExpiry: Date,
    completedAt: Date,
  },
  { timestamps: true },
)

// Pre-save middleware to sync alias fields
// Pre-save middleware to sync alias fields
TransferSchema.pre("save", async function () {
  // Sync transferType with txRegion
  if (this.isModified("txRegion") && this.txRegion) {
    this.transferType = this.txRegion
  } else if (this.isModified("transferType") && this.transferType) {
    this.txRegion = this.transferType
  }

  // Sync accountNumber with bankAccount
  if (this.isModified("bankAccount") && this.bankAccount) {
    this.accountNumber = this.bankAccount
  } else if (this.isModified("accountNumber") && this.accountNumber) {
    this.bankAccount = this.accountNumber
  }

  // Sync accountHolder with bankHolder
  if (this.isModified("bankHolder") && this.bankHolder) {
    this.accountHolder = this.bankHolder
  } else if (this.isModified("accountHolder") && this.accountHolder) {
    this.bankHolder = this.accountHolder
  }
})

// Indexes
TransferSchema.index({ userId: 1, txRef: 1 })
TransferSchema.index({ userId: 1, txStatus: 1 })
TransferSchema.index({ txDate: -1 })

let Transfer: mongoose.Model<ITransfer>
try {
  Transfer = mongoose.model<ITransfer>("Transfer")
} catch {
  Transfer = mongoose.model<ITransfer>("Transfer", TransferSchema)
}

export default Transfer
