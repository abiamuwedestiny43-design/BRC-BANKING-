"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, ArrowLeftRight, Users, CreditCard, Settings, LogOut, Menu, X, Banknote, BellRing, ShieldCheck } from "lucide-react"
import type { IUser } from "@/models/User"
import Image from "next/image"

interface UserSidebarProps {
  user: IUser
}

const navigation = [
  { name: "Terminal", href: "/dashboard", icon: LayoutDashboard },
  { name: "Execute Transfer", href: "/dashboard/transfer", icon: ArrowLeftRight },
  { name: "Audit Ledger", href: "/dashboard/transactions", icon: Users },
  { name: "Asset Cards", href: "/dashboard/card", icon: CreditCard },
  { name: "Loan Protocols", href: "/dashboard/loans", icon: Banknote },
  { name: "System Alerts", href: "/dashboard/notifications", icon: BellRing },
  { name: "Interface Settings", href: "/dashboard/settings", icon: Settings },
]

export default function UserSidebar({ user }: UserSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/"
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button variant="outline" size="icon" className="bg-[#00130b] border-emerald-500/30 text-emerald-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-[#00130b] border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static shadow-2xl",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header/Logo */}
          <div className="p-8 pb-10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-2xl group-hover:scale-110 transition-transform bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white">
                PRIME<span className="text-emerald-500 italic">HARBOR</span>
              </span>
            </Link>
          </div>

          {/* User Profile Hook */}
          <div className="px-6 mb-10">
            <div className="p-4 rounded-[1.5rem] bg-emerald-500/5 border border-emerald-500/10 flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500 font-black text-lg overflow-hidden">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user.bankInfo.bio.firstname[0]
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#00130b] rounded-full"></div>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black text-white truncate">
                  {user.bankInfo.bio.firstname} {user.bankInfo.bio.lastname}
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 truncate">{user.bankNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scroll">
            <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Banking Protocols</p>
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group",
                    isActive
                      ? "bg-emerald-500 text-[#001c10] shadow-xl shadow-emerald-500/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-[#001c10]" : "text-emerald-500/50")} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer/Logout */}
          <div className="p-6 border-t border-white/5 bg-[#000d07]">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-300 hover:bg-red-400/5 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] gap-3"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Terminate Session
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
