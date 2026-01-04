"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Bell,
  CheckCheck,
  Clock,
  ArrowRight,
  Inbox,
  ChevronLeft,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Info,
  MailOpen,
  Mail
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function NotificationsPage() {
  const { toast } = useToast()
  const { data, mutate, isLoading } = useSWR("/api/user/notifications", fetcher)

  const notifications = data?.notifications || []
  const unreadCount = notifications.filter((n: any) => !n.viewed).length

  const markAllRead = async () => {
    const res = await fetch("/api/user/notifications", { method: "PATCH" })
    if (res.ok) {
      toast({
        title: "All Caught Up!",
        description: "All notifications marked as read.",
        className: "bg-green-600 border-none text-white font-bold"
      })
      mutate()
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

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">

        {/* Header Section */}
        <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-widest text-[10px] mb-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 w-fit rounded-full mx-auto md:mx-0">
              <Bell className="h-3 w-3" />
              Event Stream
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter lowercase">
              Activity <span className="text-slate-500 italic">Relays</span>
            </h1>
            <p className="text-slate-400 font-medium">Monitor your system logs and institutional transmissions.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="h-12 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-bold text-white flex items-center gap-2 transition-all">
              <Link href="/dashboard" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Terminal
              </Link>
            </Button>
            {unreadCount > 0 && (
              <Button
                onClick={markAllRead}
                className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-[#001c10] rounded-xl shadow-xl shadow-emerald-500/20 font-black flex items-center gap-2 transition-all hover:-translate-y-1"
              >
                <CheckCheck className="h-4 w-4" />
                Flush Stream
              </Button>
            )}
          </div>
        </motion.div>

        {/* Notifications List Area */}
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-black text-white lowercase tracking-tight flex items-center gap-3">
              Institutional <span className="text-slate-500 italic">Logs</span>
              <span className="text-[10px] font-black bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">{unreadCount} Pending</span>
            </h2>
          </div>

          <Card className="border border-white/5 shadow-2xl bg-white/[0.03] backdrop-blur-md overflow-hidden rounded-[3rem]">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="py-24 text-center space-y-6">
                  <div className="relative h-20 w-20 mx-auto">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-[2rem] animate-ping"></div>
                    <div className="relative h-20 w-20 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center text-emerald-500">
                      <Clock className="h-8 w-8 animate-spin-slow" />
                    </div>
                  </div>
                  <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] animate-pulse">Syncing Relays...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-32 text-center space-y-6">
                  <div className="h-24 w-24 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-800 shadow-inner group">
                    <Inbox className="h-12 w-12 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white lowercase tracking-tighter">Stream is <span className="text-slate-500">Silent</span></h3>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">No institutional transmissions detected in the current sector.</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  <AnimatePresence>
                    {notifications.map((n: any, idx: number) => {
                      const isDebit = n.message.toLowerCase().includes("debited")
                      const isCredit = n.message.toLowerCase().includes("credited")

                      return (
                        <motion.div
                          key={n._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={cn(
                            "p-8 md:p-10 flex items-start gap-8 transition-all hover:bg-white/[0.02] relative group",
                            !n.viewed && "bg-emerald-500/[0.03]"
                          )}
                        >
                          {/* Unread Indicator Vertical Bar */}
                          {!n.viewed && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-emerald-500 rounded-r-full shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
                          )}

                          <div className={cn(
                            "h-16 w-16 rounded-[1.5rem] border flex items-center justify-center shrink-0 shadow-2xl transition-all duration-500 group-hover:scale-105",
                            isDebit ? "bg-red-500/10 border-red-500/20 text-red-500" :
                              isCredit ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                                "bg-blue-500/10 border-blue-500/20 text-blue-500"
                          )}>
                            {n.viewed ? (
                              <MailOpen className="h-7 w-7 opacity-50" />
                            ) : (
                              <Mail className="h-7 w-7" />
                            )}
                          </div>

                          <div className="flex-1 space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span className={cn(
                                  "text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border shadow-sm",
                                  isDebit ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                    isCredit ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                      "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                )}>
                                  {isDebit ? "Egress Alert" : isCredit ? "Ingress Alert" : "Log Entry"}
                                </span>
                                {!n.viewed && (
                                  <div className="h-2 w-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgb(16,185,129)] animate-pulse" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                <Clock className="h-3 w-3" />
                                {new Date(n.period).toLocaleString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>

                            <div className="relative">
                              <p className="text-white font-bold text-lg leading-relaxed lowercase tracking-tight max-w-2xl">
                                {n.message}
                              </p>
                              <div className="absolute -bottom-1 right-0 opacity-10 blur-xl bg-emerald-500 h-8 w-32 group-hover:opacity-20 transition-opacity"></div>
                            </div>

                            {n.redirect && (
                              <Link
                                href={n.redirect}
                                className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-[0.2em] pt-2 group/link"
                              >
                                Access Source
                                <ArrowRight className="h-3 w-3 group-hover/link:translate-x-1.5 transition-transform" />
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
