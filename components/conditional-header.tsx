"use client"

import { usePathname } from "next/navigation"
import Header from "@/components/Header"

export default function ConditionalHeader() {
  const pathname = usePathname()
  const hide = (pathname?.startsWith("/dashboard") ?? false) || (pathname?.startsWith("/admin") ?? false)

  if (hide) return null
  return <Header />
}
