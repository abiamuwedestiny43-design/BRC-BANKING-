import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser, canTransfer } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Transfer from "@/models/Transfer"
import { generateTxRef, calculateTransferCharge } from "@/lib/utils/banking"
import { generateOTP, sendTransferOTP } from "@/lib/email"
import {
  transferRateLimit,
  getClientIP,
  validateAmount,
  validateAccountNumber,
  sanitizeInput,
  checkTransactionLimits,
  logAuditEvent,
} from "@/lib/security"
import User from "@/models/User"
import Notification from "@/models/Notification"
import SystemOption from "@/models/SystemOption"

export async function POST(request: NextRequest) {
  const ip = getClientIP(request)

  // Rate limiting
  const rateCheck = transferRateLimit(ip)
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { message: "Too many transfer attempts. Try again later.", resetTime: rateCheck.resetTime },
      { status: 429 },
    )
  }

  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    await dbConnect()

    // Check global flag first - Disabled by request to rely only on user permissions
    // const globalOpt = await SystemOption.findOne({ key: "bank:transfer.global.enabled" }).lean()
    // const globalEnabled = typeof globalOpt?.value === "boolean" ? (globalOpt.value as boolean) : true
    // if (!globalEnabled) {
    //   logAuditEvent({
    //     userId: currentUser._id.toString(),
    //     action: "transfer_attempt_blocked",
    //     details: { reason: "global_transfers_disabled", ip },
    //     ipAddress: ip,
    //     userAgent: request.headers.get("user-agent") || "unknown",
    //     success: false,
    //   })
    //   return NextResponse.json({ message: "Transfers are currently disabled by the administrator." }, { status: 403 })
    // }

    // Fetch full Mongoose user document
    const user = await User.findById(currentUser._id)
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 })

    // if (!canTransfer(user)) {
    //   logAuditEvent({
    //     userId: user._id.toString(),
    //     action: "transfer_attempt_blocked",
    //     details: { reason: "account_not_verified", ip },
    //     ipAddress: ip,
    //     userAgent: request.headers.get("user-agent") || "unknown",
    //     success: false,
    //   })
    //   return NextResponse.json({ message: "Account not verified or transfers disabled" }, { status: 403 })
    // }

    const {
      transferType,
      bankName,
      accountNumber,
      accountHolder,
      amount,
      currency,
      description,
      country,
      routingCode,
    } = await request.json()

    // Transfer Type Permissions Check
    if (transferType === "local") {
      // Check user-specific local transfer permission
      if (!user.bankAccount.canLocalTransfer) {
        logAuditEvent({
          userId: user._id.toString(),
          action: "transfer_attempt_blocked",
          details: { reason: "user_local_transfers_disabled", ip },
          ipAddress: ip,
          userAgent: request.headers.get("user-agent") || "unknown",
          success: false,
        })
        return NextResponse.json({ message: "Local transfers are not permitted for your account. Please contact support." }, { status: 403 })
      }

      // Check global system flag - Disabled by request
      // const opt = await SystemOption.findOne({ key: "bank:transfer.local.enabled" }).lean()
      // const localEnabled = typeof opt?.value === "boolean" ? (opt.value as boolean) : true
      // if (!localEnabled) {
      //   logAuditEvent({
      //     userId: user._id.toString(),
      //     action: "transfer_attempt_blocked",
      //     details: { reason: "global_local_transfers_disabled", ip },
      //     ipAddress: ip,
      //     userAgent: request.headers.get("user-agent") || "unknown",
      //     success: false,
      //   })
      //   return NextResponse.json(
      //     { message: "Local transfers are currently disabled by the administrator." },
      //     { status: 403 },
      //   )
      // }
    } else if (transferType === "international") {
      // Check user-specific international transfer permission
      if (!user.bankAccount.canInternationalTransfer) {
        logAuditEvent({
          userId: user._id.toString(),
          action: "transfer_attempt_blocked",
          details: { reason: "user_intl_transfers_disabled", ip },
          ipAddress: ip,
          userAgent: request.headers.get("user-agent") || "unknown",
          success: false,
        })
        return NextResponse.json({ message: "International transfers are not permitted for your account. Please contact support." }, { status: 403 })
      }
    }

    // Validate inputs
    const amountValidation = validateAmount(amount)
    if (!amountValidation.valid) return NextResponse.json({ message: amountValidation.error }, { status: 400 })

    const accountValidation = validateAccountNumber(accountNumber)
    if (!accountValidation.valid) return NextResponse.json({ message: accountValidation.error }, { status: 400 })

    const sanitizedBankName = sanitizeInput(bankName)
    const sanitizedAccountHolder = sanitizeInput(accountHolder)
    const sanitizedDescription = sanitizeInput(description || "")

    if (!sanitizedBankName || !sanitizedAccountHolder) {
      return NextResponse.json({ message: "Invalid bank name or account holder" }, { status: 400 })
    }

    // Transaction limits
    const limitsCheck = await checkTransactionLimits(user._id.toString(), amount, currency)
    if (!limitsCheck.allowed) {
      logAuditEvent({
        userId: user._id.toString(),
        action: "transfer_limit_exceeded",
        details: { amount, currency, error: limitsCheck.error, ip },
        ipAddress: ip,
        userAgent: request.headers.get("user-agent") || "unknown",
        success: false,
      })
      return NextResponse.json({ message: limitsCheck.error }, { status: 400 })
    }

    // Ensure bankBalance is a Map
    user.bankBalance =
      user.bankBalance instanceof Map ? user.bankBalance : new Map(Object.entries(user.bankBalance || {}))
    const assignedCurrency: string = (user.bankInfo?.system?.currency || "USD").toUpperCase()
    const userBalance = user.bankBalance.get(assignedCurrency) || 0

    const transferCharge = calculateTransferCharge(amount, transferType)
    const totalAmount = amount + transferCharge

    if (userBalance < totalAmount) {
      logAuditEvent({
        userId: user._id.toString(),
        action: "transfer_insufficient_funds",
        details: { requestedAmount: totalAmount, availableBalance: userBalance, currency: assignedCurrency, ip },
        ipAddress: ip,
        userAgent: request.headers.get("user-agent") || "unknown",
        success: false,
      })
      return NextResponse.json({ message: "Insufficient balance" }, { status: 400 })
    }

    const txRef = generateTxRef()

    const transfer = new Transfer({
      userId: user._id.toString(),
      amount,
      currency: assignedCurrency, // enforce assigned currency
      txRef,
      txReason: sanitizedDescription,
      txRegion: transferType,
      transferType: transferType,
      txCharge: transferCharge,
      txStatus: "pending",
      bankCountry: country,
      bankName: sanitizedBankName,
      bankAccount: accountNumber,
      accountNumber: accountNumber,
      bankHolder: sanitizedAccountHolder,
      accountHolder: sanitizedAccountHolder,
      identifier: transferType === "international" ? "Routing Code / SWIFT Code" : undefined,
      identifierCode: routingCode,
      routingCode: routingCode,
      country: country,
      description: sanitizedDescription,
      senderName: `${user.bankInfo.bio.firstname} ${user.bankInfo.bio.lastname}`,
      senderAccount: user.bankNumber,
    })

    if (transferType === "local") {
      const otp = generateOTP()
      transfer.otpCode = otp
      transfer.otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      await sendTransferOTP(
        user.email,
        `${user.bankInfo.bio.firstname} ${user.bankInfo.bio.lastname}`,
        otp,
        amount,
        assignedCurrency, // enforce assigned currency in notifications
        sanitizedAccountHolder,
        sanitizedBankName,
      )
    }

    await transfer.save()

    // Notification for initiation
    const initiationNotification = new Notification({
      userId: user._id,
      model: "bank:transfer",
      message: `Hi ${user.bankInfo.bio.firstname},
Your transfer of ${amount.toLocaleString()} ${assignedCurrency} to ${sanitizedAccountHolder} has been initiated and is awaiting verification.
Ref: ${txRef}`,
      redirect: `/dashboard/transfer/verify/${transferType === "local" ? "otp" : "cot"}/${txRef}`,
    })
    await initiationNotification.save()

    logAuditEvent({
      userId: user._id.toString(),
      action: "transfer_initiated",
      details: { txRef, amount, currency: assignedCurrency, transferType, recipient: sanitizedAccountHolder, ip }, // enforce assigned currency
      ipAddress: ip,
      userAgent: request.headers.get("user-agent") || "unknown",
      success: true,
    })

    return NextResponse.json({
      message: "Transfer initiated successfully",
      transfer: {
        txRef: transfer.txRef,
        amount: transfer.amount,
        currency: transfer.currency,
        recipient: transfer.bankHolder,
        requiresOtp: transferType === "local",
        requiresCodes: transferType === "international",
      },
    })
  } catch (error) {
    console.error("Transfer initiation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
