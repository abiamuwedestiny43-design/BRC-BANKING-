"use client"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function NotificationsPage() {
  const { toast } = useToast()
  const { data, mutate, isLoading } = useSWR("/api/user/notifications", fetcher)

  const notifications = data?.notifications || []

  const markAllRead = async () => {
    const res = await fetch("/api/user/notifications", { method: "PATCH" })
    if (res.ok) {
      toast({ title: "Updated", description: "Notifications marked as read" })
      mutate()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  from-green-50 to-white flex items-start justify-center p-4 pt-[60px]">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
            <p className="text-slate-600">Your latest updates</p>
          </div>
          <Button variant="outline" onClick={markAllRead}>
            Mark all as read
          </Button>
        </div>

        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Recent</CardTitle>
            <CardDescription className="text-slate-600">
              {isLoading ? "Loading..." : `${notifications.length} notifications`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-slate-600">No notifications yet.</p>
            ) : (
              notifications.map((n: any) => (
                <div key={n._id} className="p-3 rounded-lg border flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-800">{n.message}</p>
                    <p className="text-xs text-slate-600">{new Date(n.period).toLocaleString()}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${n.viewed ? "bg-muted text-slate-600" : "bg-green-100 text-slate-800"}`}
                  >
                    {n.viewed ? "Read" : "New"}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
