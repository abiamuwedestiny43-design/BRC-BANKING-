import mongoose, { type Document, Schema } from "mongoose"

export interface ISystemOption extends Document {
  ref?: mongoose.Types.ObjectId
  key: string
  value: any
  epoch: number
}

const SystemOptionSchema = new Schema<ISystemOption>({
  ref: { type: Schema.Types.ObjectId },
  key: { type: String, required: true },
  value: Schema.Types.Mixed,
  epoch: { type: Number, default: () => Math.floor(Date.now() / 1000) },
})

let SystemOption: mongoose.Model<ISystemOption>

try {
  SystemOption = mongoose.model<ISystemOption>("SystemOption")
} catch {
  SystemOption = mongoose.model<ISystemOption>("SystemOption", SystemOptionSchema)
}

export default SystemOption
