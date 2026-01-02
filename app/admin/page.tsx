import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, ArrowLeftRight, DollarSign } from "lucide-react"
import dbConnect from "@/lib/database"
import User from "@/models/User"
import Transfer from "@/models/Transfer"
import CardModel from "@/models/Card"

async function getDashboardStats() {
  await dbConnect()

  const [totalUsers, totalTransfers, totalCards, pendingApprovals] = await Promise.all([
    User.countDocuments(),
    Transfer.countDocuments(),
    CardModel.countDocuments(),
    User.countDocuments({ "bankAccount.verified": false }),
  ])

  return {
    totalUsers,
    totalTransfers,
    totalCards,
    pendingApprovals,
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="min-h-screen pt-[80px] bg-gradient-to-br from-green-50 to-white flex items-start justify-center p-4">
      <div className="w-full max-w-6xl space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600">Welcome to Corporate Bank administration panel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Total Users",
              value: stats.totalUsers,
              icon: <Users className="h-5 w-5" />,
              desc: "Registered accounts",
            },
            {
              title: "Total Transfers",
              value: stats.totalTransfers,
              icon: <ArrowLeftRight className="h-5 w-5" />,
              desc: "All transactions",
            },
            {
              title: "Total Cards",
              value: stats.totalCards,
              icon: <CreditCard className="h-5 w-5" />,
              desc: "Issued cards",
            },
            {
              title: "Pending Approvals",
              value: stats.pendingApprovals,
              icon: <DollarSign className="h-5 w-5" />,
              desc: "Awaiting verification",
            },
          ].map((stat, i) => (
            <Card key={i} className="animate-fade-in-up border-green-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">{stat.title}</CardTitle>
                <div className="text-slate-500">{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                <p className="text-xs text-slate-600">{stat.desc}</p>
              </CardContent>
            </Card>
          ))}
          {/* Additional Admin Tools */}
          <Card className="animate-fade-in-up border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Transfer Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-600 mb-3">Manage COT/IMF/TAC</div>
              <a
                href="/admin/transfer-codes"
                className="inline-flex items-center text-green-700 font-medium hover:underline"
              >
                Manage
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Activity & System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="animate-fade-in-up border-green-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Recent Activity</CardTitle>
              <CardDescription className="text-slate-600">Latest system activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { color: "bg-green-500", text: "New user registration", time: "2 minutes ago" },
                  { color: "bg-blue-500", text: "Transfer completed", time: "5 minutes ago" },
                  { color: "bg-yellow-500", text: "Account verification pending", time: "10 minutes ago" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{activity.text}</p>
                      <p className="text-xs text-slate-600">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="animate-fade-in-up border-green-200">
            <CardHeader>
              <CardTitle className="text-slate-800">System Status</CardTitle>
              <CardDescription className="text-slate-600">Current system health</CardDescription>
            </CardHeader>
            <CardContent>
              {[
                { label: "Database", status: "Online" },
                { label: "Email Service", status: "Online" },
                { label: "Payment Gateway", status: "Online" },
              ].map((service, i) => (
                <div key={i} className="flex items-center justify-between mb-3 last:mb-0">
                  <span className="text-sm text-slate-700">{service.label}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">{service.status}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
