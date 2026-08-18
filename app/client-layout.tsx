"use client"

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { CategoryBar } from "@/components/category-bar"
import { TopBar } from "@/components/top-bar"
import { AbandonedCartTracker } from "@/components/abandoned-cart-tracker"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin")

  return (
    <>
      {!isAdminRoute && <TopBar />}
      <Navbar />
      {!isAdminRoute && <CategoryBar />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && <Footer />}
      <Toaster />
      <Analytics />
      <AbandonedCartTracker />
    </>
  )
}

export { ClientLayout }
