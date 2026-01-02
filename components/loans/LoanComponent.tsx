// components/loans/LoanComponent.tsx
"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getStatusColor } from "@/lib/utils/loan"
import type { ILoan } from "@/models/Loan"
import { Calendar, DollarSign, Clock, Target } from "lucide-react"

interface LoanComponentProps {
  loan: ILoan
  showDetails?: boolean
}

export default function LoanComponent({ loan, showDetails = false }: LoanComponentProps) {
  const progress = loan.status === 'active' ? 
    ((loan.totalAmount - loan.remainingBalance) / loan.totalAmount) * 100 : 0

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return '✅'
      case 'pending': return '⏳'
      case 'rejected': return '❌'
      case 'active': return '📊'
      case 'completed': return '🎉'
      case 'defaulted': return '⚠️'
      default: return '📄'
    }
  }

  return (
    <div className="border rounded-lg p-6 space-y-4 bg-white shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg capitalize">{loan.loanType} Loan</h3>
          <p className="text-sm text-muted-foreground">Applied: {new Date(loan.appliedDate).toLocaleDateString()}</p>
        </div>
        <Badge className={getStatusColor(loan.status)}>
          {getStatusIcon(loan.status)}
          <span className="ml-1">{loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}</span>
        </Badge>
      </div>

      {/* Loan Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-green-600" />
          <div>
            <div className="text-muted-foreground">Amount</div>
            <div className="font-semibold">{loan.amount.toLocaleString()} {loan.currency}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-blue-600" />
          <div>
            <div className="text-muted-foreground">Duration</div>
            <div className="font-semibold">{loan.duration} months</div>
          </div>
        </div>

        {showDetails && (
          <>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-purple-600" />
              <div>
                <div className="text-muted-foreground">Monthly Payment</div>
                <div className="font-semibold">{loan.monthlyPayment.toFixed(2)} {loan.currency}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-orange-600" />
              <div>
                <div className="text-muted-foreground">Interest Rate</div>
                <div className="font-semibold">{loan.interestRate}%</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Progress Bar for Active Loans */}
      {loan.status === 'active' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Repayment Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground">
            Remaining: {(loan.remainingBalance || 0).toFixed(2)} {loan.currency}
          </div>
        </div>
      )}

      {/* Purpose */}
      {showDetails && (
        <div>
          <div className="text-sm text-muted-foreground">Purpose</div>
          <div className="text-sm">{loan.purpose}</div>
        </div>
      )}

      {/* Rejection Reason */}
      {loan.status === 'rejected' && loan.rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <div className="text-sm font-medium text-red-800">Reason for Rejection</div>
          <div className="text-sm text-red-700">{loan.rejectionReason}</div>
        </div>
      )}
    </div>
  )
}
