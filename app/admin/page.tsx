import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, ArrowLeftRight, DollarSign, Zap, Activity, ShieldCheck, Globe, ArrowUpRight } from "lucide-react"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import Transfer from "@/models/Transfer"
import CardModel from "@/models/Card"
import Link from "next/link"

async function getDashboardStats() {
  await dbConnect()

  const [totalUsers, totalTransfers, totalCards, pendingApprovals] = await Promise.all([
    User.countDocuments(),
    Transfer.countDocuments(),
    CardModel.countDocuments(),
    User.countDocuments({ "bankAccount.verified": false }),
  ])

  return {
    totalUsers,
    totalTransfers,
    totalCards,
    pendingApprovals,
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="p-4 md:p-10 space-y-10 relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" /> System Secured
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            Banking <span className="text-slate-500 italic">Overview</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-md">Overseeing global financial operations and user accounts.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">System Status</p>
            <p className="text-sm font-black text-emerald-400">ONLINE</p>
          </div>
          <div className="h-10 w-[1px] bg-white/5 hidden md:block"></div>
          <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2 text-sm">
            Generate Reports <Activity className="w-4 h-4 text-emerald-500" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {[
          {
            title: "Global Accounts",
            value: stats.totalUsers,
            icon: Users,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            desc: "Active user base",
            link: "/admin/users"
          },
          {
            title: "Total Volume",
            value: stats.totalTransfers,
            icon: ArrowLeftRight,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            desc: "Historical transfers",
            link: "/admin/transactions"
          },
          {
            title: "Issued Assets",
            value: stats.totalCards,
            icon: CreditCard,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            desc: "Total active cards",
            link: "/admin/cards"
          },
          {
            title: "Pending Vetting",
            value: stats.pendingApprovals,
            icon: Zap,
            color: "text-orange-400",
            bg: "bg-orange-500/10",
            desc: "Awaiting approval",
            link: "/admin/users?filter=pending"
          },
        ].map((stat, i) => (
          <Link key={i} href={stat.link}>
            <Card className="bg-white/[0.03] border-white/5 hover:bg-white/[0.05] transition-all duration-300 group cursor-pointer overflow-hidden relative rounded-[2rem]">
              <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform`}></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{stat.title}</CardTitle>
                <div className={`${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500 font-medium">{stat.desc}</p>
                  <ArrowUpRight className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* System Infrastructure */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Quick Access Tools */}
            <Card className="bg-white/[0.03] border-white/5 rounded-[2.5rem] p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <Zap className="w-5 h-5 text-emerald-500" /> Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <Link href="/admin/transfer-codes" className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-sm">Security Codes</p>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Manage COT / IMF / TAC</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </Link>
                <Link href="/admin/settings" className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-sm">System Settings</p>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Edit Global Configuration</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-colors" />
                  </div>
                </Link>
              </div>
            </Card>

            {/* Recent Activity Log */}
            <Card className="bg-white/[0.03] border-white/5 rounded-[2.5rem] p-8">
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <Activity className="w-5 h-5 text-blue-400" /> Recent Activity
              </h3>
              <div className="space-y-4">
                {[
                  { color: "bg-emerald-500Shadow", label: "ADMIN_ACCESS", text: "Admin Access Granted", time: "02m ago" },
                  { color: "bg-blue-500Shadow", label: "TRANSFER", text: "Global Transfer Logged", time: "14m ago" },
                  { color: "bg-orange-500Shadow", label: "USER_KYC", text: "New KYC Submission", time: "28m ago" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 group hover:bg-white/5 transition-all">
                    <div>
                      <p className="text-[8px] font-black text-emerald-500 tracking-widest mb-1">{item.label}</p>
                      <p className="text-xs font-bold text-white">{item.text}</p>
                    </div>
                    <p className="text-[10px] font-black text-slate-500">{item.time}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Global Transaction Map (Simulated visual placeholder) */}
          <Card className="bg-white/[0.03] border-white/5 rounded-[3rem] p-10 h-[300px] relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white mb-2 italic">Global Balance Heatmap</h3>
              <p className="text-slate-500 text-sm font-medium">Monitoring real-time assets across 12 regions.</p>
            </div>
            <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
              <Globe className="w-[500px] h-[500px] absolute -right-24 -bottom-24 text-emerald-500/20" />
            </div>
            <div className="absolute bottom-10 left-10 flex gap-6 z-10">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Users</p>
                <p className="text-2xl font-black text-emerald-400">12/12</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Response Time</p>
                <p className="text-2xl font-black text-blue-400">14MS</p>
              </div>
            </div>
          </Card>
        </div>

        {/* System Integrity & Health */}
        <div className="space-y-8">
          <Card className="bg-gradient-to-br from-[#003d24] to-[#001c10] border-emerald-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[100px]"></div>
            <h3 className="text-xl font-black text-white mb-8 relative z-10 tracking-tight">System Health</h3>
            <div className="space-y-6 relative z-10">
              {[
                { label: "Core Database", status: "Operational", health: 100 },
                { label: "Transfer System", status: "Operational", health: 98 },
                { label: "Auth Services", status: "Operational", health: 100 },
                { label: "Asset Liquidity", status: "Nominal", health: 94 },
              ].map((service, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white font-black uppercase tracking-widest opacity-60">{service.label}</span>
                    <span className="text-emerald-400 font-black">{service.status}</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${service.health}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-white/5 relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Security Advisory</p>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "All systems remain within standard parameters. No unauthorized attempts detected in the last 24h cycle."
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
