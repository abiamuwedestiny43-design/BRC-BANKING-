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

    const { userId, notes } = await request.json()

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 })
    }

    await dbConnect()

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Update user verification status
    user.bankAccount.verified = true
    user.bankAccount.canTransfer = true

    // Add verification metadata
    if (!user.bankAccount.verificationMeta) {
      user.bankAccount.verificationMeta = {}
    }

    user.bankAccount.verificationMeta.verifiedBy = adminUser.id
    user.bankAccount.verificationMeta.verifiedAt = new Date()
    user.bankAccount.verificationMeta.notes = notes || ""

    await user.save()

    // Send verification confirmation email
    await sendEmail({
      to: user.email,
      subject: "Account Verified - Full Access Granted",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Account Verified Successfully</h2>
          <p>Dear ${user.bankInfo.bio.firstname},</p>
          <p>Congratulations! Your account has been successfully verified by our team.</p>
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
            <p><strong>✅ Account Status:</strong> Verified</p>
            <p><strong>✅ Transfer Privileges:</strong> Enabled</p>
            <p><strong>Verified By:</strong> ${adminUser.email}</p>
            <p><strong>Verification Date:</strong> ${new Date().toLocaleString()}</p>
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
          </div>
          <p>You now have full access to all banking features including:</p>
          <ul>
            <li>Local and international transfers</li>
            <li>Higher transaction limits</li>
            <li>Premium customer support</li>
            <li>Advanced banking features</li>
          </ul>
          <p>Thank you for choosing our banking services!</p>
          <p>Best regards,<br>Banking System Team</p>
        </div>
      `,
    })

    return NextResponse.json({
      message: "User verified successfully",
      user: {
        id: user._id,
        email: user.email,
        verified: user.bankAccount.verified,
        canTransfer: user.bankAccount.canTransfer,
      },
    })
  } catch (error) {
    console.error("Verify user error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
