import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminToken } from "@/lib/auth"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import { sendEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const adminUser = await verifyAdminToken(request)
    if (!adminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { userId, role } = await request.json()

    if (!userId || !role) {
      return NextResponse.json({ message: "User ID and role are required" }, { status: 400 })
    }

    const validRoles = ["user", "premium", "vip", "administrator", "super-admin"]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 })
    }

    await dbConnect()

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Update user role
    if (!user.roles.includes(role)) {
      user.roles.push(role)
      await user.save()

      // Send notification email
      await sendEmail({
        to: user.email,
        subject: "Role Approved - Account Updated",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Role Approved</h2>
            <p>Dear ${user.bankInfo.bio.firstname},</p>
            <p>Your account role has been approved and updated by an administrator.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>New Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</p>
              <p><strong>Approved By:</strong> ${adminUser.email}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <p>You now have access to additional features and privileges associated with your new role.</p>
            <p>If you have any questions, please contact our support team.</p>
            <p>Best regards,<br>Banking System Team</p>
          </div>
        `,
      })
    }

    return NextResponse.json({
      message: "Role approved successfully",
      user: {
        id: user._id,
        email: user.email,
        roles: user.roles,
      },
    })
  } catch (error) {
    console.error("Approve role error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
