import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "@/styles/globals.css"
import Footer from "@/components/Footer"
import ConditionalHeader from "@/components/conditional-header"

export const metadata: Metadata = {
  title: "PrimeHarbor Bank - Secure Banking Solutions",
  description:
    "PrimeHarbor Bank provides secure banking solutions with advanced features for personal and business banking.",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ConditionalHeader />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
        <Footer />
      </body>
    </html>
  )
}
