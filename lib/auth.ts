import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import User, { type IUser } from "@/models/User"
import dbConnect from "@/lib/database"
import { toPlainObject } from "@/lib/serialization"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_EXPIRES_IN = "7d"

export interface AuthUser {
  id: string
  email: string
  username?: string
  roles: string[]
  bankNumber: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: AuthUser): string {
  console.log("[santech] Generating token for user:", user.email, "with roles:", user.roles)
  return jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    console.log("[santech] Token verified for user:", decoded.email, "with roles:", decoded.roles)
    return decoded
  } catch (error) {
    console.log("[santech] Token verification failed:", error.message)
    return null
  }
}

export async function verifyTokenEdge(token: string): Promise<AuthUser | null> {
  try {
    // Split the JWT token
    const parts = token.split(".")
    if (parts.length !== 3) {
      console.log("[santech] Invalid JWT format")
      return null
    }

    const [header, payload, signature] = parts

    // Decode header and payload
    const decodedHeader = JSON.parse(atob(header.replace(/-/g, "+").replace(/_/g, "/")))
    const decodedPayload = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))

    // Check expiration
    if (decodedPayload.exp && Date.now() >= decodedPayload.exp * 1000) {
      console.log("[santech] Token expired")
      return null
    }

    // Verify signature using Web Crypto API
    const encoder = new TextEncoder()
    const data = encoder.encode(`${header}.${payload}`)
    const secretKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    )

    const expectedSignature = signature.replace(/-/g, "+").replace(/_/g, "/")
    const signatureBuffer = Uint8Array.from(atob(expectedSignature), (c) => c.charCodeAt(0))

    const isValid = await crypto.subtle.verify("HMAC", secretKey, signatureBuffer, data)

    if (!isValid) {
      console.log("[santech] Invalid token signature")
      return null
    }

    console.log("[santech] Token verified for user:", decodedPayload.email, "with roles:", decodedPayload.roles)
    return decodedPayload as AuthUser
  } catch (error) {
    console.log("[santech] Token verification failed:", error.message)
    return null
  }
}

export async function getCurrentUser(): Promise<any | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth-token")?.value

    console.log("[santech] Getting current user, token exists:", !!token)

    if (!token) {
      console.log("[santech] No auth token found")
      return null
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      console.log("[santech] Token verification failed")
      return null
    }

    await dbConnect()
    // Use .lean() to avoid hydrated Mongoose docs
    const userDoc = await User.findById(decoded.id).lean()

    if (!userDoc) {
      console.log("[santech] User not found in database")
      return null
    }

    console.log("[santech] User found in database:", userDoc.email)
    // Ensure plain object format (ObjectId → string, nested fixes)
    return toPlainObject(userDoc)
  } catch (error: any) {
    console.log("[santech] Error getting current user:", error.message)
    return null
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  try {
    const cookieStore = cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })
    console.log("[santech] Auth cookie set successfully")
  } catch (error) {
    console.log("[santech] Error setting auth cookie:", error.message)
  }
}

export async function clearAuthCookie(): Promise<void> {
  try {
    const cookieStore = cookies()
    cookieStore.delete("auth-token")
    console.log("[santech] Auth cookie cleared")
  } catch (error) {
    console.log("[santech] Error clearing auth cookie:", error.message)
  }
}

export function isAdmin(user: IUser): boolean {
  const adminRoles = user.roles.includes("super-admin") || user.roles.includes("administrator")
  console.log("[santech] Checking admin status for user:", user.email, "roles:", user.roles, "isAdmin:", adminRoles)
  return adminRoles
}

export function isSuperAdmin(user: IUser): boolean {
  return user.roles.includes("super-admin")
}

export function isRegularAdmin(user: IUser): boolean {
  return user.roles.includes("administrator") && !user.roles.includes("super-admin")
}

export function canTransfer(user: IUser): boolean {
  return user.bankAccount.verified && user.bankAccount.canTransfer
}

export async function verifyAdminToken(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get("auth-token")?.value

    console.log("[santech] Verifying admin token, token exists:", !!token)

    if (!token) {
      console.log("[santech] No auth token found in request")
      return null
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      console.log("[santech] Token verification failed")
      return null
    }

    await dbConnect()
    const user = await User.findById(decoded.id)

    if (!user) {
      console.log("[santech] User not found in database")
      return null
    }

    // Check if user has admin privileges
    if (!isAdmin(user)) {
      console.log("[santech] User does not have admin privileges:", user.email, "roles:", user.roles)
      return null
    }

    console.log("[santech] Admin token verified for user:", user.email, "with roles:", user.roles)
    return {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      roles: user.roles,
      bankNumber: user.bankNumber,
    }
  } catch (error) {
    console.log("[santech] Error verifying admin token:", error.message)
    return null
  }
}

export function getTokenPayload(token: string): AuthUser | null {
  try {
    const decoded = jwt.decode(token) as AuthUser
    return decoded
  } catch (error) {
    console.log("[santech] Error decoding token:", error.message)
    return null
  }
}
