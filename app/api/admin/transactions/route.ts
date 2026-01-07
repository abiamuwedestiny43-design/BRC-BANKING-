import { type NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import dbConnect from '@/lib/database'
import User from '@/models/User'
import Transfer from '@/models/Transfer'
import TransferMeta from '@/models/TransferMeta'
import Notification from '@/models/Notification'
import { generateTxRef } from '@/lib/utils/banking'
import { sendTransactionNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !isAdmin(currentUser)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { userId, type, amount, currency, description } = await request.json()

    if (!userId || !type || !amount || amount <= 0) {
      return NextResponse.json(
        { message: 'Invalid parameters' },
        { status: 400 }
      )
    }

    await dbConnect()
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const userAssignedCurrency =
      user?.bankInfo?.system?.currency || currency || 'USD'
    const useCurrency = currency || userAssignedCurrency
    const currentBalance = user.bankBalance.get(useCurrency) || 0

    if (
      !['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CHF', 'CAD', 'AUD', 'SGD'].includes(
        useCurrency
      )
    ) {
      return NextResponse.json(
        { message: 'Unsupported currency' },
        { status: 400 }
      )
    }

    // Update user balance
    if (type === 'credit') {
      user.bankBalance.set(useCurrency, currentBalance + amount)
    } else {
      user.bankBalance.set(useCurrency, currentBalance - amount)
    }
    await user.save()

    // Create transfer record
    const fullName = `${user.bankInfo.bio.firstname} ${user.bankInfo.bio.lastname}`
    const transfer = new Transfer({
      userId: String(user._id), // required
      amount,
      currency: useCurrency,
      txRef: generateTxRef(),
      txReason: description || `Admin ${type}`,
      txRegion: 'local',
      transferType: 'local', // required
      txStatus: 'success',
      bankName: 'PrimeHarbor Bank',
      bankAccount: user.bankNumber,
      accountNumber: user.bankNumber, // required
      bankHolder: fullName,
      accountHolder: fullName, // required
      senderName: 'Admin',
      txType: type,
    })
    await transfer.save()

    // Create transfer meta
    const transferMeta = new TransferMeta({
      txRef: transfer.txRef,
      accountNumber: user.bankNumber,
      txType: type,
      amount,
      status: true,
      userId: user._id,
    })
    await transferMeta.save()

    // Create notification
    const newBalance = user.bankBalance.get(useCurrency)
    const notification = new Notification({
      userId: user._id,
      model: 'bank:transfer',
      message: `Hi ${user.bankInfo.bio.firstname},
This is to notify you that an amount of ${amount.toLocaleString()} ${useCurrency} has been ${
        type === 'credit' ? 'credited to' : 'debited from'
      } your account.
Acc: ${user.bankNumber.slice(0, 3)}***${user.bankNumber.slice(-3)}
Desc: ${description || `Admin ${type}`}
Time: ${new Date().toLocaleDateString()}
Total Bal: ${newBalance?.toLocaleString()} ${useCurrency}`,
      redirect: `/dashboard/receipt/${transfer.txRef}`,
    })
    await notification.save()

    try {
      await sendTransactionNotification(
        user.email,
        `${user.bankInfo.bio.firstname} ${user.bankInfo.bio.lastname}`,
        type,
        amount,
        useCurrency,
        user.bankNumber,
        description || `Admin ${type}`,
        newBalance || 0,
        transfer.txRef
      )
    } catch (emailError) {
      console.error(
        'Failed to send transaction notification email:',
        emailError
      )
      // Don't fail transaction if email fails
    }

    return NextResponse.json({
      message: 'Transaction completed successfully',
      txRef: transfer.txRef,
      newBalance,
    })
  } catch (error) {
    console.error('Admin transaction error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
