// app/api/admin/loans/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Loan from "@/models/Loan"
import User from "@/models/User"
import { sendLoanStatusUpdateEmail } from "@/lib/email"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const user = await getCurrentUser()
    
    if (!user || !user.roles.includes('super-admin')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const query: any = {}
    if (status && status !== 'all') {
      query.status = status
    }

    const loans = await Loan.find(query)
      .populate('userId', 'bankInfo bankNumber email')
      .populate('approvedBy', 'bankInfo')
      .sort({ appliedDate: -1 })

    return NextResponse.json({ loans })
  } catch (error) {
    console.error("Error fetching loans:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect()
    const user = await getCurrentUser()
    
    if (!user || !user.roles.includes('super-admin')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { loanId, status, rejectionReason } = await request.json()

    if (!loanId || !status) {
      return NextResponse.json({ error: "Loan ID and status are required" }, { status: 400 })
    }

    const loan = await Loan.findById(loanId).populate('userId')
    if (!loan) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 })
    }

    const previousStatus = loan.status
    loan.status = status
    loan.approvedBy = user._id
    
    if (status === 'approved') {
      loan.approvedDate = new Date()
      loan.dueDate = new Date()
      loan.dueDate.setMonth(loan.dueDate.getMonth() + loan.duration)
    }
    
    if (status === 'rejected' && rejectionReason) {
      loan.rejectionReason = rejectionReason
    }

    await loan.save()

    // Send email notification if status changed
    if (previousStatus !== status) {
      await sendLoanStatusUpdateEmail(
        loan.userId.email,
        loan.userId.bankInfo.bio.firstname,
        loan.loanType,
        loan.amount,
        loan.currency,
        status,
        rejectionReason
      )
    }

    return NextResponse.json({ 
      message: "Loan status updated successfully",
      loan 
    })
  } catch (error) {
    console.error("Error updating loan status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
