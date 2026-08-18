"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { ShoppingCart, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function QuickAddToCartButton({ productId, disabled }: { productId: string; disabled?: boolean }) {
  const [isLoading, setIsLoading] = useState(false)
  const [added, setAdded] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsLoading(true)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push(`/auth/login?redirect=${window.location.pathname}`)
      return
    }

    try {
      const { data: existing } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .single()

      if (existing) {
        await supabase
          .from("cart_items")
          .update({
            quantity: existing.quantity + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
      } else {
        await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: productId,
          quantity: 1,
        })
      }

      setAdded(true)
      toast({
        title: "Added to cart",
        description: "Product has been added to your cart",
      })
      router.refresh()

      setTimeout(() => setAdded(false), 2000)
    } catch (error) {
      console.error("[v0] Add to cart error:", error)
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={handleAddToCart}
      disabled={disabled || isLoading}
      className="bg-transparent hover:bg-primary hover:text-primary-foreground transition-colors"
    >
      {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
    </Button>
  )
}
