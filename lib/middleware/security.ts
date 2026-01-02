import { type NextRequest, NextResponse } from "next/server"
import { getClientIP, logAuditEvent } from "@/lib/security"

export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  rateLimiter: (identifier: string) => { allowed: boolean; remaining: number; resetTime: number },
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const ip = getClientIP(request)
    const limit = rateLimiter(ip)

    if (!limit.allowed) {
      return NextResponse.json(
        {
          message: "Too many requests. Please try again later.",
          resetTime: limit.resetTime,
        },
        { status: 429 },
      )
    }

    const response = await handler(request)

    // Add rate limit headers
    response.headers.set("X-RateLimit-Remaining", limit.remaining.toString())
    response.headers.set("X-RateLimit-Reset", limit.resetTime.toString())

    return response
  }
}

export function withAuditLog(handler: (request: NextRequest) => Promise<NextResponse>, action: string) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const ip = getClientIP(request)
    const userAgent = request.headers.get("user-agent") || "unknown"

    let userId = "anonymous"
    let success = false

    try {
      const response = await handler(request)
      success = response.status < 400

      // Try to extract user ID from response or request
      if (response.status < 400) {
        const responseData = await response
          .clone()
          .json()
          .catch(() => ({}))
        userId = responseData.user?.id || userId
      }

      logAuditEvent({
        userId,
        action,
        details: { method: request.method, url: request.url },
        ipAddress: ip,
        userAgent,
        success,
      })

      return response
    } catch (error) {
      logAuditEvent({
        userId,
        action,
        details: { method: request.method, url: request.url, error: error.message },
        ipAddress: ip,
        userAgent,
        success: false,
      })

      throw error
    }
  }
}
