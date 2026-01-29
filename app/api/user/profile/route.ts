// app/api/user/profile/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import { sendProfileUpdateEmail } from "@/lib/email"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const userDoc = await getCurrentUser()
    if (!userDoc) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const user = await User.findById(userDoc._id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        bankInfo: user.bankInfo,
        bankAccount: user.bankAccount,
        currency: user.bankInfo?.system?.currency || "USD",
      },
    })
  } catch (error) {
    console.error("Error getting profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect()
    const userDoc = await getCurrentUser()

    if (!userDoc) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await request.json()

    const updateFields: any = {}

    // Only update fields that are provided (not empty)
    if (updates.firstname) {
      updateFields["bankInfo.bio.firstname"] = updates.firstname
    }
    if (updates.lastname) {
      updateFields["bankInfo.bio.lastname"] = updates.lastname
    }
    if (updates.email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email: updates.email, _id: { $ne: userDoc._id } })
      if (existingUser) {
        return NextResponse.json({ error: "Email is already taken" }, { status: 400 })
      }
      updateFields.email = updates.email
    }
    if (updates.phone) {
      updateFields["bankInfo.bio.phone"] = updates.phone
    }
    if (updates.birthdate) {
      updateFields["bankInfo.bio.birthdate"] = new Date(updates.birthdate)
    }
    if (updates.gender) {
      updateFields["bankInfo.bio.gender"] = updates.gender
    }
    if (updates.religion) {
      updateFields["bankInfo.bio.religion"] = updates.religion
    }
    if (updates.location) {
      updateFields["bankInfo.address.location"] = updates.location
    }
    if (updates.city) {
      updateFields["bankInfo.address.city"] = updates.city
    }
    if (updates.state) {
      updateFields["bankInfo.address.state"] = updates.state
    }
    if (updates.country) {
      updateFields["bankInfo.address.country"] = updates.country
    }
    if (updates.zipcode) {
      updateFields["bankInfo.address.zipcode"] = updates.zipcode
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(userDoc._id, { $set: updateFields }, { new: true })

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Send profile update email
    try {
      await sendProfileUpdateEmail(
        updatedUser.email,
        `${updatedUser.bankInfo.bio.firstname} ${updatedUser.bankInfo.bio.lastname}`
      )
    } catch (emailError) {
      console.error("Failed to send profile update email:", emailError)
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        email: updatedUser.email,
        bankInfo: updatedUser.bankInfo,
      },
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
