import mongoose, { type Document, Schema } from "mongoose"

export interface ITransferMeta extends Document {
  txRef: string; // ✅ store as string, not ObjectId
  accountNumber: string;
  txType: "debit" | "credit";
  amount: number;
  status: boolean;
  userId: mongoose.Types.ObjectId;
}

const TransferMetaSchema = new Schema<ITransferMeta>(
  {
    txRef: { type: String, required: true }, // string txRef
    accountNumber: { type: String, required: true },
    txType: { type: String, enum: ["debit", "credit"], required: true },
    amount: { type: Number, required: true },
    status: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
)

let TransferMeta: mongoose.Model<ITransferMeta>
try {
  TransferMeta = mongoose.model<ITransferMeta>("TransferMeta")
} catch {
  TransferMeta = mongoose.model<ITransferMeta>("TransferMeta", TransferMetaSchema)
}

export default TransferMeta
