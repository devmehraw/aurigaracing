"use client"

import { useState } from "react"
import { Bell, BellOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface StockNotificationButtonProps {
  productId: string
  productName: string
  isInStock: boolean
}

export function StockNotificationButton({ productId, productName, isInStock }: StockNotificationButtonProps) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleNotification = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error("Please sign in to receive stock notifications")
      setIsLoading(false)
      return
    }

    try {
      if (isSubscribed) {
        // Remove notification
        const { error } = await supabase
          .from("stock_notifications")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId)

        if (error) throw error

        setIsSubscribed(false)
        toast.success("Stock notification removed")
      } else {
        // Add notification
        const { error } = await supabase.from("stock_notifications").insert({
          user_id: user.id,
          product_id: productId,
          email: user.email,
        })

        if (error) throw error

        setIsSubscribed(true)
        toast.success("You'll be notified when this product is back in stock!")
      }
    } catch (error) {
      console.error("[v0] Stock notification error:", error)
      toast.error("Failed to update notification preference")
    } finally {
      setIsLoading(false)
    }
  }

  if (isInStock) return null

  return (
    <Button variant="outline" onClick={handleToggleNotification} disabled={isLoading} className="w-full bg-transparent">
      {isSubscribed ? (
        <>
          <BellOff className="mr-2 h-4 w-4" />
          Remove Notification
        </>
      ) : (
        <>
          <Bell className="mr-2 h-4 w-4" />
          Notify When Available
        </>
      )}
    </Button>
  )
}
