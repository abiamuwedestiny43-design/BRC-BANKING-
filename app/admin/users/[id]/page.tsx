import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, User as UserIcon, ShieldCheck, Activity, Globe, CreditCard, Mail, Phone, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import Transfer from "@/models/Transfer"
import { formatCurrency } from "@/lib/utils/banking"
import { Separator } from "@/components/ui/separator"
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
    userCode: user.usercode,
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
    canLocalTransfer: user.bankAccount.canLocalTransfer,
    canInternationalTransfer: user.bankAccount.canInternationalTransfer,
    profileImage: user.profileImage,
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
    <div className="p-4 md:p-10 space-y-10 relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-50">
        <div className="flex items-center gap-6">
          <Button variant="ghost" asChild className="h-14 w-14 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-all p-0">
            <Link href="/admin/users">
              <ArrowLeft className="h-6 w-6" />
            </Link>
          </Button>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
              <UserIcon className="w-3 h-3" /> User Profile
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              Identity <span className="text-slate-500 italic">Details</span>
            </h1>
          </div>
        </div>

        <div className="flex gap-4">
          <Button asChild className="h-12 px-8 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-all">
            <Link href={`/admin/users/${params.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Details
            </Link>
          </Button>
          <UserActions userId={params.id} />
        </div>
      </div>

      <Suspense fallback={<div className="text-emerald-500 font-black animate-pulse">LOADING USER DATA...</div>}>
        <UserDetailsContent userId={params.id} />
      </Suspense>
    </div>
  )
}

async function UserDetailsContent({ userId }: { userId: string }) {
  const user = await getUserDetails(userId)
  if (!user) notFound()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
      {/* Primary Data Hub */}
      <div className="lg:col-span-2 space-y-10">
        <Card className="bg-white/[0.03] border-white/5 rounded-[3rem] overflow-hidden">
          <CardHeader className="p-10 border-b border-white/5 bg-white/[0.01]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-4xl font-black overflow-hidden">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user.name[0]
                  )}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight">{user.name}</h2>
                  <div className="flex gap-2 mt-2">
                    {user.roles.map((role) => (
                      <Badge key={role} className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Date Joined</p>
                <p className="text-white font-black">{new Date(user.registerTime).toLocaleDateString()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <h3 className="text-sm font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">Account Details</h3>
                {[
                  { label: "Email Address", value: user.email, icon: Mail },
                  { label: "Account Number", value: user.bankNumber, icon: CreditCard, mono: true },
                  { label: "User Code", value: user.userCode, icon: ShieldCheck, mono: true },
                  { label: "Currency", value: user.currency, icon: Globe },
                ].map((item, i) => (
                  <div key={i} className="group">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <item.icon className="w-3 h-3" /> {item.label}
                    </p>
                    <p className={`text-sm font-bold text-white ${item.mono ? 'font-mono tracking-widest text-emerald-500' : ''}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-8">
                <h3 className="text-sm font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Contact Information</h3>
                {[
                  { label: "Phone Number", value: user.phone, icon: Phone },
                  { label: "Address", value: `${user.address}, ${user.city}, ${user.state} ${user.zipcode}, ${user.country}`, icon: MapPin },
                ].map((item, i) => (
                  <div key={i} className="group">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <item.icon className="w-3 h-3" /> {item.label}
                    </p>
                    <p className="text-sm font-bold text-white leading-relaxed">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History Log */}
        <Card className="bg-white/[0.03] border-white/5 rounded-[3rem] overflow-hidden">
          <CardHeader className="p-10 border-b border-white/5 bg-white/[0.01]">
            <CardTitle className="text-2xl font-black text-white italic tracking-tight flex items-center gap-3">
              <Activity className="w-6 h-6 text-blue-400" /> Recent Activity
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">Last 10 transactions required for this user.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {user.transfers.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/20 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                    <th className="px-10 py-4">Status</th>
                    <th className="px-10 py-4">Reference</th>
                    <th className="px-10 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {user.transfers.map((transfer) => (
                    <tr key={transfer.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-10 py-4">
                        <Badge className={`uppercase text-[9px] font-black px-2 py-0.5 rounded-lg ${transfer.txStatus === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20Shadow' : 'bg-red-500/10 text-red-500 border-red-500/20Shadow'}`}>
                          {transfer.txStatus}
                        </Badge>
                      </td>
                      <td className="px-10 py-4">
                        <p className="text-xs font-bold text-white uppercase tracking-tight">{transfer.txReason}</p>
                        <p className="text-[10px] font-mono text-slate-500 tracking-tighter">REF_{transfer.txRef}</p>
                      </td>
                      <td className="px-10 py-4 text-right">
                        <p className="text-sm font-black text-white">{formatCurrency(transfer.amount, transfer.currency)}</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">{new Date(transfer.createdAt).toLocaleDateString()}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto opacity-20">
                  <Activity className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-slate-500 font-medium italic">No recent activity found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Side Integrity Panel */}
      <div className="space-y-8">
        <Card className="bg-gradient-to-br from-[#003d24] to-[#001c10] border-emerald-500/20 rounded-[2.5rem] p-10 overflow-hidden relative shadow-3xl">
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[100px]"></div>
          <div className="relative z-10 space-y-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Total Balance</p>
              <p className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                {formatCurrency(user.balance, user.currency)}
              </p>
            </div>

            <Separator className="bg-white/5" />

            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Account Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                  <span className="text-xs font-black text-white uppercase tracking-widest">Verified</span>
                  <Badge className={user.verified ? "bg-emerald-500 text-black font-black" : "bg-red-500 text-white font-black"}>
                    {user.verified ? "YES" : "NO"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                  <span className="text-xs font-black text-white uppercase tracking-widest">Transfer Access</span>
                  <Badge className={user.canTransfer ? "bg-blue-500 text-white font-black" : "bg-slate-700 text-slate-400 font-black"}>
                    {user.canTransfer ? "ENABLED" : "RESTRICTED"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                  <span className="text-xs font-black text-white uppercase tracking-widest">Local Transfer</span>
                  <Badge className={user.canLocalTransfer ? "bg-emerald-500 text-black font-black" : "bg-slate-700 text-slate-400 font-black"}>
                    {user.canLocalTransfer ? "ALLOWED" : "LOCKED"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                  <span className="text-xs font-black text-white uppercase tracking-widest">Intl Transfer</span>
                  <Badge className={user.canInternationalTransfer ? "bg-emerald-500 text-black font-black" : "bg-slate-700 text-slate-400 font-black"}>
                    {user.canInternationalTransfer ? "ALLOWED" : "LOCKED"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-white/5">
              <div className="flex items-center gap-3 text-emerald-500/50">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Customer Since {new Date(user.registerTime).getFullYear()}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* System Advisory */}
        <Card className="bg-white/[0.03] border-white/5 rounded-[2.5rem] p-8 space-y-4 relative">
          <h3 className="text-sm font-black text-white italic tracking-tight">System Status</h3>
          <p className="text-xs text-slate-500 leading-relaxed italic border-l-2 border-emerald-500/30 pl-4">
            "Account status is normal. All logins originated from verified locations."
          </p>
        </Card>
      </div>
    </div>
  )
}
