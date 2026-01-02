import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import Transfer from "@/models/Transfer"
import { formatCurrency } from "@/lib/utils/banking"
import UserActions from "@/components/admin/user-actions"

async function getUserDetails(id: string) {
  await dbConnect()
  const user = await User.findById(id)
  if (!user) return null

  const transfers = await Transfer.find({
    $or: [{ bankAccount: user.bankNumber }, { senderAccount: user.bankNumber }],
  })
    .sort({ createdAt: -1 })
    .limit(10)

  return {
    id: user._id.toString(),
    email: user.email,
    name: `${user.bankInfo.bio.firstname} ${user.bankInfo.bio.lastname}`,
    bankNumber: user.bankNumber,
    userCode: user.userCode,
    phone: user.bankInfo.bio.phone,
    address: user.bankInfo.bio.address,
    city: user.bankInfo.bio.city,
    state: user.bankInfo.bio.state,
    country: user.bankInfo.bio.country,
    zipcode: user.bankInfo.bio.zipcode,
    currency: user.bankInfo.system.currency,
    balance: user.bankBalance.get(user.bankInfo.system.currency) || 0,
    verified: user.bankAccount.verified,
    canTransfer: user.bankAccount.canTransfer,
    roles: user.roles,
    registerTime: user.registerTime,
    transfers: transfers.map((t) => ({
      id: t._id.toString(),
      amount: t.amount,
      currency: t.currency,
      txRef: t.txRef,
      txReason: t.txReason,
      txStatus: t.txStatus,
      createdAt: t.createdAt,
    })),
  }
}

export default async function UserDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-4 sm:p-6 space-y-6 pt-[60px] w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">User Details</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View and manage user information
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading user details...</div>}>
        <UserDetailsContent userId={params.id} />
      </Suspense>
    </div>
  )
}

async function UserDetailsContent({ userId }: { userId: string }) {
  const user = await getUserDetails(userId)
  if (!user) notFound()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {/* User Information */}
      <div className="md:col-span-2 space-y-6">
        <Card className="w-full">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Personal Information</CardTitle>
              <CardDescription>User account details and contact information</CardDescription>
            </div>
            <div className="flex items-center justify-center w-full flex-wrap gap-10">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/users/${userId}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <UserActions userId={userId} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["Full Name", user.name],
                ["Email", user.email],
                ["Phone", user.phone],
                ["Account Number", user.bankNumber],
                ["User Code", user.userCode],
                ["Currency", user.currency],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-sm font-medium text-muted-foreground">{label}</p>
                  <p className="text-sm break-all">{value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p className="text-sm break-words">
                {user.address}, {user.city}, {user.state} {user.zipcode}, {user.country}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Roles</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.roles.map((role) => (
                  <Badge key={role} variant="secondary" className="text-xs">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Registration Date</p>
              <p className="text-sm">{new Date(user.registerTime).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Transactions</CardTitle>
            <CardDescription>Last 10 transactions for this user</CardDescription>
          </CardHeader>
          <CardContent>
            {user.transfers.length > 0 ? (
              <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
                {user.transfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg gap-2"
                  >
                    <div className="w-full sm:w-2/3">
                      <p className="font-medium text-sm sm:text-base">{transfer.txReason}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Ref: {transfer.txRef}
                      </p>
                    </div>
                    <div className="text-right w-full sm:w-auto">
                      <p className="font-medium text-sm sm:text-base">
                        {formatCurrency(transfer.amount, transfer.currency)}
                      </p>
                      <Badge
                        variant={
                          transfer.txStatus === "success" ? "default" : "destructive"
                        }
                        className="text-xs"
                      >
                        {transfer.txStatus}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No transactions found</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Account Status */}
      <div className="space-y-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Account Status</CardTitle>
            <CardDescription>Current account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Balance</p>
              <p className="text-2xl sm:text-3xl font-bold break-words">
                {formatCurrency(user.balance, user.currency)}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Account Verified</span>
                <Badge variant={user.verified ? "default" : "destructive"}>
                  {user.verified ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Can Transfer</span>
                <Badge variant={user.canTransfer ? "default" : "secondary"}>
                  {user.canTransfer ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
