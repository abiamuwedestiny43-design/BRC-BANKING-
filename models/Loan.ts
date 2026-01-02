// models/Loan.ts
import mongoose, { type Document, Schema } from "mongoose"

export interface ILoan extends Document {
  userId: mongoose.Types.ObjectId
  loanType: "personal" | "business" | "mortgage" | "auto" | "education"
  amount: number
  interestRate: number
  duration: number // in months
  purpose: string
  status: "pending" | "approved" | "rejected" | "active" | "completed" | "defaulted"
  appliedDate: Date
  approvedDate?: Date
  approvedBy?: mongoose.Types.ObjectId
  disbursementDate?: Date
  dueDate?: Date
  monthlyPayment: number
  totalAmount: number
  remainingBalance: number
  currency: string
  documents: string[] // URLs to uploaded documents
  rejectionReason?: string
  creditScore?: number
  employmentStatus: "employed" | "self-employed" | "unemployed" | "student"
  annualIncome: number
  existingLoans: number
}

const LoanSchema = new Schema<ILoan>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  loanType: { 
    type: String, 
    enum: ["personal", "business", "mortgage", "auto", "education"], 
    required: true 
  },
  amount: { type: Number, required: true, min: 100 },
  interestRate: { type: Number, required: true, min: 0 },
  duration: { type: Number, required: true, min: 1, max: 360 }, // 1 month to 30 years
  purpose: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "active", "completed", "defaulted"],
    default: "pending",
  },
  appliedDate: { type: Date, default: Date.now },
  approvedDate: { type: Date },
  approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
  disbursementDate: { type: Date },
  dueDate: { type: Date },
  monthlyPayment: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  remainingBalance: { type: Number, default: 0 },
  currency: { type: String, default: "USD" },
  documents: [{ type: String }],
  rejectionReason: { type: String },
  creditScore: { type: Number, min: 300, max: 850 },
  employmentStatus: { 
    type: String, 
    enum: ["employed", "self-employed", "unemployed", "student"],
    required: true 
  },
  annualIncome: { type: Number, required: true, min: 0 },
  existingLoans: { type: Number, default: 0 }
})

// Calculate total amount and monthly payment before saving
// Calculate total amount and monthly payment before saving
LoanSchema.pre('save', async function() {
  if (this.isModified('amount') || this.isModified('interestRate') || this.isModified('duration')) {
    const monthlyRate = this.interestRate / 100 / 12
    this.monthlyPayment = (this.amount * monthlyRate * Math.pow(1 + monthlyRate, this.duration)) / 
                         (Math.pow(1 + monthlyRate, this.duration) - 1)
    this.totalAmount = this.monthlyPayment * this.duration
    this.remainingBalance = this.status === 'active' ? this.totalAmount : 0
  }
})

let Loan: mongoose.Model<ILoan>

try {
  Loan = mongoose.model<ILoan>("Loan")
} catch {
  Loan = mongoose.model<ILoan>("Loan", LoanSchema)
}

export default Loan
