import { type NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/database'
import User from '@/models/User'
import { verifyPassword, generateToken, type AuthUser } from '@/lib/auth'
import {
  loginRateLimit,
  getClientIP,
  trackFailedLogin,
  clearFailedLogins,
  logAuditEvent,
} from '@/lib/security'

export async function POST(request: NextRequest) {
  const ip = getClientIP(request)

  // Check rate limit
  const rateCheck = loginRateLimit(ip)
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        message: 'Too many login attempts. Please try again later.',
        resetTime: rateCheck.resetTime,
      },
      { status: 429 }
    )
  }

  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check account lockout
    const lockoutCheck = trackFailedLogin(email)
    if (lockoutCheck.locked) {
      logAuditEvent({
        userId: email,
        action: 'login_attempt_locked',
        details: { email, ip },
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || 'unknown',
        success: false,
      })

      return NextResponse.json(
        {
          message: `Account temporarily locked. Try again after ${new Date(
            lockoutCheck.lockedUntil!
          ).toLocaleTimeString()}`,
        },
        { status: 423 }
      )
    }

    await dbConnect()
    const user = await User.findOne({ email })

    if (!user || !(await verifyPassword(password, user.password))) {
      logAuditEvent({
        userId: email,
        action: 'login_failed',
        details: {
          email,
          ip,
          attemptsRemaining: lockoutCheck.attemptsRemaining,
        },
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || 'unknown',
        success: false,
      })

      return NextResponse.json(
        {
          message: 'Invalid email or password',
          attemptsRemaining: lockoutCheck.attemptsRemaining,
        },
        { status: 401 }
      )
    }

    // Clear failed login attempts on successful login
    clearFailedLogins(email)

    // Update last seen
    user.lastSeen = new Date()
    await user.save()

    const authUser: AuthUser = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      roles: user.roles,
      bankNumber: user.bankNumber,
    }

    const token = generateToken(authUser)

    logAuditEvent({
      userId: user._id.toString(),
      action: 'login_success',
      details: { email, ip },
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || 'unknown',
      success: true,
    })

    const response = NextResponse.json({
      message: 'Login successful',
      user: authUser,
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    console.log(
      '[santech] Login successful for user:',
      authUser.email,
      'with roles:',
      authUser.roles
    )
    console.log('[santech] Auth token set in cookie')

    return response
  } catch (error) {
    console.error('Login error:', error)
    logAuditEvent({
      userId: 'unknown',
      action: 'login_error',
      details: { ip, error: error.message },
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || 'unknown',
      success: false,
    })

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
