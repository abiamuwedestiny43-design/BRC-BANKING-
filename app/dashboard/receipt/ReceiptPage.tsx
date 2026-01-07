"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  Building,
  CheckCircle,
  DollarSign,
  Globe,
  Hash,
  User,
  ArrowLeft,
  Download,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card"

interface ReceiptPageProps {
  transfer: {
    txRef: string
    txDate: string
    amount: number
    currency: string
    txCharge: number
    txStatus: string
    bankHolder: string
    bankName: string
    bankAccount: string
    txRegion: string
    txReason?: string
  }
}

export default function ReceiptPage({ transfer }: ReceiptPageProps) {
  const formatCurrency = (value: number, currency = "USD") =>
    new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
      value
    )

  const handleDownload = async () => {
    try {
      const { jsPDF } = await import("jspdf")

      const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" })
      const margin = 20
      const pageWidth = 210
      const pageHeight = 297
      const usableWidth = pageWidth - margin * 2
      let y = 20

      const colors = {
        primary: [0, 28, 16], // Dark Emerald
        secondary: [16, 185, 129], // Emerald
        success: [16, 185, 129],
        text: [15, 23, 42],
        textMuted: [71, 85, 105],
        textLight: [148, 163, 184],
        border: [226, 232, 240],
        accent: [248, 250, 252],
      } as const

      // === HEADER / LOGO ===
      doc.setFillColor(...colors.primary)
      doc.rect(0, 0, pageWidth, 45, "F")

      // Logo Text
      doc.setFont("helvetica", "bold")
      doc.setFontSize(24)
      doc.setTextColor(255, 255, 255)
      doc.text("PRIME", margin, 25)

      doc.setFont("helvetica", "normal")
      doc.setTextColor(16, 185, 129)
      doc.text("HARBOR", margin + 32, 25)

      doc.setFontSize(10)
      doc.setTextColor(16, 185, 129)
      doc.setFont("helvetica", "bold")
      doc.text("SECURE TRANSFER RECEIPT", margin, 32)

      // Receipt Type
      doc.setFontSize(9)
      doc.setTextColor(148, 163, 184)
      doc.setFont("helvetica", "normal")
      doc.text("Official Ledger Entry", pageWidth - margin, 25, { align: "right" })
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("Payment Advice", pageWidth - margin, 32, { align: "right" })

      y = 60

      // === STATUS BANNER ===
      doc.setFillColor(...colors.accent)
      doc.roundedRect(margin, y, usableWidth, 20, 2, 2, "F")

      doc.setFontSize(9)
      doc.setTextColor(...colors.textMuted)
      doc.setFont("helvetica", "bold")
      doc.text("TRANSFER STATUS:", margin + 8, y + 12)

      doc.setTextColor(...colors.success)
      doc.setFontSize(11)
      doc.text("AUTHORIZED & VERIFIED", margin + 55, y + 12)

      doc.setFontSize(9)
      doc.setTextColor(...colors.textMuted)
      doc.setFont("helvetica", "normal")
      doc.text(`Ref: ${transfer.txRef}`, pageWidth - margin - 8, y + 12, { align: "right" })

      y += 35

      // === AMOUNT SECTION ===
      doc.setFontSize(10)
      doc.setTextColor(...colors.textMuted)
      doc.text("Transfer Amount", margin, y)
      y += 8

      doc.setFontSize(32)
      doc.setTextColor(...colors.text)
      doc.setFont("helvetica", "bold")
      doc.text(formatCurrency(transfer.amount, transfer.currency), margin, y + 10)

      doc.setFontSize(10)
      doc.setTextColor(...colors.textMuted)
      doc.setFont("helvetica", "normal")
      doc.text(`Date & Time: ${new Date(transfer.txDate).toLocaleString()}`, pageWidth - margin, y + 8, { align: "right" })

      y += 25

      // === DETAILS TABLE ===
      doc.setDrawColor(...colors.border)
      doc.setLineWidth(0.2)
      doc.line(margin, y, pageWidth - margin, y)
      y += 12

      const addRow = (label: string, value: string, currentY: number) => {
        doc.setFontSize(9)
        doc.setTextColor(...colors.textMuted)
        doc.setFont("helvetica", "normal")
        doc.text(label, margin, currentY)

        doc.setTextColor(...colors.text)
        doc.setFont("helvetica", "bold")
        doc.text(value, pageWidth - margin, currentY, { align: "right" })

        doc.setDrawColor(...colors.border)
        doc.line(margin, currentY + 4, pageWidth - margin, currentY + 4)
        return currentY + 12
      }

      doc.setFontSize(12)
      doc.setTextColor(...colors.primary)
      doc.setFont("helvetica", "bold")
      doc.text("Sender & Bank Info", margin, y)
      y += 10

      y = addRow("Bank Name", "PrimeHarbor Bank", y)
      y = addRow("Reference No", transfer.txRef, y)
      y = addRow("Transfer Type", transfer.txRegion || "International", y)

      y += 10
      doc.setFontSize(12)
      doc.setTextColor(...colors.primary)
      doc.setFont("helvetica", "bold")
      doc.text("Receiver  Details", margin, y)
      y += 10

      y = addRow("Account Holder", transfer.bankHolder || "N/A", y)
      y = addRow("Target Institution", transfer.bankName || "N/A", y)
      y = addRow("Identity Marker", transfer.bankAccount || "N/A", y)

      y += 10
      doc.setFontSize(12)
      doc.setTextColor(...colors.primary)
      doc.setFont("helvetica", "bold")
      doc.text("Fiscal Parameters", margin, y)
      y += 10

      y = addRow("Transfer Amount", formatCurrency(transfer.amount, transfer.currency), y)
      y = addRow("Service Fee", formatCurrency(transfer.txCharge || 0, transfer.currency), y)

      doc.setFillColor(...colors.primary)
      doc.roundedRect(margin, y - 2, usableWidth, 12, 1, 1, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.text("TOTAL DEBIT", margin + 5, y + 6)
      doc.text(formatCurrency((transfer.amount || 0) + (transfer.txCharge || 0), transfer.currency), pageWidth - margin - 5, y + 6, { align: "right" })

      y += 25

      // === MEMO ===
      if (transfer.txReason) {
        doc.setFillColor(...colors.accent)
        doc.roundedRect(margin, y, usableWidth, 20, 2, 2, "F")
        doc.setTextColor(...colors.textMuted)
        doc.setFontSize(8)
        doc.setFont("helvetica", "bold")
        doc.text("DESCRIPTION:", margin + 5, y + 7)
        doc.setTextColor(...colors.text)
        doc.setFontSize(9)
        doc.setFont("helvetica", "italic")
        doc.text(`"${transfer.txReason}"`, margin + 5, y + 14)
      }

      // === FOOTER ===
      const footerY = pageHeight - 30
      doc.setDrawColor(...colors.border)
      doc.setLineWidth(0.5)
      doc.line(margin, footerY, pageWidth - margin, footerY)

      doc.setFontSize(8)
      doc.setTextColor(...colors.textLight)
      doc.setFont("helvetica", "normal")
      doc.text("PrimeHarbor Banking System V2.4", pageWidth / 2, footerY + 8, { align: "center" })
      doc.text("This document is an official record of a financial transfer. Issued by PrimeHarbor Bank.", pageWidth / 2, footerY + 12, { align: "center" })
      doc.text("PrimeHarbor Bank © 2026 | Secure • Authorized • Verified", pageWidth / 2, footerY + 16, { align: "center" })

      // Watermark
      doc.setTextColor(245, 245, 245)
      doc.setFontSize(50)
      doc.setFont("helvetica", "bold")
      doc.text("VERIFIED", pageWidth / 2, pageHeight / 2 + 20, { align: "center", angle: 45 })

      const timestamp = new Date().toISOString().slice(0, 10)
      doc.save(`PrimeHarbor_Receipt_${transfer.txRef}_${timestamp}.pdf`)
    } catch (err) {
      console.error("Receipt generation failed:", err)
      alert("System failed to compile receipt protocol.")
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="min-h-screen bg-[#001c10] w-full p-6 md:p-8 lg:p-12 pt-24 md:pt-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">

        {/* Navigation */}
        <motion.div {...fadeInUp} className="flex items-center justify-between gap-4 pb-6 border-b border-white/5">
          <Button variant="ghost" className="h-12 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-bold text-white flex items-center gap-2 transition-all group" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Dashboard
            </Link>
          </Button>
          <div className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
            Transfer Completed
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Receipt Artifact */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="lg:col-span-8">
            <Card className="border border-white/10 shadow-3xl bg-white/[0.03] backdrop-blur-xl rounded-[3rem] overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8">
                <div className="h-20 w-20 rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center text-emerald-500 shadow-2xl overflow-hidden relative group-hover:scale-110 transition-transform duration-500">
                  <CheckCircle className="h-10 w-10 relative z-10" />
                  <div className="absolute inset-0 bg-emerald-500/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>

              <CardHeader className="p-12 pb-6 border-b border-white/5">
                <div className="space-y-2">
                  <CardTitle className="text-4xl font-black text-white tracking-tighter lowercase">
                    Transaction <span className="text-slate-500 italic">Receipt</span>
                  </CardTitle>
                  <CardDescription className="text-slate-500 font-medium">Verified transaction record.</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="p-12 space-y-12">
                {/* Core Specs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Reference ID</p>
                    <p className="font-mono font-bold text-white tracking-tight">{transfer.txRef}</p>
                  </div>
                  <div className="space-y-1 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Date</p>
                    <p className="font-bold text-white tracking-tight">{new Date(transfer.txDate).toLocaleString()}</p>
                  </div>
                </div>

                {/* Value Metrics */}
                <div className="p-10 rounded-[2.5rem] bg-emerald-500/[0.03] border border-emerald-500/20 relative overflow-hidden group/value">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover/value:bg-emerald-500/20 transition-colors"></div>
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                          Amount
                        </p>
                        <p className="text-5xl font-black text-white tracking-tighter">
                          {formatCurrency(transfer.amount, transfer.currency)}
                        </p>
                      </div>
                      <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <DollarSign className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="pt-8 border-t border-emerald-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Service Fee</p>
                        <p className="text-lg font-bold text-slate-400">
                          {formatCurrency(transfer.txCharge, transfer.currency)}
                        </p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[9px] font-black text-red-500/70 uppercase tracking-widest">Total Debit</p>
                        <p className="text-2xl font-black text-red-400">
                          {formatCurrency((transfer.amount || 0) + (transfer.txCharge || 0), transfer.currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node Trace */}
                <div className="space-y-6 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-slate-800 rounded-full flex items-center justify-center">
                      <div className="h-1.5 w-1.5 bg-slate-600 rounded-full"></div>
                    </div>
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Beneficiary Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {[
                      { label: "Account Holder", value: transfer.bankHolder, icon: User, color: 'text-blue-500' },
                      { label: "Account Number", value: transfer.bankAccount, icon: Hash, color: 'text-orange-500' },
                      { label: "Bank Name", value: transfer.bankName, icon: Building, color: 'text-purple-500' },
                      { label: "Transfer Type", value: transfer.txRegion, icon: Globe, color: 'text-emerald-500' },
                    ].map((node, i) => (
                      <div key={i} className="flex items-center gap-4 group/node">
                        <div className={cn("h-10 w-10 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover/node:bg-white/10", node.color)}>
                          <node.icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{node.label}</p>
                          <p className="font-bold text-white text-sm lowercase tracking-tight">{node.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transmission Memo */}
                {transfer.txReason && (
                  <div className="p-8 rounded-[2rem] bg-black/40 border border-white/5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Info className="h-3 w-3 text-emerald-500" />
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Description</p>
                    </div>
                    <p className="text-slate-400 font-medium italic lowercase leading-relaxed">
                      "{transfer.txReason}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar Actions */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="lg:col-span-4 space-y-6">
            <div className="p-8 rounded-[2.5rem] bg-white/[0.03] backdrop-blur-md border border-white/5 shadow-2xl space-y-8">
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white lowercase tracking-tighter">Actions</h3>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Available operations for this entry.</p>
              </div>

              <div className="space-y-4">
                <Button
                  className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-[#001c10] font-black rounded-2xl shadow-xl shadow-emerald-500/20 uppercase tracking-tighter text-md transition-all hover:-translate-y-1"
                  onClick={handleDownload}
                >
                  <Download className="mr-3 h-5 w-5" />
                  Download PDF
                </Button>
                <Button variant="ghost" className="w-full h-16 border border-white/10 hover:bg-white/5 text-slate-400 font-bold rounded-2xl transition-all" asChild>
                  <Link href="/dashboard/transfer">New Transfer</Link>
                </Button>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgb(16,185,129)]"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Compliance Verified</span>
                </div>
                <p className="text-[10px] text-slate-700 font-medium leading-relaxed italic">
                  This receipt serves as an official record of transaction. Authorized use only.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
