import mongoose, { type Document, Schema } from "mongoose"

export interface INotification extends Document {
  origin?: mongoose.Types.ObjectId
  model?: string
  userId: mongoose.Types.ObjectId
  period: Date
  message: string
  viewed: boolean
  redirect?: string
  image?: string
  hidden: boolean
}

const NotificationSchema = new Schema<INotification>({
  origin: { type: Schema.Types.ObjectId },
  model: String,
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  period: { type: Date, default: Date.now },
  message: { type: String, required: true },
  viewed: { type: Boolean, default: false },
  redirect: String,
  image: String,
  hidden: { type: Boolean, default: false },
})

let Notification: mongoose.Model<INotification>

try {
  Notification = mongoose.model<INotification>("Notification")
} catch {
  Notification = mongoose.model<INotification>("Notification", NotificationSchema)
}

export default Notification
