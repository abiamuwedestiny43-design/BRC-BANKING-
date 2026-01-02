import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import { formatCurrency } from "@/lib/utils/banking"
import UserActions from "@/components/admin/user-actions"

async function getUsers(searchQuery?: string) {
  await dbConnect()

  let query = {}
  if (searchQuery) {
    query = {
      $or: [
        { email: { $regex: searchQuery, $options: "i" } },
        { "bankInfo.bio.firstname": { $regex: searchQuery, $options: "i" } },
        { "bankInfo.bio.lastname": { $regex: searchQuery, $options: "i" } },
        { bankNumber: { $regex: searchQuery, $options: "i" } },
      ],
    }
  }

  const users = await User.find(query)
    .select("email bankInfo bankBalance bankNumber bankAccount roles registerTime")
    .sort({ registerTime: -1 })
    .limit(100)

  return users.map((user) => ({
    id: user._id.toString(),
    email: user.email,
    name: `${user.bankInfo.bio.firstname} ${user.bankInfo.bio.lastname}`,
    bankNumber: user.bankNumber,
    balance: user.bankBalance.get("USD") || 0,
    currency: user.bankInfo.system.currency,
    verified: user.bankAccount.verified,
    canTransfer: user.bankAccount.canTransfer,
    roles: user.roles,
    registerTime: user.registerTime,
  }))
}

export default async function UsersPage({ searchParams }: { searchParams: { search?: string } }) {
  return (
    <div className="p-6 space-y-6 animate-slide-up pt-[60px]">
      {/* Header */}
      <div className="md:flex flex gap-8 flex-col items-center justify-between animate-slide-up animation-delay-100">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/create">
            <Plus className="mr-2 h-4 w-4" />
            Create User
          </Link>
        </Button>
      </div>

      {/* Search Card */}
      <Card className="animate-slide-up animation-delay-200">
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
          <CardDescription>Find users by name, email, or account number</CardDescription>
        </CardHeader>
        <CardContent>
          <form method="GET" className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="search"
                placeholder="Search by name, email, or account number..."
                defaultValue={searchParams.search}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
            {searchParams.search && (
              <Button variant="outline" asChild>
                <Link href="/admin/users">Clear</Link>
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Suspense fallback={<div>Loading users...</div>}>
        <UsersTable searchQuery={searchParams.search} />
      </Suspense>
    </div>
  )
}

async function UsersTable({ searchQuery }: { searchQuery?: string }) {
  const users = await getUsers(searchQuery)

  return (
    <Card className="animate-slide-up animation-delay-300">
      <CardHeader>
        <CardTitle>{searchQuery ? `Search Results (${users.length})` : "All Users"}</CardTitle>
        <CardDescription>
          {searchQuery ? `Results for "${searchQuery}"` : "Complete list of registered users"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Account Number</th>
                <th className="text-left p-2">Balance</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, i) => (
                  <tr
                    key={user.id}
                    className={`border-b hover:bg-muted/50 animate-fade-in-up animation-delay-${i * 50}`}
                  >
                    <td className="p-2">
                      <div>
                        <Link href={`/admin/users/${user.id}`} className="font-medium hover:underline">
                          {user.name}
                        </Link>
                        <div className="flex gap-1 mt-1">
                          {user.roles.map((role) => (
                            <Badge key={role} variant="secondary" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-sm">{user.email}</td>
                    <td className="p-2 text-sm font-mono">{user.bankNumber}</td>
                    <td className="p-2 text-sm">{formatCurrency(user.balance, user.currency)}</td>
                    <td className="p-2">
                      <div className="flex flex-col gap-1">
                        <Badge variant={user.verified ? "default" : "destructive"} className="text-xs">
                          {user.verified ? "Verified" : "Unverified"}
                        </Badge>
                        <Badge variant={user.canTransfer ? "default" : "secondary"} className="text-xs">
                          {user.canTransfer ? "Can Transfer" : "Transfer Blocked"}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-2 relative">
                      <UserActions userId={user.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground animate-fade-in-up">
                    {searchQuery ? "No users found matching your search." : "No users found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
