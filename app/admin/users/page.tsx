import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Users, ShieldCheck, Mail, CreditCard, ChevronRight } from "lucide-react"
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
    .select("email bankInfo bankBalance bankNumber bankAccount roles registerTime profileImage")
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
    profileImage: user.profileImage,
    roles: user.roles,
    registerTime: user.registerTime,
  }))
}

export default async function UsersPage({ searchParams }: { searchParams: { search?: string } }) {
  return (
    <div className="p-4 md:p-10 space-y-10 relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
            <Users className="w-3 h-3" /> User Management
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            User <span className="text-slate-500 italic">Management</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-md">Manage and view the global PRIMEHARBOR BANK user base.</p>
        </div>

        <Button asChild className="bg-emerald-500 hover:bg-emerald-400 text-[#001c10] font-black h-12 px-8 rounded-xl shadow-xl shadow-emerald-500/20">
          <Link href="/admin/users/create">
            <Plus className="mr-2 h-5 w-5" />
            Create New Account
          </Link>
        </Button>
      </div>

      {/* Search Card */}
      <Card className="bg-white/[0.03] border-white/5 rounded-[2.5rem] p-8 relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <form method="GET" className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500/50" />
            <Input
              name="search"
              placeholder="Search by name, email, or account number..."
              defaultValue={searchParams.search}
              className="pl-12 bg-white/5 border-white/10 rounded-2xl h-14 text-white focus:border-emerald-500 transition-all font-medium"
            />
          </div>
          <Button type="submit" className="h-14 px-10 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10">
            Execute Search
          </Button>
          {searchParams.search && (
            <Button variant="ghost" asChild className="h-14 px-6 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 font-bold">
              <Link href="/admin/users">Reset</Link>
            </Button>
          )}
        </form>
      </Card>

      {/* Users Table */}
      <Suspense fallback={<div className="text-emerald-500 font-black animate-pulse">LOADING USERS...</div>}>
        <UsersTable searchQuery={searchParams.search} />
      </Suspense>
    </div>
  )
}

async function UsersTable({ searchQuery }: { searchQuery?: string }) {
  const users = await getUsers(searchQuery)

  return (
    <Card className="bg-white/[0.03] border-white/5 rounded-[3rem] overflow-hidden relative z-10">
      <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-black text-white italic tracking-tight">
              {searchQuery ? `Query Results (${users.length})` : "User Directory"}
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              {searchQuery ? `Filtering for "${searchQuery}"` : "Global register of PrimeHarbor Bank users."}
            </CardDescription>
          </div>
          <div className="hidden md:flex gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Users</p>
              <p className="text-lg font-black text-white">{users.length}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/20 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <th className="px-8 py-6">User</th>
                <th className="px-8 py-6">Account Details</th>
                <th className="px-8 py-6">Balance</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.length > 0 ? (
                users.map((user, i) => (
                  <tr
                    key={user.id}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-lg overflow-hidden">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            user.name[0]
                          )}
                        </div>
                        <div>
                          <Link href={`/admin/users/${user.id}`} className="block text-sm font-black text-white hover:text-emerald-400 transition-colors uppercase tracking-tight">
                            {user.name}
                          </Link>
                          <div className="flex gap-2 mt-1">
                            {user.roles.map((role) => (
                              <Badge key={role} className="bg-white/5 border-white/5 text-[9px] font-black uppercase tracking-tighter text-slate-500 px-1.5 py-0 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-colors">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                          <Mail className="w-3 h-3 text-slate-500" /> {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          <CreditCard className="w-3 h-3" /> {user.bankNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-lg font-black text-white tracking-tighter">
                        {formatCurrency(user.balance, user.currency)}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${user.verified ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${user.verified ? 'text-emerald-500' : 'text-red-500'}`}>
                            {user.verified ? "Verified" : "Unverified"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${user.canTransfer ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-700'}`}></div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${user.canTransfer ? 'text-blue-500' : 'text-slate-500'}`}>
                            {user.canTransfer ? "Active" : "Locked"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end">
                        <UserActions userId={user.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-500 italic font-medium">
                    {searchQuery ? `No users matching "${searchQuery}" found.` : "No users have been created yet."}
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
