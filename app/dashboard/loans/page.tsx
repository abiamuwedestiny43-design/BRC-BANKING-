// app/dashboard/loans/page.tsx
import { getCurrentUser } from "@/lib/auth"
import dbConnect from "@/lib/database"
import Loan from "@/models/Loan"
import { toPlainObject } from "@/lib/serialization"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, AlertCircle } from "lucide-react"
import Link from "next/link"
import LoanComponent from "@/components/loans/LoanComponent"

async function getUserLoans(userId: string) {
  await dbConnect()
  const loans = await Loan.find({ userId }).sort({ appliedDate: -1 })
  return loans.map(loan => toPlainObject(loan))
}

export default async function LoansPage() {
  const userDoc = await getCurrentUser()
  if (!userDoc) {
    return <div>Unauthorized</div>
  }

  const user = toPlainObject(userDoc)
  const loans = await getUserLoans(user._id.toString())

  const activeLoans = loans.filter((loan: any) => ['active', 'approved'].includes(loan.status))
  const pendingLoans = loans.filter((loan: any) => loan.status === 'pending')
  const completedLoans = loans.filter((loan: any) => ['completed', 'defaulted'].includes(loan.status))

  return (
    <div className="container mx-auto p-6 pt-[60px] bg-gradient-to-br from-green-50 to-white w-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Loans</h1>
          <p className="text-muted-foreground">Manage your loan applications and active loans</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/loans/apply">
            <Plus className="mr-2 h-4 w-4" />
            Apply for Loan
          </Link>
        </Button>
      </div>

      {loans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No loans yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              You haven't applied for any loans yet. Apply for your first loan to get started.
            </p>
            <Button asChild>
              <Link href="/dashboard/loans/apply">
                Apply for Your First Loan
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Pending Applications */}
          {pendingLoans.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Pending Applications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingLoans.map((loan: any) => (
                  <div key={loan._id}>
                    <LoanComponent loan={loan} />
                    <div className="mt-2 flex items-center space-x-2 text-yellow-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>Under review</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Loans */}
          {activeLoans.length > 0 && (
            <div className="flex items-center justify-center flex-col">
              <h2 className="text-2xl font-bold mb-4">Active Loans</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeLoans.map((loan: any) => (
                  <LoanComponent key={loan._id} loan={loan} showDetails={true} />
                ))}
              </div>
            </div>
          )}

          {/* Loan History */}
          {completedLoans.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Loan History</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedLoans.map((loan: any) => (
                  <LoanComponent key={loan._id} loan={loan} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
