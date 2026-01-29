import mongoose, { type Document, Schema } from "mongoose"

export interface IUser extends Document {
  email: string
  username?: string
  password: string
  registerTime: Date
  usercode: string
  lastSeen: Date
  parent?: mongoose.Types.ObjectId
  roles: string[]
  bankInfo: {
    security: {
      pin: string
    }
    bio: {
      address: any
      city: any
      state: any
      country: any
      zipcode: any
      firstname: string
      lastname: string
      phone: string
      birthdate: Date
      gender: "male" | "female" | "others" | ""
      religion: string
    }
    address: {
      location: string
      state: string
      city: string
      country: string
      zipcode: string
    }
    nok: {
      firstname: string
      lastname: string
      relationship: string
      address: string
    }
    system: {
      currency: string
      account: string
    }
  }
  bankBalance: Map<string, number>
  bankNumber: string
  bankOtp: {
    email: boolean
    transferCode: boolean
  }
  bankAccount: {
    verified: boolean
    canTransfer: boolean
    canLocalTransfer: boolean
    canInternationalTransfer: boolean
    kyc?: string
  }
  avatar?: string
  profileImage?: string
  vCode?: string
  resetPasswordExpiry?: Date
  transferCodeRequired?: boolean
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  registerTime: { type: Date, default: Date.now },
  usercode: { type: String, required: true, unique: true },
  lastSeen: { type: Date, default: Date.now },
  parent: { type: Schema.Types.ObjectId, ref: "User" },
  roles: [{ type: String, default: ["member"] }],
  bankInfo: {
    security: {
      pin: { type: String, required: true },
    },
    bio: {
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      phone: String,
      birthdate: Date,
      gender: {
        type: String,
        enum: ["male", "female", "others", ""],
        default: "",
      },
      religion: { type: String, default: "" },
    },
    address: {
      location: String,
      state: String,
      city: String,
      country: String,
      zipcode: String,
    },
    nok: {
      firstname: String,
      lastname: String,
      relationship: String,
      address: String,
    },
    system: {
      currency: { type: String, default: "USD" },
      account: String,
    },
  },
  bankBalance: {
    type: Map,
    of: Number,
    default: new Map([["USD", 0]]),
  },
  bankNumber: { type: String, required: true, unique: true },
  bankOtp: {
    email: { type: Boolean, default: false },
    transferCode: { type: Boolean, default: false },
  },
  bankAccount: {
    verified: { type: Boolean, default: true },
    canTransfer: { type: Boolean, default: true },
    canLocalTransfer: { type: Boolean, default: true },
    canInternationalTransfer: { type: Boolean, default: true },
    kyc: String,
  },
  avatar: String,
  profileImage: String,
  vCode: String,
  resetPasswordExpiry: Date,
  transferCodeRequired: { type: Boolean, default: true },
})

let User: mongoose.Model<IUser>

try {
  User = mongoose.model<IUser>("User")
} catch {
  User = mongoose.model<IUser>("User", UserSchema)
}

export default User
