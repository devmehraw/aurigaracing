"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function AbandonedCartTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const trackAbandonedCart = async () => {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Only track if user is on cart page and has items
      if (pathname === "/cart" && user) {
        const { data: cartItems } = await supabase
          .from("cart_items")
          .select("*, product:products(*)")
          .eq("user_id", user.id)

        if (cartItems && cartItems.length > 0) {
          const totalValue = cartItems.reduce((sum, item) => sum + item.product.price_in_cents * item.quantity, 0)

          // Store cart snapshot
          localStorage.setItem(
            "cart_snapshot",
            JSON.stringify({
              timestamp: Date.now(),
              items: cartItems,
              totalValue,
            }),
          )
        }
      }

      // Check if user left cart page
      if (pathname !== "/cart" && pathname !== "/checkout") {
        const cartSnapshot = localStorage.getItem("cart_snapshot")
        if (cartSnapshot) {
          const snapshot = JSON.parse(cartSnapshot)
          const timeSinceSnapshot = Date.now() - snapshot.timestamp

          // If more than 30 minutes have passed, mark as abandoned
          if (timeSinceSnapshot > 30 * 60 * 1000 && user) {
            await supabase.from("abandoned_carts").insert({
              user_id: user.id,
              cart_data: snapshot.items,
              total_value_in_cents: snapshot.totalValue,
            })

            localStorage.removeItem("cart_snapshot")
          }
        }
      }
    }

    trackAbandonedCart()
  }, [pathname])

  return null
}
