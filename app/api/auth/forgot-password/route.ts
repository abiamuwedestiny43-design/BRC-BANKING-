import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/database'
import User from '@/models/User'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 },
      )
    }

    const user = await User.findOne({ email: email.toLowerCase() })

    // Don't reveal if user exists or not for security
    if (!user) {
      return NextResponse.json({
        message:
          'If an account with that email exists, a password reset link has been sent.',
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    // Save hashed token and expiry to user
    user.vCode = resetTokenHash
    user.resetPasswordExpiry = new Date(Date.now() + 3600000) // 1 hour from now
    await user.save()

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.primehaborbk.online'}/reset-password?token=${resetToken}&email=${email}`

    // Send email
    await sendPasswordResetEmail(
      user.email,
      `${user.bankInfo.bio.firstname} ${user.bankInfo.bio.lastname}`,
      resetUrl,
    )

    return NextResponse.json({
      message:
        'If an account with that email exists, a password reset link has been sent.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    )
  }
}
