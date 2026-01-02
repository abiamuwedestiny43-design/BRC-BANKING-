import { NextResponse } from "next/server"
import { sendEmail, emailTemplates } from "@/lib/email"

export async function POST() {
  try {
    // Test email functionality
    const testEmail = "test@example.com"
    const template = emailTemplates.welcome("John Doe", "1041234567")

    const result = await sendEmail({
      to: testEmail,
      subject: template.subject,
      html: template.html,
    })

    return NextResponse.json({
      message: "Test email sent successfully",
      result,
    })
  } catch (error: any) {
    console.error("Test email error:", error)
    return NextResponse.json({ message: "Failed to send test email", error: error.message }, { status: 500 })
  }
}
