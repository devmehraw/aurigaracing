"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

export function AddToCartButton({
  productId,
  disabled = false,
  className,
  selectedOptions,
  onBeforeAdd,
}: {
  productId: string
  disabled?: boolean
  className?: string
  selectedOptions?: Record<string, string>
  onBeforeAdd?: () => boolean
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleAddToCart = async () => {
    if (onBeforeAdd && !onBeforeAdd()) {
      return
    }

    setIsLoading(true)
    setMessage(null)

    const supabase = createClient()

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // Redirect to login with return URL
      router.push(`/auth/login?redirect=${window.location.pathname}`)
      return
    }

    try {
      const metadata = selectedOptions ? { selected_options: selectedOptions } : null

      // Check if item already in cart
      const { data: existing } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .single()

      if (existing) {
        // Update quantity
        const { error } = await supabase
          .from("cart_items")
          .update({
            quantity: existing.quantity + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)

        if (error) throw error
      } else {
        // Insert new item
        const { error } = await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: productId,
          quantity: 1,
        })

        if (error) throw error
      }

      setMessage("Added to cart!")
      setTimeout(() => setMessage(null), 2000)
    } catch (error) {
      console.error("[v0] Add to cart error:", error)
      setMessage("Failed to add to cart")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Button onClick={handleAddToCart} disabled={disabled || isLoading} className="w-full" size="lg">
        <ShoppingCart className="h-5 w-5 mr-2" />
        {isLoading ? "Adding..." : "Add to Cart"}
      </Button>
      {message && (
        <p className={`text-sm text-center ${message.includes("Failed") ? "text-destructive" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  )
}
