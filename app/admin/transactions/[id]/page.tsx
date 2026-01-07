import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeft,
    Activity,
    ShieldCheck,
    Globe,
    CreditCard,
    Clock,
    Zap,
    User as UserIcon,
    ArrowUpRight,
    ArrowDownLeft,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    FileText,
    Lock,
    Database
} from "lucide-react"
import Link from "next/link"
import dbConnect from "@/lib/database"
import Transfer from "@/models/Transfer"
import User from "@/models/User"
import { formatCurrency } from "@/lib/utils/banking"
import { Separator } from "@/components/ui/separator"

async function getTransactionDetails(id: string) {
    await dbConnect()
    try {
        const transfer = await Transfer.findById(id).populate('userId', 'bankInfo.bio email')
        if (!transfer) return null
        return transfer
    } catch (error) {
        console.error("Error fetching transaction details:", error)
        return null
    }
}

export default async function AdminTransactionDetailsPage({ params }: { params: { id: string } }) {
    return (
        <div className="p-4 md:p-10 space-y-10 relative">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="flex items-center gap-6">
                    <Button variant="ghost" asChild className="h-14 w-14 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-all p-0">
                        <Link href="/admin/transactions">
                            <ArrowLeft className="h-6 w-6" />
                        </Link>
                    </Button>
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                            <Activity className="w-3 h-3" /> Transaction Details
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                            Transfer <span className="text-slate-500 italic">Analysis</span>
                        </h1>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Badge className="bg-white/5 border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-2 rounded-xl h-12 flex items-center">
                        Ref: {params.id.slice(-8).toUpperCase()}
                    </Badge>
                </div>
            </div>

            <Suspense fallback={<div className="text-emerald-500 font-black animate-pulse">LOADING DETAILS...</div>}>
                <TransactionContent id={params.id} />
            </Suspense>
        </div>
    )
}

async function TransactionContent({ id }: { id: string }) {
    const tx = await getTransactionDetails(id)
    if (!tx) notFound()

    const isCredit = tx.txType === "credit"
    const statusColor = {
        success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        failed: "bg-red-500/10 text-red-500 border-red-500/20",
        cancelled: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    }[tx.txStatus] || "bg-slate-500/10 text-slate-500"

    const user = tx.userId as any

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
            {/* Primary Audit Hub */}
            <div className="lg:col-span-2 space-y-10">
                <Card className="bg-white/[0.03] border-white/5 rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 border-b border-white/5 bg-white/[0.01]">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className={`w-20 h-20 rounded-[2rem] ${isCredit ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'} border flex items-center justify-center text-4xl font-black`}>
                                    {isCredit ? <ArrowDownLeft className="w-10 h-10" /> : <ArrowUpRight className="w-10 h-10" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                                            {isCredit ? "Credit Deposit" : "Debit Withdrawal"}
                                        </h2>
                                        <Badge className={`${statusColor} font-black uppercase tracking-widest text-[10px]`}>
                                            {tx.txStatus}
                                        </Badge>
                                    </div>
                                    <p className="text-slate-500 font-mono text-sm mt-1 tracking-widest uppercase">REF: {tx.txRef}</p>
                                </div>
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Audit Flux Value</p>
                                <p className={`text-4xl font-black tracking-tighter ${isCredit ? 'text-emerald-500' : 'text-white'}`}>
                                    {isCredit ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            {/* Origin Section */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <Database className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Source Details</h3>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                            <UserIcon className="w-3 h-3" /> User Account
                                        </p>
                                        {user ? (
                                            <Link href={`/admin/users/${user._id}`} className="block group">
                                                <p className="text-sm font-bold text-white group-hover:text-emerald-500 transition-colors uppercase tracking-tight">
                                                    {user.bankInfo?.bio?.firstname} {user.bankInfo?.bio?.lastname}
                                                </p>
                                                <p className="text-xs text-slate-500 italic mt-0.5">{user.email}</p>
                                            </Link>
                                        ) : (
                                            <p className="text-sm font-bold text-red-500/50 italic">ORPHAN_NODE [Identity Removed]</p>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                            Origin Account
                                        </p>
                                        <p className="text-sm font-mono font-bold text-white tracking-widest">{tx.senderAccount || "S_SYSTEM_CORE"}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                            Service Fee
                                        </p>
                                        <p className="text-sm font-bold text-white">{formatCurrency(tx.txCharge, tx.currency)}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                            <Globe className="w-3 h-3" /> Jurisdiction
                                        </p>
                                        <p className="text-sm font-bold text-white uppercase tracking-tight">{tx.bankCountry || tx.country || "Global Hub"}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                            <Globe className="w-3 h-3" /> Region Type
                                        </p>
                                        <Badge variant="outline" className="bg-white/5 border-white/5 text-[9px] font-black uppercase text-slate-400">
                                            {tx.txRegion} Transfer
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Destination Section */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                        <Globe className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Target Destination</h3>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                            Recipient Identity
                                        </p>
                                        <p className="text-sm font-bold text-white uppercase tracking-tight">{tx.accountHolder}</p>
                                        <p className="text-xs text-slate-500 italic mt-0.5">{tx.bankName}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                            Account Number
                                        </p>
                                        <p className="text-sm font-mono font-bold text-emerald-500 tracking-widest">{tx.bankAccount}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                            Routing Parameters
                                        </p>
                                        <div className="flex gap-2 flex-wrap">
                                            <Badge className="bg-white/5 border-white/5 text-[9px] text-slate-500 font-mono">{tx.routingCode || "NA"}</Badge>
                                            <Badge className="bg-white/5 border-white/5 text-[9px] text-slate-500 font-mono">{tx.identifierCode || tx.identifier || "NA"}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-white/5 my-12" />

                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-yellow-400" />
                                </div>
                                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Transaction Description</h3>
                            </div>
                            <p className="text-slate-400 italic text-sm leading-relaxed border-l-2 border-slate-700 pl-6">
                                "{tx.description || tx.txReason || "No description provided."}"
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Verification Protocols */}
                <Card className="bg-white/[0.03] border-white/5 rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 border-b border-white/5 bg-white/[0.01]">
                        <CardTitle className="text-2xl font-black text-white italic tracking-tight flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-emerald-500" /> Verification Codes
                        </CardTitle>
                        <CardDescription className="text-slate-500 font-medium">Compliance codes required for transfer completion.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-10">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {[
                                { name: "COT", status: tx.verificationSteps?.cotVerified, label: "Core Origination" },
                                { name: "IMF", status: tx.verificationSteps?.imfVerified, label: "International Monetary" },
                                { name: "ESI", status: tx.verificationSteps?.esiVerified, label: "External Signature" },
                                { name: "DCO", status: tx.verificationSteps?.dcoVerified, label: "Digital Compliance" },
                                { name: "TAX", status: tx.verificationSteps?.taxVerified, label: "Revenue Audit" },
                                { name: "TAC", status: tx.verificationSteps?.tacVerified, label: "Transmission Auth" },
                            ].map((protocol, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-black/20 border border-white/5 flex flex-col justify-between h-32 hover:border-emerald-500/20 transition-all">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-black text-white uppercase tracking-[0.2em]">{protocol.name}</span>
                                        {protocol.status ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                                        ) : (
                                            <Lock className="w-4 h-4 text-slate-700" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{protocol.label}</p>
                                        <p className={`text-[10px] font-black mt-1 ${protocol.status ? 'text-emerald-500' : 'text-slate-600'}`}>
                                            {protocol.status ? "VERIFIED" : "PENDING"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Side Metadata Panel */}
            <div className="space-y-8">
                <Card className="bg-[#001c10] border-emerald-500/20 rounded-[2.5rem] p-10 overflow-hidden relative shadow-3xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="relative z-10 space-y-8">
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Time Logs</h3>

                            <div className="space-y-4">
                                {[
                                    { label: "Initiation Epoch", value: tx.createdAt, icon: Clock },
                                    { label: "Execution Target", value: tx.txDate, icon: Zap },
                                    { label: "Finalization", value: tx.completedAt || "Awaiting...", icon: CheckCircle2 },
                                ].map((log, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                            <log.icon className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{log.label}</p>
                                            <p className="text-xs font-bold text-white">
                                                {log.value instanceof Date
                                                    ? `${log.value.toLocaleDateString()} — ${log.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                                    : typeof log.value === 'string' ? log.value : "Pending"
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator className="bg-white/5" />

                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Admin Actions</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-[10px] h-12 rounded-xl shadow-lg shadow-emerald-500/20">
                                    Manual Success Override
                                </Button>
                                <Button variant="ghost" className="w-full border border-red-500/20 text-red-500 hover:bg-red-500/10 font-black uppercase tracking-widest text-[10px] h-12 rounded-xl">
                                    Cancel Transfer
                                </Button>
                            </div>
                        </div>

                        <div className="pt-8 text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5">
                                <Lock className="w-3 h-3 text-slate-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Immutable Record</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Security Alert if international */}
                {tx.txRegion === "international" && (
                    <Card className="bg-yellow-500/10 border border-yellow-500/20 rounded-[2rem] p-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            <h3 className="text-sm font-black text-yellow-500 uppercase tracking-widest">Cross-Border Alert</h3>
                        </div>
                        <p className="text-xs text-yellow-500/70 leading-relaxed italic">
                            "This transfer spans international zones. COT and IMF codes are legally required."
                        </p>
                    </Card>
                )}
            </div>
        </div>
    )
}
