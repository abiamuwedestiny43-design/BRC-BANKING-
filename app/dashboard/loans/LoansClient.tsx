"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, FileText, ChevronLeft, CreditCard, PieChart, TrendingUp, CheckCircle2, Clock, Landmark } from "lucide-react"
import Link from "next/link"
import LoanComponent from "@/components/loans/LoanComponent"
import { cn } from "@/lib/utils"

interface LoansClientProps {
    loans: any[]
}

export default function LoansClient({ loans }: LoansClientProps) {
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    }

    const activeLoans = loans.filter((loan: any) => ['active', 'approved'].includes(loan.status))
    const pendingLoans = loans.filter((loan: any) => loan.status === 'pending')
    const completedLoans = loans.filter((loan: any) => ['completed', 'defaulted'].includes(loan.status))

    return (
        <div className="min-h-screen bg-[#f8fafc] w-full p-4 md:p-8 lg:p-12 pt-24 md:pt-32">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header Section */}
                <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-green-600 font-black uppercase tracking-widest text-xs mb-2">
                            <Landmark className="h-4 w-4" />
                            Credit & Lending
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">My Loans</h1>
                        <p className="text-slate-500 text-lg font-medium">Manage your active financing and applications.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button asChild className="h-12 px-6 bg-slate-900 hover:bg-black text-white rounded-xl shadow-xl shadow-slate-200 font-bold transition-all hover:-translate-y-1">
                            <Link href="/dashboard" className="flex items-center gap-2">
                                <ChevronLeft className="h-4 w-4" />
                                Dashboard
                            </Link>
                        </Button>
                        <Button asChild className="h-12 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-xl shadow-green-200 font-bold transition-all hover:-translate-y-1">
                            <Link href="/dashboard/loans/apply" className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                New Application
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Status Overview cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Active Balance", val: activeLoans.length, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-100" },
                        { label: "Pending Review", val: pendingLoans.length, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
                        { label: "Total Completed", val: completedLoans.length, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
                    ].map((item, i) => (
                        <motion.div key={i} {...fadeInUp} transition={{ delay: 0.1 * i }}>
                            <Card className="border-none shadow-xl shadow-slate-100 bg-white/80 backdrop-blur-md p-6 rounded-2xl relative overflow-hidden group hover:bg-slate-900 transition-colors duration-500">
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-slate-400 group-hover:text-slate-500 transition-colors tracking-widest">{item.label}</p>
                                        <h3 className="text-3xl font-black text-slate-900 group-hover:text-white transition-colors">{item.val}</h3>
                                    </div>
                                    <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110", item.bg, item.color)}>
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {loans.length === 0 ? (
                    <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
                        <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden">
                            <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                                <div className="h-24 w-24 bg-slate-50 rounded-[2rem] flex items-center justify-center shadow-inner text-slate-300">
                                    <FileText className="h-12 w-12" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900">Zero loan records fond</h3>
                                    <p className="text-slate-500 font-medium max-w-sm mx-auto">Need a financial boost? Apply for a personalized loan with competitive rates and flexible terms.</p>
                                </div>
                                <Button asChild className="h-14 px-10 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-xl shadow-green-100 font-black text-lg transition-transform hover:scale-105">
                                    <Link href="/dashboard/loans/apply">Start New Application</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <div className="space-y-12">
                        {/* Pending Section */}
                        {pendingLoans.length > 0 && (
                            <motion.div {...fadeInUp} className="space-y-6">
                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                                    Pending Applications
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {pendingLoans.map((loan, idx) => (
                                        <motion.div
                                            key={loan._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * idx }}
                                            className="relative"
                                        >
                                            <LoanComponent loan={loan} />
                                            <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                Under Review
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Active Section */}
                        {activeLoans.length > 0 && (
                            <motion.div {...fadeInUp} className="space-y-6">
                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    Active Financing
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {activeLoans.map((loan, idx) => (
                                        <motion.div
                                            key={loan._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * idx }}
                                            className="hover:scale-[1.02] transition-transform duration-300"
                                        >
                                            <LoanComponent loan={loan} showDetails={true} />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* History Section */}
                        {completedLoans.length > 0 && (
                            <motion.div {...fadeInUp} className="space-y-6 opacity-80">
                                <h2 className="text-xl font-bold text-slate-500">Loan Archive</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {completedLoans.map((loan, idx) => (
                                        <div key={loan._id} className="grayscale hover:grayscale-0 transition-all">
                                            <LoanComponent loan={loan} />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
