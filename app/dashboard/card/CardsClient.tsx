"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card as UICard, CardContent } from "@/components/ui/card"
import { Plus, CreditCard, ChevronLeft, ShieldCheck, Zap, Globe } from "lucide-react"
import Link from "next/link"
import CardComponent from "@/components/cards/CardComponent"
import { cn } from "@/lib/utils"

interface CardsClientProps {
    cards: any[]
}

export default function CardsClient({ cards }: CardsClientProps) {
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    }

    const activeCards = cards.filter((card: any) => card.status === "active" || card.status === "pending")

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
                            <CreditCard className="h-3 w-3" />
                            Secure Payments
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                            My <span className="text-slate-500 italic">Cards</span>
                        </h1>
                        <p className="text-slate-400 font-medium">Manage your cards and payment methods.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button asChild variant="ghost" className="h-12 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-bold text-white flex items-center gap-2 transition-all">
                            <Link href="/dashboard" className="flex items-center gap-2">
                                <ChevronLeft className="h-4 w-4" />
                                Dashboard
                            </Link>
                        </Button>
                        <Button asChild className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-[#001c10] rounded-xl shadow-xl shadow-emerald-500/20 font-black transition-all hover:-translate-y-1">
                            <Link href="/dashboard/card/apply" className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                New Card
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                        <UICard className="border border-white/5 shadow-2xl bg-white/[0.03] backdrop-blur-md p-6 rounded-[2rem] group hover:bg-emerald-500/5 transition-all duration-500">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 shadow-lg transition-transform group-hover:scale-110">
                                    <ShieldCheck className="h-7 w-7" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Encrypted PIN</p>
                                    <p className="text-white font-black text-lg">Secure Core</p>
                                </div>
                            </div>
                        </UICard>
                    </motion.div>
                    <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                        <UICard className="border border-white/5 shadow-2xl bg-white/[0.03] backdrop-blur-md p-6 rounded-[2rem] group hover:bg-blue-500/5 transition-all duration-500">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shadow-lg transition-transform group-hover:scale-110">
                                    <Zap className="h-7 w-7" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Instant Issue</p>
                                    <p className="text-white font-black text-lg">Zero Latency</p>
                                </div>
                            </div>
                        </UICard>
                    </motion.div>
                    <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
                        <UICard className="border border-white/5 shadow-2xl bg-white/[0.03] backdrop-blur-md p-6 rounded-[2rem] group hover:bg-purple-500/5 transition-all duration-500">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 shadow-lg transition-transform group-hover:scale-110">
                                    <Globe className="h-7 w-7" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Global Access</p>
                                    <p className="text-white font-black text-lg">Worldwide</p>
                                </div>
                            </div>
                        </UICard>
                    </motion.div>
                </div>

                {/* Cards Grid */}
                {activeCards.length === 0 ? (
                    <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
                        <UICard className="border-white/5 bg-white/[0.03] backdrop-blur-md rounded-[3rem] overflow-hidden">
                            <CardContent className="flex flex-col items-center justify-center py-24 text-center space-y-8">
                                <div className="h-24 w-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center shadow-inner text-slate-700">
                                    <CreditCard className="h-12 w-12" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-white lowercase">No active cards <span className="text-slate-500 italic">found</span></h3>
                                    <p className="text-slate-500 font-medium max-w-sm mx-auto">Apply for a premium virtual or physical card to enable secure transactions.</p>
                                </div>
                                <Button asChild className="h-16 px-10 bg-emerald-500 hover:bg-emerald-400 text-[#001c10] rounded-2xl shadow-xl shadow-emerald-500/20 font-black text-lg transition-transform hover:scale-105">
                                    <Link href="/dashboard/card/apply">Get Your First Card</Link>
                                </Button>
                            </CardContent>
                        </UICard>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {activeCards.map((card: any, idx: number) => (
                            <motion.div
                                key={card._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * idx, duration: 0.6 }}
                                className="group perspective-1000"
                            >
                                <div className="relative">
                                    <CardComponent card={card} showDetails={true} />
                                    <div className="absolute top-8 right-8 z-20">
                                        <span className={cn(
                                            "text-[8px] font-black uppercase px-4 py-1.5 rounded-full shadow-2xl border backdrop-blur-md tracking-widest",
                                            card.status === 'active'
                                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10'
                                                : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40 shadow-yellow-500/10'
                                        )}>
                                            {card.status} <span className="text-[10px] ml-1">●</span>
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
