// app/admin/loans/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle, XCircle, Clock, Search, Eye } from "lucide-react"
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
  approvedBy?: {
    bankInfo: {
      bio: {
        firstname: string
        lastname: string
      }
    }
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
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />
      case 'active': return <CheckCircle className="h-4 w-4 text-blue-600" />
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'defaulted': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="p-6 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Loan Applications</h1>
        <p className="text-muted-foreground">Manage loan applications and approvals</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, account number, or loan type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Applications</CardTitle>
          <CardDescription>
            {filteredLoans.length} loan(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Loan Details</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoans.map((loan) => (
                <TableRow key={loan._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {loan.userId.bankInfo.bio.firstname} {loan.userId.bankInfo.bio.lastname}
                      </div>
                      <div className="text-sm text-muted-foreground">{loan.userId.email}</div>
                      <div className="text-xs text-muted-foreground">{loan.userId.bankNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium capitalize">{loan.loanType} Loan</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{loan.purpose}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{loan.amount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{loan.monthlyPayment.toFixed(2)}/month</div>
                  </TableCell>
                  <TableCell>{loan.duration} months</TableCell>
                  <TableCell>{new Date(loan.appliedDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(loan.status)}>
                      {getStatusIcon(loan.status)}
                      <span className="ml-1">{loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {loan.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => updateLoanStatus(loan._id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReject(loan)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredLoans.length === 0 && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No loans found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Loan Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this loan application. The applicant will receive this feedback.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Applicant</label>
              <p className="text-sm">
                {selectedLoan?.userId.bankInfo.bio.firstname} {selectedLoan?.userId.bankInfo.bio.lastname}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Loan Details</label>
              <p className="text-sm capitalize">
                {selectedLoan?.loanType} Loan - {selectedLoan?.amount.toLocaleString()} for {selectedLoan?.duration} months
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Reason for Rejection *
              </label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => selectedLoan && updateLoanStatus(selectedLoan._id, 'rejected', rejectionReason)}
              disabled={!rejectionReason.trim()}
            >
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
