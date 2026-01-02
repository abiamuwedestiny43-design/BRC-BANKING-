import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import UserSidebar from "@/components/dashboard/user-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen bg-background">
      <UserSidebar user={user} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
