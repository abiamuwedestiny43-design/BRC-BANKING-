// app/admin/loans/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle, XCircle, Clock, Search, Eye, Banknote, ShieldCheck, Zap } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface LoanWithUser {
  _id: string
  loanType: string
  amount: number
  duration: number
  status: string
  appliedDate: string
  approvedDate?: string
  purpose: string
  monthlyPayment: number
  interestRate: number
  rejectionReason?: string
  userId: {
    bankInfo: {
      bio: {
        firstname: string
        lastname: string
      }
    }
    bankNumber: string
    email: string
  }
}

export default function AdminLoansPage() {
  const [loans, setLoans] = useState<LoanWithUser[]>([])
  const [filteredLoans, setFilteredLoans] = useState<LoanWithUser[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedLoan, setSelectedLoan] = useState<LoanWithUser | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchLoans()
  }, [])

  useEffect(() => {
    let filtered = loans

    if (statusFilter !== "all") {
      filtered = filtered.filter(loan => loan.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(loan =>
        loan.userId.bankInfo.bio.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.userId.bankNumber.includes(searchTerm) ||
        loan.loanType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredLoans(filtered)
  }, [loans, statusFilter, searchTerm])

  const fetchLoans = async () => {
    try {
      const response = await fetch('/api/admin/loans')
      const data = await response.json()
      if (response.ok) {
        setLoans(data.loans)
      }
    } catch (error) {
      console.error('Error fetching loans:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateLoanStatus = async (loanId: string, status: string, reason?: string) => {
    try {
      const response = await fetch('/api/admin/loans', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loanId, status, rejectionReason: reason }),
      })

      if (response.ok) {
        fetchLoans()
        setIsDialogOpen(false)
        setRejectionReason("")
        setSelectedLoan(null)
      }
    } catch (error) {
      console.error('Error updating loan status:', error)
    }
  }

  const handleReject = (loan: LoanWithUser) => {
    setSelectedLoan(loan)
    setIsDialogOpen(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-3 w-3" />
      case 'pending': return <Clock className="h-3 w-3" />
      case 'rejected': return <XCircle className="h-3 w-3" />
      case 'active': return <CheckCircle className="h-3 w-3" />
      default: return <AlertCircle className="h-3 w-3" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'rejected': return 'text-red-400 bg-red-500/10 border-red-500/20'
      case 'active': return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      case 'completed': return 'text-slate-400 bg-white/5 border-white/10'
      default: return 'text-slate-400 bg-white/5 border-white/10'
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-emerald-500 font-black animate-pulse flex items-center gap-3 uppercase tracking-widest">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        CALIBRATING LOAN SERVICES...
      </div>
    )
  }

  return (
    <div className="p-4 md:p-10 space-y-10 relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <div className="space-y-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
          <Banknote className="w-3 h-3" /> Asset Distribution
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
          Loan <span className="text-slate-500 italic">Services</span>
        </h1>
        <p className="text-slate-400 font-medium max-w-md">Authorized vetting and execution of institutional credit frameworks.</p>
      </div>

      {/* Filters */}
      <Card className="bg-white/[0.03] border-white/5 rounded-[2.5rem] p-8 relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500/50" />
            <Input
              placeholder="Query by applicant, account number, or loan type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-white/5 border-white/10 rounded-2xl h-14 text-white focus:border-emerald-500 transition-all font-medium"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-14 w-full md:w-[220px] bg-white/5 border-white/10 rounded-2xl text-slate-400 font-bold">
              <SelectValue placeholder="Loan Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#001c10] border-white/10 text-slate-300">
              <SelectItem value="all">All Loans</SelectItem>
              <SelectItem value="pending">Review Required</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="rejected">Denied</SelectItem>
              <SelectItem value="completed">Paid Off</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Loans Table */}
      <Card className="bg-white/[0.03] border-white/5 rounded-[3rem] overflow-hidden relative z-10">
        <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-black text-white italic tracking-tight">Active Applications</CardTitle>
              <CardDescription className="text-slate-500 font-medium">{filteredLoans.length} loan protocols detected in current cycle.</CardDescription>
            </div>
            <div className="hidden md:flex gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Exposure</p>
                <p className="text-lg font-black text-white">
                  ${loans.filter(l => l.status === 'active' || l.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/20 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-8 py-6">Applicant</th>
                  <th className="px-8 py-6">Loan Details</th>
                  <th className="px-8 py-6">Capital</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLoans.map((loan) => (
                  <tr key={loan._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xs uppercase tracking-tighter">
                          {loan.userId.bankInfo.bio.firstname[0]}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tight">{loan.userId.bankInfo.bio.firstname} {loan.userId.bankInfo.bio.lastname}</p>
                          <p className="text-[10px] font-black text-slate-500 tracking-widest mt-1 opacity-60 truncate max-w-[150px]">{loan.userId.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white uppercase tracking-tight">{loan.loanType} Framework</p>
                        <p className="text-[10px] text-slate-500 font-medium line-clamp-1 italic">"{loan.purpose}"</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-lg font-black text-white tracking-tighter">${loan.amount.toLocaleString()}</div>
                      <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{loan.duration} MOS @ {loan.interestRate}%</div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge className={`px-3 py-1.5 rounded-xl border flex w-fit items-center gap-2 text-[10px] font-black uppercase tracking-widest ${getStatusColor(loan.status)}Shadow ${getStatusColor(loan.status)}`}>
                        {getStatusIcon(loan.status)}
                        {loan.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2">
                        {loan.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateLoanStatus(loan._id, 'approved')}
                              className="h-10 px-6 rounded-xl bg-emerald-500 text-[#001c10] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleReject(loan)}
                              className="h-10 px-6 rounded-xl text-red-500 font-bold text-[10px] uppercase tracking-widest hover:bg-red-500/10"
                            >
                              Deny
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost" className="h-10 w-10 p-0 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLoans.length === 0 && (
              <div className="text-center py-20 space-y-4">
                <Search className="h-16 w-16 text-slate-500/20 mx-auto" />
                <p className="text-slate-500 font-medium italic">No loan applications found.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#001c10] border-white/10 rounded-[2.5rem] p-10 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white tracking-tight">Decline Application</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">
              Please provide a reason for rejecting this loan application. This will be sent to the user.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Account</p>
              <p className="text-sm font-bold text-white uppercase tracking-tight">
                {selectedLoan?.userId.bankInfo.bio.firstname} {selectedLoan?.userId.bankInfo.bio.lastname}
              </p>
              <p className="text-[10px] font-black text-red-500 mt-2 uppercase tracking-widest">
                ${selectedLoan?.amount.toLocaleString()} • {selectedLoan?.loanType} LOAN
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rejection Justification *</label>
              <Textarea
                placeholder="Declare the protocol violation or reason for denial..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="bg-white/5 border-white/10 rounded-2xl p-4 text-white focus:border-red-500 transition-all resize-none"
              />
            </div>
          </div>
          <DialogFooter className="pt-8">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl text-slate-400 font-bold hover:bg-white/5">
              Cancel
            </Button>
            <Button
              onClick={() => selectedLoan && updateLoanStatus(selectedLoan._id, 'rejected', rejectionReason)}
              disabled={!rejectionReason.trim()}
              className="bg-red-500 hover:bg-red-400 text-white font-black px-8 h-12 rounded-xl shadow-xl shadow-red-500/20 uppercase tracking-widest text-[10px]"
            >
              Confirm Denial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
