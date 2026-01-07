import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, MapPin, Smartphone } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getAuditLogs } from "@/lib/security"
import dbConnect from "@/lib/database"
import SystemOption from "@/models/SystemOption"

export default async function SecurityPage() {
  const user = await getCurrentUser()
  if (!user) return null

  await dbConnect()
  const globalOpt = await SystemOption.findOne({ key: "bank:transfer.global.enabled" }).lean()
  const localOpt = await SystemOption.findOne({ key: "bank:transfer.local.enabled" }).lean()
  const globalEnabled = typeof globalOpt?.value === "boolean" ? (globalOpt.value as boolean) : true
  const localEnabled = typeof localOpt?.value === "boolean" ? (localOpt.value as boolean) : true

  const auditLogs = getAuditLogs(user._id.toString(), 10)

  return (
    <div className="min-h-screen bg-[#001c10] w-full p-6 md:p-8 lg:p-12 pt-24 md:pt-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-widest text-[10px] px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 w-fit rounded-full">
              <Shield className="h-3 w-3" />
              Security
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter lowercase">
              Security <span className="text-slate-500 italic">Center</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg">Monitor account security and login history.</p>
          </div>
        </div>

        {/* Security Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border border-white/5 shadow-2xl bg-white/[0.03] backdrop-blur-md rounded-[2.5rem] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-2xl font-black text-white lowercase tracking-tighter flex items-center gap-3">
                <Shield className="h-5 w-5 text-emerald-500" />
                Account <span className="text-slate-500 italic">Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {[
                { label: "Account Verified", value: user.bankAccount.verified ? "Yes" : "No", active: user.bankAccount.verified },
                { label: "Transfers", value: user.bankAccount.canTransfer ? "Enabled" : "Disabled", active: user.bankAccount.canTransfer },
                { label: "Multi-Factor Authentication", value: "Offline", active: false },
                { label: "International Transfers", value: globalEnabled ? "Enabled" : "Disabled", active: globalEnabled },
                { label: "Local Transfers", value: localEnabled ? "Enabled" : "Disabled", active: localEnabled },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group/row">
                  <span className="text-slate-400 font-bold lowercase text-sm group-hover/row:text-emerald-500 transition-colors">{item.label}</span>
                  <Badge className={cn(
                    "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all",
                    item.active ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                  )}>
                    {item.value}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-white/5 shadow-2xl bg-white/[0.03] backdrop-blur-md rounded-[2.5rem] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-2xl font-black text-white lowercase tracking-tighter flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-blue-500" />
                App <span className="text-slate-500 italic">Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {[
                { label: "PIN Protection", value: "Active", active: true, color: 'emerald' },
                { label: "Notifications", value: "Enabled", active: true, color: 'emerald' },
                { label: "Session Timeout", value: "7 Days", active: true, color: 'blue' },
                { label: "App Status", value: "Online", active: true, color: 'emerald' },
                { label: "Privacy Mode", value: "Standard", active: false, color: 'slate' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group/row">
                  <span className="text-slate-400 font-bold lowercase text-sm group-hover/row:text-blue-500 transition-colors">{item.label}</span>
                  <Badge className={cn(
                    "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all",
                    item.active ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-white/5 text-slate-500 border-white/10"
                  )}>
                    {item.value}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border border-white/5 shadow-2xl bg-white/[0.03] backdrop-blur-md rounded-[3rem] overflow-hidden relative group">
          <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none"></div>
          <CardHeader className="p-10 border-b border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-3xl font-black text-white lowercase tracking-tighter flex items-center gap-4">
                  <Clock className="h-6 w-6 text-emerald-500" />
                  Activity <span className="text-slate-500 italic">Logs</span>
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">Recent login and security activity.</CardDescription>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-slate-500 text-[9px] font-black uppercase tracking-widest">
                Sector: Universal
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10">
            {auditLogs.length > 0 ? (
              <div className="space-y-4">
                {auditLogs.map((log, index) => (
                  <div key={index} className="flex flex-col md:flex-row items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group/log">
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center border shadow-2xl transition-transform group-hover/log:scale-110",
                        log.success ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                      )}>
                        <Shield className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-black text-white text-lg lowercase tracking-tight">
                          {log.action.replace(/_/g, " ")}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3" />
                            {log.ipAddress}
                          </div>
                          <span className="h-1 w-1 rounded-full bg-slate-800"></span>
                          <span>{log.timestamp.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={cn(
                      "mt-4 md:mt-0 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                      log.success ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                    )}>
                      {log.success ? "Authorized" : "Denied"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="h-20 w-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-slate-800 group-hover:scale-110 transition-transform">
                  <Clock className="h-8 w-8" />
                </div>
                <p className="text-slate-600 font-black uppercase tracking-[0.2em] text-xs">No activity found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Global Utility Styles */}
      <div className="hidden">
        <style dangerouslySetInnerHTML={{
          __html: `
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            ` }} />
      </div>
    </div>
  )
}
