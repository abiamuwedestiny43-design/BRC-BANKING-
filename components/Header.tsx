"use client"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // Check current user
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/current-user")
        const data = await res.json()
        setCurrentUser(data.user)
      } catch (err) {
        console.error("Failed to load user:", err)
      }
    }
    fetchUser()

    // Scroll behavior
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setCurrentUser(null)
      window.location.href = "/"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const navItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "about", label: "About", href: "/about" },
    { id: "loans", label: "Loans", href: "/loans" },
    { id: "mortgage", label: "Mortgage", href: "/mortgage" },
    { id: "contact", label: "Contact", href: "/contact" },
  ]

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-lg" : "bg-white/95 backdrop-blur-sm"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[74px]">
          {/* Logo */}
          <Link href="/" className="inline-block">
            <Image src="/santech.png" alt="Corporate Bank" width={90} height={50} className="h-[72px] rounded-lg" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.id} href={item.href} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">
                {item.label}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600">
                Services
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild><Link href="/services/">Our Services</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/services/personal">Personal Banking</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/services/business">Business Banking</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/services/investment">Investment Services</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/services/mortgage">Mortgage Services</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/services/insurance">Insurance</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/services/planning">Financial Planning</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Side Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link href="/dashboard" className="text-slate-50 hover:text-green-800 font-medium px-3 py-2 hover:bg-slate-100 bg-green-600 rounded-lg transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-white font-medium hover:bg-green-600 px-3 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-green-600 hover:bg-green-600 hover:text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Open Account
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {currentUser ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center px-3 py-2 text-base font-medium rounded-lg bg-green-600 text-slate-50 hover:text-green-600 hover:bg-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  className="block w-full text-left px-3 py-2 text-base hover:text-slate-50 font-medium text-green-800 hover:bg-green-600"
                  onClick={async () => {
                    setIsMenuOpen(false)
                    await handleLogout()
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Open Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Header
