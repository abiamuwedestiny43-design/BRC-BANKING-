import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import { hashPassword, generateToken, type AuthUser } from "@/lib/auth"
import { generateAccountNumber, generateUserCode } from "@/lib/utils/banking"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstname, lastname, phone, birthdate, gender, pin } = await request.json()

    if (!email || !password || !firstname || !lastname || !pin) {
      return NextResponse.json({ message: "Required fields are missing" }, { status: 400 })
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return NextResponse.json({ message: "PIN must be 4 digits" }, { status: 400 })
    }

    await dbConnect()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists with this email" }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)
    const hashedPin = await hashPassword(pin)
    const bankNumber = generateAccountNumber()
    const usercode = generateUserCode()

    const user = new User({
      email,
      password: hashedPassword,
      usercode,
      bankNumber,
      roles: ["member"],
      bankInfo: {
        security: { pin: hashedPin },
        bio: {
          firstname,
          lastname,
          phone: phone || "",
          birthdate: birthdate ? new Date(birthdate) : undefined,
          gender: gender || "others",
          religion: "others",
        },
        address: {
          location: "",
          state: "",
          city: "",
          country: "",
          zipcode: "",
        },
        nok: {
          firstname: "",
          lastname: "",
          relationship: "",
          address: "",
        },
        system: {
          currency: "USD",
          account: "savings account",
        },
      },
      bankBalance: new Map([["USD", 0]]),
      bankOtp: {
        email: false,
        transferCode: false,
      },
      bankAccount: {
        verified: false,
        canTransfer: false,
      },
    })

    await user.save()

    try {
      await sendWelcomeEmail(email, `${firstname} ${lastname}`, bankNumber)
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError)
      // Don't fail registration if email fails
    }

    const authUser: AuthUser = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      roles: user.roles,
      bankNumber: user.bankNumber,
    }

    const token = generateToken(authUser)

    const response = NextResponse.json({
      message: "Registration successful",
      user: authUser,
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
