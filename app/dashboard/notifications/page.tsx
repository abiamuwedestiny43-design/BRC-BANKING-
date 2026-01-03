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
    <div className="min-h-screen bg-[#f8fafc] w-full p-4 md:p-8 lg:p-12 pt-24 md:pt-32">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header Section */}
        <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-green-600 font-black uppercase tracking-widest text-xs mb-2">
              <Bell className="h-4 w-4" />
              Activity Center
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Notifications</h1>
            <p className="text-slate-500 text-lg font-medium">Stay updated with your latest account movements.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild className="h-12 px-6 bg-slate-900 hover:bg-black text-white rounded-xl shadow-xl shadow-slate-200 font-bold transition-all hover:-translate-y-1">
              <Link href="/dashboard" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            {unreadCount > 0 && (
              <Button
                onClick={markAllRead}
                className="h-12 px-6 bg-white hover:bg-slate-50 text-slate-700 border-none shadow-lg shadow-slate-100 rounded-xl font-bold flex items-center gap-2"
              >
                <CheckCheck className="h-4 w-4 text-green-600" />
                Mark all as read
              </Button>
            )}
          </div>
        </motion.div>

        {/* Notifications List Area */}
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              Latest Updates
              <span className="text-xs font-bold bg-green-100 text-green-600 px-3 py-1 rounded-full">{unreadCount} New</span>
            </h2>
          </div>

          <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/90 backdrop-blur-md overflow-hidden rounded-[2.5rem]">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="py-24 text-center space-y-4">
                  <div className="h-20 w-20 bg-slate-50 animate-pulse rounded-[2rem] mx-auto" />
                  <p className="text-slate-400 font-bold animate-pulse">Fetching your activities...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-32 text-center space-y-6">
                  <div className="h-24 w-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200 shadow-inner">
                    <Inbox className="h-12 w-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900">Inbox is empty</h3>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">We'll let you know when something important happens with your account.</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
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
                            "p-6 md:p-8 flex items-start gap-6 transition-all hover:bg-slate-50 border-l-4",
                            n.viewed ? "border-transparent" : "border-green-600 bg-green-50/20"
                          )}
                        >
                          <div className={cn(
                            "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                            isDebit ? "bg-red-100 text-red-600" :
                              isCredit ? "bg-green-100 text-green-600" :
                                "bg-blue-100 text-blue-600"
                          )}>
                            {n.viewed ? (
                              <MailOpen className="h-6 w-6 opacity-40" />
                            ) : (
                              <Mail className="h-6 w-6" />
                            )}
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                                  isDebit ? "bg-red-50 text-red-700" :
                                    isCredit ? "bg-green-50 text-green-700" :
                                      "bg-blue-50 text-blue-700"
                                )}>
                                  {isDebit ? "Debit Alert" : isCredit ? "Credit Alert" : "System Notification"}
                                </span>
                                {!n.viewed && (
                                  <span className="h-2 w-2 bg-green-600 rounded-full animate-pulse" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                <Clock className="h-3 w-3" />
                                {new Date(n.period).toLocaleString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>

                            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                              <p className="text-slate-700 font-bold whitespace-pre-line leading-relaxed">
                                {n.message}
                              </p>
                            </div>

                            {n.redirect && (
                              <Link
                                href={n.redirect}
                                className="inline-flex items-center gap-2 text-xs font-black text-green-600 hover:text-green-700 uppercase tracking-widest pt-1 group"
                              >
                                Details
                                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
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
