import { type NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import dbConnect from '@/lib/database'
import Transfer from '@/models/Transfer'

export async function GET(
  request: NextRequest,
  { params }: { params: { txRef: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { txRef } = params

    if (!txRef) {
      return NextResponse.json(
        { message: 'Transaction reference is required' },
        { status: 400 }
      )
    }

    await dbConnect()

    const transfer = await Transfer.findOne({
      txRef,
      userId: user._id.toString(),
    })
    if (!transfer) {
      return NextResponse.json(
        { message: 'Transfer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      transfer: {
        txRef: transfer.txRef,
        amount: transfer.amount,
        currency: transfer.currency,
        bankName: transfer.bankName,
        accountNumber: transfer.accountNumber,
        accountHolder: transfer.accountHolder,
        country: transfer.country,
        transferType: transfer.transferType,
        txStatus: transfer.txStatus,
        description: transfer.description,
        verificationSteps: transfer.verificationSteps || {},
      },
    })
  } catch (error) {
    console.error('Get transfer error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
