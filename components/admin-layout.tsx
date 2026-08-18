"use client"

import type React from "react"
import { AdminSidebar } from "./admin-sidebar"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 flex-1 overflow-x-hidden">{children}</main>
    </div>
  )
}
