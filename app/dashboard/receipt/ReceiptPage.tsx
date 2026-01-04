import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

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
      const margin = 10
      const pageWidth = 210
      const pageHeight = 297
      const usableWidth = pageWidth - margin * 2
      const footerHeight = 35
      let y = 18

      const colors = {
        primary: [0, 28, 16], // Dark Emerald
        secondary: [16, 185, 129], // Emerald
        success: [16, 185, 129],
        text: [31, 41, 55],
        textMuted: [107, 114, 128],
        textLight: [156, 163, 175],
        border: [229, 231, 235],
      }

      // HEADER
      doc.setFillColor(...colors.primary)
      doc.rect(0, 0, pageWidth, 28, "F")

      doc.setFont("helvetica", "bold")
      doc.setFontSize(18)
      doc.setTextColor(255, 255, 255)
      doc.text("Nova Financial", margin, 14)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.setTextColor(220, 255, 220)
      doc.text("High-Velocity Liquid Routing • Secure Protocol", margin, 22)

      // STATUS
      doc.setFillColor(...colors.success)
      doc.roundedRect(pageWidth - margin - 35, 9, 32, 10, 2, 2, "F")
      doc.setFont("helvetica", "bold")
      doc.setFontSize(9)
      doc.setTextColor(255, 255, 255)
      doc.text(" AUTHORIZED", pageWidth - margin - 33, 16)

      y = 60

      // RECEIPT TITLE
      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.setTextColor(...colors.text)
      doc.text("Transmission Ledger", margin, y)
      y += 8

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.setTextColor(...colors.textMuted)
      doc.text(`Ref: ${transfer.txRef}`, margin, y)
      doc.text(
        transfer.txDate ? new Date(transfer.txDate).toLocaleString() : "",
        pageWidth - margin,
        y,
        { align: "right" }
      )
      y += 12

      // AMOUNT BOX
      doc.setFillColor(245, 255, 250)
      doc.roundedRect(margin, y, usableWidth, 25, 3, 3, "F")
      doc.setDrawColor(...colors.border)
      doc.roundedRect(margin, y, usableWidth, 25, 3, 3, "S")

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.setTextColor(...colors.textMuted)
      doc.text("Routed Value", margin + 5, y + 8)

      doc.setFont("helvetica", "bold")
      doc.setFontSize(16)
      doc.setTextColor(...colors.success)
      doc.text(formatCurrency(transfer.amount, transfer.currency), margin + 5, y + 18)

      y += 30

      // DETAILS
      const addDetailRow = (label: string, value: string, yPos: number, isLast = false) => {
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.setTextColor(...colors.textMuted)
        doc.text(label, margin + 5, yPos)

        doc.setFont("helvetica", "bold")
        doc.setFontSize(9)
        doc.setTextColor(...colors.text)
        doc.text(value, pageWidth - margin - 5, yPos, { align: "right" })

        if (!isLast) {
          doc.setDrawColor(...colors.border)
          doc.setLineWidth(0.3)
          doc.line(margin + 5, yPos + 2, pageWidth - margin - 5, yPos + 2)
        }
      }

      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.text("System Parameters", margin, y)
      y += 8

      addDetailRow("Transmission Val:", formatCurrency(transfer.amount, transfer.currency), y)
      y += 8
      addDetailRow("Protocol Fee:", formatCurrency(transfer.txCharge, transfer.currency), y)
      y += 8
      addDetailRow(
        "Net Egress:",
        formatCurrency((transfer.amount || 0) + (transfer.txCharge || 0), transfer.currency),
        y,
        true
      )
      y += 14

      // RECIPIENT
      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.text("Target Node", margin, y)
      y += 8

      addDetailRow("Account Holder:", transfer.bankHolder || "N/A", y)
      y += 8
      addDetailRow("Gateway Identity:", transfer.bankName || "N/A", y)
      y += 8
      addDetailRow("Identity Marker:", transfer.bankAccount || "N/A", y)
      y += 8
      addDetailRow("Relay Type:", transfer.txRegion || "N/A", y, true)
      y += 14

      // DESCRIPTION
      if (transfer.txReason) {
        doc.setFont("helvetica", "bold")
        doc.setFontSize(12)
        doc.text("Transmission Memo", margin, y)
        y += 8
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        const descLines = doc.splitTextToSize(transfer.txReason, usableWidth - 10)
        doc.text(descLines, margin + 5, y)
        y += descLines.length * 2 + 6
      }

      // === FOOTER ===
      const footerY = pageHeight - footerHeight + 8

      doc.setFont("helvetica", "bold")
      doc.setFontSize(13)
      doc.setTextColor(...colors.textLight)
      doc.text("Corporate Financial Systems • Authorized", pageWidth / 2, footerY, { align: "center" })

      doc.setFont("helvetica", "normal")
      doc.setFontSize(11)
      doc.text("Protocol: Nova V2 | Integrity Verified | Sector: Global", pageWidth / 2, footerY + 6, { align: "center" })
      doc.text("www.nova-financial.io | Secure • Private • Rapid", pageWidth / 2, footerY + 12, { align: "center" })

      doc.setFontSize(10)
      doc.text(`Authenticated on ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 18, { align: "center" })

      // WATERMARK
      doc.setFontSize(30)
      doc.setTextColor(240, 240, 240)
      doc.text("AUTHORIZED TRANSMISSION", pageWidth / 2, pageHeight / 2, {
        align: "center",
        angle: 45,
      })

      const timestamp = new Date().toISOString().slice(0, 10)
      doc.save(`Nova-Transmission-${transfer.txRef}-${timestamp}.pdf`)
    } catch (err) {
      console.error("Transmission receipt generation failed:", err)
      alert("Failed to compile receipt protocol.")
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
              Terminal
            </Link>
          </Button>
          <div className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
            Transmission Finalized
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
                    Transmission <span className="text-slate-500 italic">Signature</span>
                  </CardTitle>
                  <CardDescription className="text-slate-500 font-medium">Verified system transmission log entry.</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="p-12 space-y-12">
                {/* Core Specs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Signature ID</p>
                    <p className="font-mono font-bold text-white tracking-tight">{transfer.txRef}</p>
                  </div>
                  <div className="space-y-1 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Ledger Timestamp</p>
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
                          Egress Value
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
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocol Fee</p>
                        <p className="text-lg font-bold text-slate-400">
                          {formatCurrency(transfer.txCharge, transfer.currency)}
                        </p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[9px] font-black text-red-500/70 uppercase tracking-widest">Net System Egress</p>
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
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Neural Node Trace</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {[
                      { label: "Entity Node", value: transfer.bankHolder, icon: User, color: 'text-blue-500' },
                      { label: "Identity Marker", value: transfer.bankAccount, icon: Hash, color: 'text-orange-500' },
                      { label: "Gateway Node", value: transfer.bankName, icon: Building, color: 'text-purple-500' },
                      { label: "Relay Protocol", value: transfer.txRegion, icon: Globe, color: 'text-emerald-500' },
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
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocol Memo</p>
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
                <h3 className="text-xl font-black text-white lowercase tracking-tighter">Chain <span className="text-slate-500 italic">Actions</span></h3>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Available operations for this entry.</p>
              </div>

              <div className="space-y-4">
                <Button
                  className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-[#001c10] font-black rounded-2xl shadow-xl shadow-emerald-500/20 uppercase tracking-tighter text-md transition-all hover:-translate-y-1"
                  onClick={handleDownload}
                >
                  <Download className="mr-3 h-5 w-5" />
                  Compile Artifact
                </Button>
                <Button variant="ghost" className="w-full h-16 border border-white/10 hover:bg-white/5 text-slate-400 font-bold rounded-2xl transition-all" asChild>
                  <Link href="/dashboard/transfer">New Transmission</Link>
                </Button>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgb(16,185,129)]"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Compliance Verified</span>
                </div>
                <p className="text-[10px] text-slate-700 font-medium leading-relaxed italic">
                  This artifact serves as an immutable record of transmission. Authorized use only.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
  )
}
