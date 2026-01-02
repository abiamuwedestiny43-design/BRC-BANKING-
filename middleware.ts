import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// 🔒 Verify JWT token (Edge-safe)
async function verifyTokenEdge(token: string) {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const [header, payload, signature] = parts

    const decodedHeader = JSON.parse(atob(header.replace(/-/g, "+").replace(/_/g, "/")))
    const decodedPayload = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))

    // Expiration check
    if (decodedPayload.exp && Date.now() >= decodedPayload.exp * 1000) return null

    const encoder = new TextEncoder()
    const data = encoder.encode(`${header}.${payload}`)
    const secretKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    )

    const signatureBuffer = Uint8Array.from(atob(signature.replace(/-/g, "+").replace(/_/g, "/")), (c) =>
      c.charCodeAt(0)
    )

    const isValid = await crypto.subtle.verify("HMAC", secretKey, signatureBuffer, data)
    if (!isValid) return null

    return decodedPayload
  } catch (err) {
    console.error("[Middleware] Token verification error:", (err as Error).message)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  const { pathname } = request.nextUrl

  console.log("[Middleware] Path:", pathname, "| Token exists:", !!token)

  // Auth API routes that should always be accessible
  const authApiRoutes = ["/api/auth/login", "/api/auth/register", "/api/auth/logout"]
  
  // Allow auth API routes without any checks
  if (authApiRoutes.some((route) => pathname.startsWith(route))) {
    console.log("[Middleware] Auth API route allowed")
    return NextResponse.next()
  }

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/admin"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // If not a protected route, allow access without authentication
  if (!isProtectedRoute) {
    console.log("[Middleware] Public route allowed")
    
    // If user is logged in and tries to access /login, redirect based on role
    if (pathname === "/login" && token) {
      const user = await verifyTokenEdge(token)
      if (user) {
        if (user.roles.includes("super-admin")) {
          console.log("[Middleware] Logged-in super-admin at /login → redirecting to /admin")
          return NextResponse.redirect(new URL("/admin", request.url))
        } else if (user.roles.includes("member")) {
          console.log("[Middleware] Logged-in member at /login → redirecting to /dashboard")
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }
      }
    }
    
    return NextResponse.next()
  }

  // For protected routes, check authentication
  if (!token) {
    console.log("[Middleware] No token found for protected route → redirecting to /login")
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Verify user token
  const user = await verifyTokenEdge(token)
  if (!user) {
    console.log("[Middleware] Invalid or expired token → redirecting to /login")
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("auth-token")
    return response
  }

  console.log(`[Middleware] Authenticated user: ${user.email} | Roles: ${user.roles}`)

  // 🧭 Protect /admin route
  if (pathname.startsWith("/admin")) {
    if (!user.roles.includes("super-admin")) {
      console.log("[Middleware] Unauthorized access to /admin → redirecting to /dashboard")
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // 🧭 Protect /dashboard route (for members)
  if (pathname.startsWith("/dashboard")) {
    if (!user.roles.includes("member") && !user.roles.includes("super-admin")) {
      console.log("[Middleware] Unauthorized access to /dashboard → redirecting to /login")
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Optional: redirect super-admins away from /dashboard
    if (user.roles.includes("super-admin")) {
      console.log("[Middleware] Super-admin visited /dashboard → redirecting to /admin")
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  // Continue to requested route
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
