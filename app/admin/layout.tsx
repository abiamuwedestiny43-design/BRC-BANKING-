import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import AdminSidebar from "@/components/admin/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user || !isAdmin(user)) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-[#001c10]">
      <AdminSidebar user={user} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
