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
        <div className="min-h-screen bg-[#001c10] w-full p-4 md:p-8 lg:p-12 pt-24 md:pt-32 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto space-y-10 relative z-10">

                {/* Header Section */}
                <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-widest text-[10px] mb-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 w-fit rounded-full">
                            <Landmark className="h-3 w-3" />
                            Credit Systems
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                            My <span className="text-slate-500 italic">Loans</span>
                        </h1>
                        <p className="text-slate-400 font-medium">Manage your active loans and pending requests.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button asChild variant="ghost" className="h-12 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-bold text-white flex items-center gap-2 transition-all">
                            <Link href="/dashboard" className="flex items-center gap-2">
                                <ChevronLeft className="h-4 w-4" />
                                Dashboard
                            </Link>
                        </Button>
                        <Button asChild className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-[#001c10] rounded-xl shadow-xl shadow-emerald-500/20 font-black transition-all hover:-translate-y-1">
                            <Link href="/dashboard/loans/apply" className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Apply for Loan
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Status Overview cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Active Loans", val: activeLoans.length, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                        { label: "Pending Requests", val: pendingLoans.length, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
                        { label: "Loan History", val: completedLoans.length, icon: CheckCircle2, color: "text-slate-400", bg: "bg-white/5 border-white/10" },
                    ].map((item, i) => (
                        <motion.div key={i} {...fadeInUp} transition={{ delay: 0.1 * i }}>
                            <Card className="border border-white/5 shadow-2xl bg-white/[0.03] backdrop-blur-md p-8 rounded-[2rem] relative overflow-hidden group hover:bg-emerald-500/5 transition-all duration-500">
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">{item.label}</p>
                                        <h3 className="text-4xl font-black text-white">{item.val}</h3>
                                    </div>
                                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 border shadow-lg", item.bg, item.color)}>
                                        <item.icon className="h-7 w-7" />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {loans.length === 0 ? (
                    <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
                        <Card className="border-white/5 bg-white/[0.03] backdrop-blur-md rounded-[3rem] overflow-hidden">
                            <CardContent className="flex flex-col items-center justify-center py-24 text-center space-y-8">
                                <div className="h-24 w-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center shadow-inner text-slate-700">
                                    <FileText className="h-12 w-12" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-white lowercase">No loans <span className="text-slate-500 italic">found</span></h3>
                                    <p className="text-slate-500 font-medium max-w-sm mx-auto">Apply for a new loan to access funding for your needs.</p>
                                </div>
                                <Button asChild className="h-16 px-10 bg-emerald-500 hover:bg-emerald-400 text-[#001c10] rounded-2xl shadow-xl shadow-emerald-500/20 font-black text-lg transition-transform hover:scale-105">
                                    <Link href="/dashboard/loans/apply">Apply Now</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <div className="space-y-16">
                        {/* Pending Section */}
                        {pendingLoans.length > 0 && (
                            <motion.div {...fadeInUp} className="space-y-8">
                                <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-widest">
                                    <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                                    Pending Approval
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
                                            <div className="absolute top-6 right-6 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter backdrop-blur-md">
                                                Under Review
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Active Section */}
                        {activeLoans.length > 0 && (
                            <motion.div {...fadeInUp} className="space-y-8">
                                <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-widest">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    Active Loans
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {activeLoans.map((loan, idx) => (
                                        <motion.div
                                            key={loan._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * idx }}
                                            className="hover:scale-[1.02] transition-all duration-500"
                                        >
                                            <LoanComponent loan={loan} showDetails={true} />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* History Section */}
                        {completedLoans.length > 0 && (
                            <motion.div {...fadeInUp} className="space-y-8 opacity-60">
                                <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.4em]">Loan History</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {completedLoans.map((loan, idx) => (
                                        <div key={loan._id} className="grayscale hover:grayscale-0 transition-all duration-500">
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
