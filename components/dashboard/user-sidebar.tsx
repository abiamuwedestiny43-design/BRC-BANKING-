"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  CreditCard,
  Bell,
  BellRing,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import type { IUser } from "@/models/User"

interface UserSidebarProps {
  user: IUser
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transfer", href: "/dashboard/transfer", icon: ArrowLeftRight },
  { name: "Transactions", href: "/dashboard/transactions", icon: Users },
  { name: "Cards", href: "/dashboard/card", icon: CreditCard },
  { name: "Loans", href: "/dashboard/loans", icon: Bell },
  { name: "Notifications", href: "/dashboard/notifications", icon: BellRing },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function UserSidebar({ user }: UserSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-green-600 text-white hover:bg-green-700 shadow-lg transition-transform duration-300 hover:scale-105"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-0 h-full  left-0 z-40 w-64 bg-gradient-to-b from-green-700 to-green-900 text-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-green-600 bg-green-800">
            <h1 className="text-xl font-bold tracking-wide">🌿 Corporate Bank</h1>
          </div>

          {/* User info */}
          <div className="p-5 border-b border-green-700 bg-green-800/60 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                {user.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt="User"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span>
                    {user.bankInfo.bio.firstname[0]}
                    {user.bankInfo.bio.lastname[0]}
                  </span>
                )}
                {/* {user.bankInfo.bio.lastname[0]} */}
              </div>
              <div>
                <p className="font-medium">
                  {user.bankInfo.bio.firstname} {user.bankInfo.bio.lastname}
                </p>
                <p className="text-sm text-green-200">{user.bankNumber}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scroll">
            {navigation.map((item, i) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-300 group",
                    isActive
                      ? "bg-green-500 text-white shadow-lg"
                      : "text-green-200 hover:text-white hover:bg-green-600/60 hover:shadow-md",
                  )}
                  style={{ animationDelay: `${i * 100}ms` }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-green-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-green-200 hover:text-white hover:bg-red-600/90 transition-all"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
