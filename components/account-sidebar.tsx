"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { User, Package, MapPin, MessageSquare, LayoutDashboard, Award, Heart } from "lucide-react"

export function AccountSidebar({ role }: { role?: string }) {
  const pathname = usePathname()

  const links = [
    { href: "/account", label: "Dashboard", icon: LayoutDashboard },
    { href: "/account/profile", label: "Profile", icon: User },
    { href: "/account/orders", label: "Orders", icon: Package },
    { href: "/account/addresses", label: "Addresses", icon: MapPin },
    { href: "/account/wishlist", label: "Wishlist", icon: Heart },
    { href: "/account/loyalty", label: "Loyalty Rewards", icon: Award },
    { href: "/account/tickets", label: "Support Tickets", icon: MessageSquare },
  ]

  return (
    <div className="w-64 border-r bg-muted/10 p-6 space-y-2">
      <h2 className="text-lg font-semibold mb-4">My Account</h2>
      {links.map((link) => {
        const Icon = link.icon
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === link.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        )
      })}
      {(role === "admin" || role === "manager") && (
        <>
          <hr className="my-4" />
          <Link
            href={role === "admin" ? "/admin" : "/manager"}
            className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            {role === "admin" ? "Admin Dashboard" : "Manager Dashboard"}
          </Link>
        </>
      )}
    </div>
  )
}
