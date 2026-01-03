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

    const { data: notificationData } = useSWR("/api/user/notifications", fetcher)
    const notifications = notificationData?.notifications || []
    const unreadCount = notifications.filter((n: any) => !n.viewed).length

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] w-full p-4 md:p-8 lg:p-12 pt-24 md:pt-32">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header Section */}
                <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                            Hello, {firstName} <span className="animate-wave inline-block">👋</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium">Here's a summary of your financial status today.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-none shadow-lg shadow-slate-200 bg-white hover:bg-slate-50 relative">
                                    <Bell className="h-5 w-5 text-slate-600" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-3 right-3 h-2.5 w-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80 p-2 rounded-2xl shadow-2xl border-none bg-white/95 backdrop-blur-md">
                                <DropdownMenuLabel className="flex items-center justify-between p-3">
                                    <span className="font-black text-slate-900 uppercase tracking-widest text-xs">Recent Alerts</span>
                                    {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-100" />
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="py-8 text-center text-slate-400 text-sm font-medium">
                                            No recent activity.
                                        </div>
                                    ) : (
                                        notifications.slice(0, 5).map((n: any) => (
                                            <DropdownMenuItem key={n._id} asChild className="p-0 focus:bg-transparent">
                                                <Link href={n.redirect || "/dashboard/notifications"} className="p-3 flex items-start gap-3 rounded-xl hover:bg-slate-50 transition-colors group">
                                                    <div className={cn(
                                                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner",
                                                        n.message.toLowerCase().includes("debited") ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"
                                                    )}>
                                                        {n.viewed ? <CheckCircle2 className="h-5 w-5 opacity-40" /> : <Clock className="h-5 w-5" />}
                                                    </div>
                                                    <div className="space-y-1 overflow-hidden">
                                                        <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed">
                                                            {n.message}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 font-medium">
                                                            {new Date(n.period).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </DropdownMenuItem>
                                        ))
                                    )}
                                </div>
                                <DropdownMenuSeparator className="bg-slate-100" />
                                <DropdownMenuItem asChild className="focus:bg-transparent p-0">
                                    <Link
                                        href="/dashboard/notifications"
                                        className="w-full py-3 text-center text-xs font-black text-green-600 uppercase tracking-widest hover:bg-green-50 rounded-xl transition-colors"
                                    >
                                        View All Activity
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link href="/dashboard/settings" className="group">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-green-200 group-hover:scale-105 transition-transform">
                                {firstName?.[0]}
                            </div>
                        </Link>
                    </div>
                </motion.div>

                {/* Global Stats / Balance */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Balance card */}
                    <motion.div {...fadeInUp} className="lg:col-span-2">
                        <Card className="h-full border-none shadow-2xl shadow-green-100/50 bg-gradient-to-br from-slate-900 via-slate-800 to-green-900 text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Wallet className="h-40 w-40" />
                            </div>
                            <CardHeader className="relative z-10">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-slate-300 font-medium flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-green-400" />
                                        Available Balance
                                    </CardTitle>
                                    <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/10 rounded-full">
                                        <Eye className="h-5 w-5" />
                                    </Button>
                                </div>
                                <div className="mt-4">
                                    <h2 className="text-5xl md:text-6xl font-black tracking-tighter">
                                        {formatCurrency(balance, currency)}
                                    </h2>
                                    <p className="text-white/40 mt-2 font-mono tracking-widest uppercase text-xs">Account: {bankNumber}</p>
                                </div>
                            </CardHeader>
                            <CardContent className="mt-6 relative z-10">
                                <div className="flex flex-wrap gap-4">
                                    <Button asChild className="bg-green-500 hover:bg-green-400 text-slate-900 font-bold px-6 h-12 rounded-xl shadow-lg shadow-green-500/20 transition-all hover:scale-105">
                                        <Link href="/dashboard/transfer" className="flex items-center gap-2">
                                            <ArrowUpRight className="h-4 w-4" />
                                            Send Money
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" className="border-white/20 hover:bg-white/10 hover:text-white font-bold px-6 h-12 rounded-xl backdrop-blur-sm transition-all">
                                        <Link href="/dashboard/transactions" className="flex items-center gap-2 text-slate-800">
                                            <History className="h-4 w-4" />
                                            History
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Quick Status Cards */}
                    <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="grid grid-cols-1 gap-6">
                        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-md p-6 flex items-center justify-between group hover:bg-green-600 transition-colors duration-500">
                            <div className="space-y-1">
                                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider group-hover:text-green-100">Verification</p>
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-white">{user.bankAccount?.verified ? "Verified" : "Pending"}</h3>
                            </div>
                            <div className={cn(
                                "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors shadow-inner",
                                user.bankAccount?.verified ? "bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white" : "bg-yellow-100 text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white"
                            )}>
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                        </Card>

                        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-md p-6 flex items-center justify-between group hover:bg-green-600 transition-colors duration-500">
                            <div className="space-y-1">
                                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider group-hover:text-green-100">Transfers</p>
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-white">{user.bankAccount?.canTransfer ? "Enabled" : "Restricted"}</h3>
                            </div>
                            <div className={cn(
                                "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors shadow-inner",
                                user.bankAccount?.canTransfer ? "bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white" : "bg-red-100 text-red-600 group-hover:bg-red-500 group-hover:text-white"
                            )}>
                                <ArrowUpRight className="h-6 w-6" />
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* My Cards & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Cards Section */}
                    <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                <CreditCard className="h-6 w-6 text-green-600" />
                                Digital Cards
                            </h2>
                            <Button variant="ghost" asChild className="text-green-600 font-bold hover:bg-green-50 rounded-xl">
                                <Link href="/dashboard/card" className="flex items-center gap-1">
                                    View All <ChevronRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activeCards.length > 0 ? (
                                activeCards.slice(0, 2).map((card: any) => (
                                    <div key={card._id} className="hover:scale-[1.02] transition-transform duration-300">
                                        <CardComponent card={card} showDetails={true} />
                                    </div>
                                ))
                            ) : (
                                <Card className="md:col-span-2 border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-lg text-slate-300">
                                        <Plus className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Apply for your first card</h3>
                                        <p className="text-slate-500 max-w-sm">Get access to virtual and physical cards for international payments and rewards.</p>
                                    </div>
                                    <Button asChild className="bg-slate-900 hover:bg-black text-white px-8 rounded-xl h-12 shadow-xl shadow-slate-200">
                                        <Link href="/dashboard/card/apply">Register New Card</Link>
                                    </Button>
                                </Card>
                            )}
                        </div>
                    </motion.div>

                    {/* Quick Actions Sidebar */}
                    <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="lg:col-span-4 space-y-6">
                        <h2 className="text-2xl font-black text-slate-900">Shortcuts</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { href: "/dashboard/transfer", label: "Send Money", icon: ArrowUpRight, color: "bg-green-500" },
                                { href: "/dashboard/transactions", label: "Statement", icon: History, color: "bg-blue-500" },
                                { href: "/dashboard/loans", label: "Lending", icon: Landmark, color: "bg-emerald-500" },
                                { href: "/dashboard/beneficiaries", label: "Payees", icon: Users, color: "bg-purple-500" },
                            ].map((action, i) => (
                                <Link key={i} href={action.href} className="group">
                                    <Card className="border-none shadow-lg shadow-slate-100 bg-white/80 backdrop-blur-md p-4 flex items-center gap-4 transition-all group-hover:shadow-xl group-hover:bg-white group-hover:-translate-y-1 rounded-2xl">
                                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-white", action.color)}>
                                            <action.icon className="h-5 w-5" />
                                        </div>
                                        <span className="font-bold text-slate-700">{action.label}</span>
                                        <ArrowRight className="h-4 w-4 ml-auto text-slate-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
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
                <motion.div {...fadeInUp} transition={{ delay: 0.4 }} className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <History className="h-6 w-6 text-green-600" />
                            Transactions
                        </h2>
                        <Button variant="ghost" asChild className="text-green-600 font-bold hover:bg-green-50 rounded-xl">
                            <Link href="/dashboard/transactions" className="flex items-center gap-1">
                                History <ChevronRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/90 backdrop-blur-md overflow-hidden rounded-[2rem]">
                        <CardContent className="p-0">
                            {recentTransfers.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {recentTransfers.map((transfer: any) => (
                                        <Link
                                            key={transfer._id}
                                            href={`/dashboard/receipt/${transfer.txRef}`}
                                            className="p-6 flex items-center justify-between hover:bg-slate-50/80 transition-all group border-l-4 border-transparent hover:border-green-500"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className={cn(
                                                    "h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 duration-300",
                                                    transfer.txType === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                                )}>
                                                    {transfer.txType === "credit" ? <ArrowDownLeft className="h-6 w-6" /> : <ArrowUpRight className="h-6 w-6" />}
                                                </div>
                                                <div>
                                                    <p className="text-lg font-extrabold text-slate-900 group-hover:text-green-700 transition-colors">
                                                        {transfer.txType === "credit" ? "Deposit Ref" : "Payment to"}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                                                        <span className="text-xs uppercase tracking-tighter bg-slate-100 px-2 py-0.5 rounded-md font-bold">{transfer.txRef}</span>
                                                        <span className="text-sm">• {new Date(transfer.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={cn(
                                                    "text-xl font-black",
                                                    transfer.txType === "credit" ? "text-green-600" : "text-slate-900"
                                                )}>
                                                    {transfer.txType === "credit" ? "+" : "−"}
                                                    {formatCurrency(transfer.amount, transfer.currency || currency)}
                                                </p>
                                                <div className="flex items-center justify-end gap-1.5 mt-1">
                                                    <div className={cn(
                                                        "h-1.5 w-1.5 rounded-full shadow-sm",
                                                        transfer.status === "success" ? "bg-green-500" : "bg-yellow-500"
                                                    )}></div>
                                                    <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">{transfer.status}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center space-y-3">
                                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                        <History className="h-10 w-10" />
                                    </div>
                                    <p className="text-slate-400 font-bold">No recent transactions found.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
