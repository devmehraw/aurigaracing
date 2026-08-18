"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  MessageSquare,
  Star,
  FileText,
  BarChart3,
  Gift,
  Warehouse,
  Ticket,
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/categories", icon: Tag, label: "Categories" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/bundles", icon: Gift, label: "Bundles" },
  { href: "/admin/inventory", icon: Warehouse, label: "Inventory" },
  { href: "/admin/vouchers", icon: Ticket, label: "Vouchers" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/reviews", icon: Star, label: "Reviews" },
  { href: "/admin/tickets", icon: MessageSquare, label: "Tickets" },
  { href: "/admin/pages", icon: FileText, label: "Pages" },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-64 border-r bg-background pt-20">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="mb-4">
          <h2 className="px-4 text-lg font-semibold">Admin Panel</h2>
        </div>
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
