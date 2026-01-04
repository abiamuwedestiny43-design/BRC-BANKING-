// components/loans/LoanComponent.tsx
"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ILoan } from "@/models/Loan"
import { Calendar, DollarSign, Clock, Target, TrendingUp, AlertCircle } from "lucide-react"

interface LoanComponentProps {
  loan: ILoan
  showDetails?: boolean
}

export default function LoanComponent({ loan, showDetails = false }: LoanComponentProps) {
  const progress = loan.status === 'active' ?
    ((loan.totalAmount - loan.remainingBalance) / loan.totalAmount) * 100 : 0

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved': return { label: 'Auth Approved', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
      case 'pending': return { label: 'Under Review', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' }
      case 'rejected': return { label: 'Auth Denied', color: 'text-red-400 bg-red-500/10 border-red-500/20' }
      case 'active': return { label: 'Live Stream', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]' }
      case 'completed': return { label: 'Protocol Terminated', color: 'text-slate-400 bg-white/5 border-white/10' }
      case 'defaulted': return { label: 'System Alert', color: 'text-red-500 bg-red-500/10 border-red-500/20 animate-pulse' }
      default: return { label: 'Unknown', color: 'text-slate-500 bg-white/5' }
    }
  }

  const status = getStatusConfig(loan.status)

  return (
    <div className="border border-white/5 rounded-[2.5rem] p-8 space-y-6 bg-white/[0.02] backdrop-blur-md shadow-2xl relative overflow-hidden group">
      {/* Gloss Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-1">Loan Protocol</p>
          <h3 className="font-black text-xl text-white uppercase tracking-tight capitalize">{loan.loanType}</h3>
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase">
            <Calendar className="h-3 w-3" />
            Applied: {new Date(loan.appliedDate).toLocaleDateString()}
          </div>
        </div>
        <div className={cn("px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all", status.color)}>
          {status.label}
        </div>
      </div>

      {/* Loan Details */}
      <div className="grid grid-cols-2 gap-8 text-sm relative z-10">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <DollarSign className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Principal</div>
            <div className="font-black text-white text-lg">{loan.amount.toLocaleString()} <span className="text-slate-500 text-xs">{loan.currency}</span></div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
            <Clock className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Term</div>
            <div className="font-black text-white text-lg">{loan.duration} <span className="text-slate-500 text-xs">Months</span></div>
          </div>
        </div>

        {showDetails && (
          <>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                <Target className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Monthly</div>
                <div className="font-black text-white text-lg">{loan.monthlyPayment.toFixed(2)} <span className="text-slate-500 text-xs">{loan.currency}</span></div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Interest</div>
                <div className="font-black text-white text-lg">{loan.interestRate}<span className="text-emerald-500 text-xs">%</span></div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Progress Bar for Active Loans */}
      {loan.status === 'active' && (
        <div className="space-y-4 pt-4 border-t border-white/5 relative z-10">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Repayment Stream</p>
              <p className="text-xs text-slate-400 font-medium">Remaining: <span className="text-white font-bold">{(loan.remainingBalance || 0).toFixed(2)} {loan.currency}</span></p>
            </div>
            <span className="text-xl font-black text-emerald-400">{progress.toFixed(1)}%</span>
          </div>
          <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}% ` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
            />
          </div>
        </div>
      )}

      {/* Purpose */}
      {showDetails && (
        <div className="pt-4 border-t border-white/5 relative z-10">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Protocol Objective</div>
          <p className="text-sm text-slate-400 font-medium leading-relaxed italic">"{loan.purpose}"</p>
        </div>
      )}

      {/* Rejection Reason */}
      {loan.status === 'rejected' && loan.rejectionReason && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 relative z-10 transition-all hover:bg-red-500/10">
          <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
            <AlertCircle className="h-3 w-3" /> System Rejection Notes
          </div>
          <p className="text-sm text-red-400/80 font-medium leading-relaxed">{loan.rejectionReason}</p>
        </div>
      )}
    </div>
  )
}
