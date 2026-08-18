"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function AddToCartFromWishlist({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleAddToCart = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    const { error } = await supabase
      .from("cart_items")
      .upsert({ user_id: user.id, product_id: productId, quantity: 1 }, { onConflict: "user_id,product_id" })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Added to cart",
      })
      router.refresh()
    }

    setIsLoading(false)
  }

  return (
    <Button onClick={handleAddToCart} disabled={isLoading} size="sm" className="flex-1">
      <ShoppingCart className="h-4 w-4 mr-2" />
      Add to Cart
    </Button>
  )
}
