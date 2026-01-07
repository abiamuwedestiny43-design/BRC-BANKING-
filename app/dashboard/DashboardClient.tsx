// app/dashboard/DashboardClient.tsx
"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ArrowUpRight,
    ArrowDownLeft,
    Eye,
    ChevronRight,
    Plus,
    Wallet,
    CreditCard,
    ArrowRightLeft,
    Bell,
    Users,
    ShieldCheck,
    ShieldAlert,
    ArrowRight,
    History,
    Landmark,
    CheckCircle2,
    Clock,
    FileText as Receipt
} from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils/banking"
import CardComponent from "@/components/cards/CardComponent"
import { cn } from "@/lib/utils"
import useSWR from "swr"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface DashboardClientProps {
    user: any
    balance: number
    currency: string
    firstName: string
    bankNumber: string
    recentTransfers: any[]
    activeCards: any[]
    loansSection?: React.ReactNode
}

export default function DashboardClient({
    user,
    balance,
    currency,
    firstName,
    bankNumber,
    recentTransfers,
    activeCards,
    loansSection
}: DashboardClientProps) {

    const { data: notificationData, mutate } = useSWR("/api/user/notifications", fetcher)
    const notifications = notificationData?.notifications || []
    const unreadCount = notifications.filter((n: any) => !n.viewed).length

    const handleMarkAsRead = async () => {
        if (unreadCount > 0) {
            try {
                await fetch("/api/user/notifications", { method: "PATCH" })
                mutate()
            } catch (error) {
                console.error("Failed to mark notifications as read", error)
            }
        }
    }

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    }

    return (
        <div className="min-h-screen bg-[#001c10] w-full p-4 md:p-8 lg:p-12 pt-24 md:pt-32 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto space-y-10 relative z-10">

                {/* Header Section */}
                <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck className="w-3 h-3" /> Secure Banking Session
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                            Hello, <span className="text-slate-500 italic">{firstName}</span> <span className="animate-wave inline-block">👋</span>
                        </h1>
                        <p className="text-slate-400 font-medium">Your financial ecosystem at a glance.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <DropdownMenu onOpenChange={(open) => open && handleMarkAsRead()}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 relative text-white transition-all">
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-3 right-3 h-2.5 w-2.5 bg-emerald-500 border-2 border-[#001c10] rounded-full"></span>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80 p-2 rounded-2xl shadow-2xl border border-white/10 bg-[#002a18]/95 backdrop-blur-md text-white">
                                <DropdownMenuLabel className="flex items-center justify-between p-3 border-b border-white/5">
                                    <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Recent Alerts</span>
                                    {unreadCount > 0 && <span className="bg-emerald-500 text-[#001c10] text-[10px] px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                                </DropdownMenuLabel>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="py-8 text-center text-slate-500 text-sm font-medium">
                                            No recent activity.
                                        </div>
                                    ) : (
                                        notifications.slice(0, 5).map((n: any) => (
                                            <DropdownMenuItem key={n._id} asChild className="p-0 focus:bg-white/5">
                                                <Link href={n.redirect || "/dashboard/notifications"} className="p-3 flex items-start gap-3 rounded-xl transition-colors group">
                                                    <div className={cn(
                                                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner",
                                                        n.message.toLowerCase().includes("debited") ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
                                                    )}>
                                                        {n.viewed ? <CheckCircle2 className="h-5 w-5 opacity-40" /> : <Clock className="h-5 w-5" />}
                                                    </div>
                                                    <div className="space-y-1 overflow-hidden">
                                                        <p className="text-xs font-bold text-slate-200 line-clamp-2 leading-relaxed">
                                                            {n.message}
                                                        </p>
                                                        <p className="text-[10px] text-slate-500 font-medium">
                                                            {new Date(n.period).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </DropdownMenuItem>
                                        ))
                                    )}
                                </div>
                                <DropdownMenuSeparator className="bg-white/5" />
                                <DropdownMenuItem asChild className="focus:bg-transparent p-0">
                                    <Link
                                        href="/dashboard/notifications"
                                        className="w-full py-3 text-center text-xs font-black text-emerald-400 uppercase tracking-widest hover:bg-emerald-500/10 rounded-xl transition-colors"
                                    >
                                        View All Activity
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link href="/dashboard/settings" className="group">
                            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 text-xl font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all overflow-hidden">
                                {user.profileImage ? (
                                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    firstName?.[0]
                                )}
                            </div>
                        </Link>
                    </div>
                </motion.div>

                {/* Global Stats / Balance */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Balance card */}
                    <motion.div {...fadeInUp} className="lg:col-span-2">
                        <Card className="h-full border-white/10 shadow-3xl bg-gradient-to-br from-[#003d24] via-[#002a18] to-[#011a0f] text-white overflow-hidden relative group rounded-[2.5rem]">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Wallet className="h-32 w-32" />
                            </div>
                            <CardHeader className="relative z-10 p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Available Balance</p>
                                            <p className="text-xs text-emerald-500 font-bold">Account Active</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-white/20 hover:text-white hover:bg-white/5 rounded-full">
                                        <Eye className="h-5 w-5" />
                                    </Button>
                                </div>
                                <div>
                                    <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
                                        {formatCurrency(balance, currency)}
                                    </h2>
                                    <div className="flex items-center gap-4">
                                        <div className="px-3 py-1.5 rounded-lg bg-black/20 border border-white/5 flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">AC: {bankNumber}</span>
                                        </div>
                                        <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Status: Verified</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="px-8 pb-8 relative z-10">
                                <div className="flex flex-wrap gap-4 pt-6 border-t border-white/5">
                                    <Button asChild className="bg-emerald-500 hover:bg-emerald-400 text-[#001c10] font-black px-8 h-14 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 text-base">
                                        <Link href="/dashboard/transfer" className="flex items-center gap-2">
                                            <ArrowUpRight className="h-5 w-5" />
                                            Execute Transfer
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white font-black px-8 h-14 rounded-2xl backdrop-blur-sm transition-all text-base">
                                        <Link href="/dashboard/transactions" className="flex items-center gap-2">
                                            <History className="h-5 w-5" />
                                            Transactions
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Quick Status Cards */}
                    <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="grid grid-cols-1 gap-4">
                        <Card className="border-white/5 bg-white/[0.03] hover:bg-white/[0.05] p-6 flex items-center justify-between group transition-all duration-500 rounded-[2rem]">
                            <div className="space-y-1">
                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Identity Status</p>
                                <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">{user.bankAccount?.verified ? "Verified" : "Pending"}</h3>
                                <p className="text[10px] text-slate-600 font-medium">Account status</p>
                            </div>
                            <div className={cn(
                                "h-12 w-12 rounded-xl flex items-center justify-center transition-all shadow-lg",
                                user.bankAccount?.verified ? "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-[#001c10]" : "bg-yellow-500/10 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-[#001c10]"
                            )}>
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                        </Card>

                        <Card className="border-white/5 bg-white/[0.03] hover:bg-white/[0.05] p-6 flex items-center justify-between group transition-all duration-500 rounded-[2rem]">
                            <div className="space-y-1">
                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Transfer Access</p>
                                <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">{user.bankAccount?.canTransfer ? "Enabled" : "Restricted"}</h3>
                                <p className="text-[10px] text-slate-600 font-medium">Secure transfer gateway</p>
                            </div>
                            <div className={cn(
                                "h-12 w-12 rounded-xl flex items-center justify-center transition-all shadow-lg",
                                user.bankAccount?.canTransfer ? "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-[#001c10]" : "bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-[#001c10]"
                            )}>
                                <ArrowUpRight className="h-6 w-6" />
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* My Cards & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Cards Section */}
                    <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="lg:col-span-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                <CreditCard className="h-6 w-6 text-emerald-500" />
                                Asset <span className="text-slate-500 italic">Portfolio</span>
                            </h2>
                            <Button variant="ghost" asChild className="text-emerald-500 font-black hover:bg-emerald-500/10 rounded-xl text-xs uppercase tracking-widest">
                                <Link href="/dashboard/card" className="flex items-center gap-1">
                                    All Cards <ChevronRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {activeCards.length > 0 ? (
                                activeCards.slice(0, 2).map((card: any) => (
                                    <div key={card._id} className="hover:scale-[1.02] transition-transform duration-300">
                                        <CardComponent card={card} showDetails={true} />
                                    </div>
                                ))
                            ) : (
                                <Card className="md:col-span-2 border-2 border-dashed border-white/5 bg-white/[0.02] rounded-[3rem] p-12 flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="h-20 w-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-500">
                                        <Plus className="h-10 w-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-white">Request New Card</h3>
                                        <p className="text-slate-500 max-w-sm font-medium">Apply for virtual or physical cards for global payments.</p>
                                    </div>
                                    <Button asChild className="bg-white text-[#001c10] font-black px-10 h-14 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95">
                                        <Link href="/dashboard/card/apply">Get Your Card</Link>
                                    </Button>
                                </Card>
                            )}
                        </div>
                    </motion.div>

                    {/* Quick Actions Sidebar */}
                    <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="lg:col-span-4 space-y-8">
                        <h2 className="text-2xl font-black text-white">Quick <span className="text-slate-500 italic">Actions</span></h2>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { href: "/dashboard/transfer", label: "Send Money", sub: "Global transfers", icon: ArrowUpRight, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                                { href: "/dashboard/transactions", label: "Transactions", sub: "View history", icon: History, color: "text-blue-400", bg: "bg-blue-500/10" },
                                { href: "/dashboard/loans", label: "Loans", sub: "Apply for credit", icon: Landmark, color: "text-purple-400", bg: "bg-purple-500/10" },
                                { href: "/dashboard/beneficiaries", label: "Beneficiaries", sub: "Manage contacts", icon: Users, color: "text-orange-400", bg: "bg-orange-500/10" },
                            ].map((action, i) => (
                                <Link key={i} href={action.href} className="group">
                                    <Card className="bg-white/[0.03] border-white/5 hover:bg-white/[0.06] p-4 flex items-center gap-4 transition-all group-hover:-translate-y-1 rounded-2xl">
                                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shadow-lg", action.bg, action.color)}>
                                            <action.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight text-xs">{action.label}</p>
                                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{action.sub}</p>
                                        </div>
                                        <ArrowRight className="h-3 w-3 ml-auto text-slate-700 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <motion.div {...fadeInUp}>
                    {loansSection}
                </motion.div>

                {/* Recent Transactions Section */}
                <motion.div {...fadeInUp} transition={{ delay: 0.4 }} className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <History className="h-6 w-6 text-emerald-500" />
                            Activity <span className="text-slate-500 italic">Logs</span>
                        </h2>
                        <Button variant="ghost" asChild className="text-emerald-500 font-black hover:bg-emerald-500/10 rounded-xl text-xs uppercase tracking-widest">
                            <Link href="/dashboard/transactions" className="flex items-center gap-1">
                                Full History <ChevronRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <Card className="bg-white/[0.03] border-white/5 overflow-hidden rounded-[3rem]">
                        <CardContent className="p-0">
                            {recentTransfers.length > 0 ? (
                                <div className="divide-y divide-white/5">
                                    {recentTransfers.map((transfer: any) => (
                                        <Link
                                            key={transfer._id}
                                            href={`/dashboard/receipt/${transfer.txRef}`}
                                            className="p-6 flex items-center justify-between hover:bg-white/[0.04] transition-all group relative"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className={cn(
                                                    "h-12 w-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 duration-500 shadow-xl",
                                                    transfer.txType === "credit" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                                                )}>
                                                    {transfer.txType === "credit" ? <ArrowDownLeft className="h-6 w-6" /> : <ArrowUpRight className="h-6 w-6" />}
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
                                                        {transfer.txType === "credit" ? "Credit" : "Debit"}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-[#001c10] bg-emerald-500 px-2 py-0.5 rounded shadow-sm">{transfer.txRef}</span>
                                                        <span className="text-[10px] text-slate-500 font-medium italic">{new Date(transfer.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={cn(
                                                    "text-xl font-black tracking-tight",
                                                    transfer.txType === "credit" ? "text-emerald-400" : "text-white"
                                                )}>
                                                    {transfer.txType === "credit" ? "+" : "−"}
                                                    {formatCurrency(transfer.amount, transfer.currency || currency)}
                                                </p>
                                                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                                    <div className={cn(
                                                        "h-1.5 w-1.5 rounded-full",
                                                        transfer.status === "success" ? "bg-emerald-500" : "bg-yellow-500"
                                                    )}></div>
                                                    <span className={cn(
                                                        "text-[9px] font-black uppercase tracking-tighter",
                                                        transfer.status === "success" ? "text-emerald-500" : "text-yellow-500"
                                                    )}>{transfer.status}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-24 text-center space-y-4">
                                    <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-700">
                                        <History className="h-12 w-12" />
                                    </div>
                                    <p className="text-slate-500 font-black uppercase tracking-widest text-sm italic">No recent transactions.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
