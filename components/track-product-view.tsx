"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface TrackProductViewProps {
  productId: string
}

export function TrackProductView({ productId }: TrackProductViewProps) {
  useEffect(() => {
    async function trackView() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Insert or update recently viewed
      await supabase.from("recently_viewed").upsert(
        {
          user_id: user.id,
          product_id: productId,
          viewed_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,product_id",
        },
      )
    }

    trackView()
  }, [productId])

  return null
}
