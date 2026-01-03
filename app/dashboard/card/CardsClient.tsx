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
        <div className="min-h-screen bg-[#f8fafc] w-full p-4 md:p-8 lg:p-12 pt-24 md:pt-32">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header Section */}
                <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-green-600 font-black uppercase tracking-widest text-xs mb-2">
                            <CreditCard className="h-4 w-4" />
                            Card Center
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">My Cards</h1>
                        <p className="text-slate-500 text-lg font-medium">Manage your digital and physical payment methods.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button asChild className="h-12 px-6 bg-slate-900 hover:bg-black text-white rounded-xl shadow-xl shadow-slate-200 font-bold">
                            <Link href="/dashboard" className="flex items-center gap-2">
                                <ChevronLeft className="h-4 w-4" />
                                Dashboard
                            </Link>
                        </Button>
                        <Button asChild className="h-12 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-xl shadow-green-200 font-bold">
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
                        <UICard className="border-none shadow-xl shadow-slate-100 bg-white/80 backdrop-blur-md p-6 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 uppercase">Secure PIN</p>
                                    <p className="text-xs text-slate-500 font-bold">Encrypted processing</p>
                                </div>
                            </div>
                        </UICard>
                    </motion.div>
                    <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                        <UICard className="border-none shadow-xl shadow-slate-100 bg-white/80 backdrop-blur-md p-6 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 uppercase">Instant Issue</p>
                                    <p className="text-xs text-slate-500 font-bold">Zero wait time</p>
                                </div>
                            </div>
                        </UICard>
                    </motion.div>
                    <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
                        <UICard className="border-none shadow-xl shadow-slate-100 bg-white/80 backdrop-blur-md p-6 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                                    <Globe className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 uppercase">Global Use</p>
                                    <p className="text-xs text-slate-500 font-bold">Worldwide coverage</p>
                                </div>
                            </div>
                        </UICard>
                    </motion.div>
                </div>

                {/* Cards Grid */}
                {activeCards.length === 0 ? (
                    <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
                        <UICard className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden">
                            <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                                <div className="h-24 w-24 bg-slate-50 rounded-[2rem] flex items-center justify-center shadow-inner text-slate-300">
                                    <CreditCard className="h-12 w-12" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900">No active cards fond</h3>
                                    <p className="text-slate-500 font-medium max-w-sm mx-auto">Apply for a premium virtual or physical card to start making secure transactions today.</p>
                                </div>
                                <Button asChild className="h-14 px-10 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-xl shadow-green-100 font-black text-lg transition-transform hover:scale-105">
                                    <Link href="/dashboard/card/apply">Register Your First Card</Link>
                                </Button>
                            </CardContent>
                        </UICard>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {activeCards.map((card: any, idx: number) => (
                            <motion.div
                                key={card._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * idx, duration: 0.5 }}
                                className="group"
                            >
                                <div className="relative">
                                    <CardComponent card={card} showDetails={true} />
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className={cn(
                                            "text-[8px] font-black uppercase px-3 py-1 rounded-full shadow-sm border",
                                            card.status === 'active' ? 'bg-green-500 text-white border-green-400' : 'bg-yellow-500 text-white border-yellow-400'
                                        )}>
                                            {card.status}
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
