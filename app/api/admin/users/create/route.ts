import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser, isAdmin, hashPassword } from "@/lib/auth"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import { generateAccountNumber } from "@/lib/utils/banking"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !isAdmin(currentUser)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const contentType = request.headers.get("content-type")
    let body: any = {}
    let profileImage = ""

    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData()
      body = Object.fromEntries(formData)

      const file = formData.get("profileImageFile") as File
      if (file) {
        const buffer = await file.arrayBuffer()
        const base64 = Buffer.from(buffer).toString("base64")
        profileImage = `data:${file.type};base64,${base64}`
      }

      // Convert JSON strings back to objects
      if (body.initialBalance) body.initialBalance = Number(body.initialBalance)
      if (body.roles) body.roles = JSON.parse(body.roles as string)
      if (body.verified) body.verified = body.verified === "true"
      if (body.canTransfer) body.canTransfer = body.canTransfer === "true"
    } else {
      body = await request.json()
    }

    const {
      email,
      password,
      firstname,
      lastname,
      phone,
      address,
      city,
      state,
      country,
      zipcode,
      currency,
      roles,
      verified,
      canTransfer,
      initialBalance,
      usercode,
      securityPin,
    } = body

    if (!email || !password || !firstname || !lastname || !phone || !usercode || !securityPin) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    if (securityPin.length !== 4 || !/^\d{4}$/.test(securityPin)) {
      return NextResponse.json({ message: "Security PIN must be 4 digits" }, { status: 400 })
    }

    await dbConnect()

    const existingUser = await User.findOne({ email })
    if (existingUser) return NextResponse.json({ message: "User with this email already exists" }, { status: 400 })

    const hashedPassword = await hashPassword(password)
    const hashedPin = await hashPassword(securityPin)
    const bankNumber = generateAccountNumber()

    const newUser = new User({
      email,
      password: hashedPassword,
      usercode,
      bankNumber,
      roles: roles || ["member"],
      registerTime: new Date(),
      lastSeen: new Date(),
      profileImage: profileImage || undefined,
      bankInfo: {
        security: { pin: hashedPin },
        bio: { firstname, lastname, phone, birthdate: new Date(), gender: "others", religion: "" },
        address: { location: address, city, state, country, zipcode },
        nok: { firstname: "", lastname: "", relationship: "", address: "" },
        system: { currency: currency || "USD", account: "" },
      },
      bankAccount: { verified: verified || false, canTransfer: canTransfer || false },
      bankBalance: new Map([[currency || "USD", initialBalance || 0]]),
    })

    await newUser.save()

    try {
      await sendWelcomeEmail(email, `${firstname} ${lastname}`, bankNumber, usercode)
    } catch (err) {
      console.error("Email error:", err)
    }

    return NextResponse.json({
      message: "User created successfully",
      user: { id: newUser._id, email: newUser.email, bankNumber, name: `${firstname} ${lastname}` },
    })
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
