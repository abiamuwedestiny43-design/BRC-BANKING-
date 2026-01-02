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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Center</h1>
        <p className="text-muted-foreground">Monitor your account security and activity</p>
      </div>

      {/* Security Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Account Verification</span>
              <Badge variant={user.bankAccount.verified ? "default" : "destructive"}>
                {user.bankAccount.verified ? "Verified" : "Unverified"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Transfer Status</span>
              <Badge variant={user.bankAccount.canTransfer ? "default" : "secondary"}>
                {user.bankAccount.canTransfer ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Two-Factor Auth</span>
              <Badge variant="secondary">Not Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Global Transfers</span>
              <Badge variant={globalEnabled ? "default" : "destructive"}>
                {globalEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Local Transfers</span>
              <Badge variant={localEnabled ? "default" : "secondary"}>{localEnabled ? "Enabled" : "Disabled"}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>PIN Protection</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Session Timeout</span>
              <Badge variant="secondary">7 days</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest account activities and security events</CardDescription>
        </CardHeader>
        <CardContent>
          {auditLogs.length > 0 ? (
            <div className="space-y-4">
              {auditLogs.map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${log.success ? "bg-green-100" : "bg-red-100"}`}>
                      {log.success ? (
                        <Shield className="h-4 w-4 text-green-600" />
                      ) : (
                        <Shield className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium capitalize">{log.action.replace(/_/g, " ")}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{log.ipAddress}</span>
                        <span>•</span>
                        <span>{log.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={log.success ? "default" : "destructive"}>{log.success ? "Success" : "Failed"}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No recent activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
