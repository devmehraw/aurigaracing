"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export function WishlistButton({ productId }: { productId: string }) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkWishlistStatus()
  }, [productId])

  const checkWishlistStatus = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single()

    setIsInWishlist(!!data)
  }

  const toggleWishlist = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    if (isInWishlist) {
      // Remove from wishlist
      const { error } = await supabase.from("wishlist").delete().eq("user_id", user.id).eq("product_id", productId)

      if (!error) {
        setIsInWishlist(false)
        toast({
          title: "Removed from wishlist",
        })
        router.refresh()
      }
    } else {
      // Add to wishlist
      const { error } = await supabase.from("wishlist").insert({ user_id: user.id, product_id: productId })

      if (!error) {
        setIsInWishlist(true)
        toast({
          title: "Added to wishlist",
        })
        router.refresh()
      }
    }

    setIsLoading(false)
  }

  return (
    <Button
      onClick={toggleWishlist}
      disabled={isLoading}
      variant={isInWishlist ? "default" : "outline"}
      size="icon"
      className={cn(isInWishlist && "bg-red-500 hover:bg-red-600")}
    >
      <Heart className={cn("h-5 w-5", isInWishlist && "fill-current")} />
    </Button>
  )
}
