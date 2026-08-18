"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function RemoveFromWishlistButton({ wishlistItemId }: { wishlistItemId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRemove = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("wishlist").delete().eq("id", wishlistItemId)

    if (!error) {
      router.refresh()
    }

    setIsLoading(false)
  }

  return (
    <Button onClick={handleRemove} disabled={isLoading} variant="outline" size="sm" className="flex-1 bg-transparent">
      <Trash2 className="h-4 w-4 mr-2" />
      Remove
    </Button>
  )
}
