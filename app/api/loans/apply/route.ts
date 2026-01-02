// app/api/loans/apply/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Loan from "@/models/Loan"
import User from "@/models/User"
import { getLoanTypeDetails, calculateMonthlyPayment, calculateTotalAmount } from "@/lib/utils/loan"
import { sendLoanApplicationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { 
      loanType, 
      amount, 
      duration, 
      purpose, 
      employmentStatus, 
      annualIncome,
      existingLoans 
    } = await request.json()

    // Validate required fields
    if (!loanType || !amount || !duration || !purpose || !employmentStatus || !annualIncome) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const loanDetails = getLoanTypeDetails(loanType)

    // Validate amount and duration against loan type limits
    if (amount < loanDetails.minAmount || amount > loanDetails.maxAmount) {
      return NextResponse.json({ 
        error: `Amount must be between ${loanDetails.minAmount.toLocaleString()} and ${loanDetails.maxAmount.toLocaleString()} ${user.bankInfo.system.currency}` 
      }, { status: 400 })
    }

    if (duration > loanDetails.maxDuration) {
      return NextResponse.json({ 
        error: `Duration cannot exceed ${loanDetails.maxDuration} months for this loan type` 
      }, { status: 400 })
    }

    // Check if user already has a pending application for the same loan type
    const existingPendingLoan = await Loan.findOne({
      userId: user._id,
      loanType,
      status: "pending"
    })

    if (existingPendingLoan) {
      return NextResponse.json({ error: "You already have a pending application for this loan type" }, { status: 400 })
    }

    // Calculate loan details
    const interestRate = loanDetails.interestRate
    const monthlyPayment = calculateMonthlyPayment(amount, interestRate, duration)
    const totalAmount = calculateTotalAmount(monthlyPayment, duration)

    // Create new loan application
    const loan = new Loan({
      userId: user._id,
      loanType,
      amount,
      interestRate,
      duration,
      purpose,
      monthlyPayment,
      totalAmount,
      remainingBalance: totalAmount,
      currency: user.bankInfo.system.currency,
      employmentStatus,
      annualIncome,
      existingLoans: existingLoans || 0,
      creditScore: Math.floor(Math.random() * 200) + 650 // Mock credit score
    })

    await loan.save()

    // Send email notification
    await sendLoanApplicationEmail(
      user.email,
      user.bankInfo.bio.firstname,
      loanType,
      amount,
      user.bankInfo.system.currency
    )

    return NextResponse.json({ 
      message: "Loan application submitted successfully", 
      loan: {
        id: loan._id,
        loanType,
        amount,
        duration,
        status: loan.status,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100
      }
    })
  } catch (error) {
    console.error("Error applying for loan:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
