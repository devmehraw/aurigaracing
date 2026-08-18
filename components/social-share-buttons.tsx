"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Share2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface SocialShareButtonsProps {
  productId: string
  productName: string
  productImage?: string
}

export function SocialShareButtons({ productId, productName, productImage }: SocialShareButtonsProps) {
  const [isSharing, setIsSharing] = useState(false)

  const trackShare = async (platform: string) => {
    const supabase = createClient()

    try {
      // Check if share record exists
      const { data: existing } = await supabase
        .from("product_shares")
        .select("*")
        .eq("product_id", productId)
        .eq("platform", platform)
        .single()

      if (existing) {
        // Increment share count
        await supabase
          .from("product_shares")
          .update({ share_count: existing.share_count + 1 })
          .eq("id", existing.id)
      } else {
        // Create new share record
        await supabase.from("product_shares").insert({
          product_id: productId,
          platform,
          share_count: 1,
        })
      }
    } catch (error) {
      console.error("[v0] Error tracking share:", error)
    }
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  const handleShare = async (platform: string) => {
    setIsSharing(true)
    await trackShare(platform)

    let shareLink = ""
    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(productName)}`
        break
      case "pinterest":
        shareLink = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(productImage || "")}&description=${encodeURIComponent(productName)}`
        break
    }

    if (shareLink) {
      window.open(shareLink, "_blank", "width=600,height=400")
    }

    setTimeout(() => setIsSharing(false), 1000)
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          url: shareUrl,
        })
        await trackShare("native")
      } catch (error) {
        console.error("[v0] Native share error:", error)
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareUrl)
      toast.success("Link copied to clipboard!")
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Share:</span>
      <Button size="sm" variant="outline" onClick={() => handleShare("facebook")} disabled={isSharing}>
        <Facebook className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="outline" onClick={() => handleShare("twitter")} disabled={isSharing}>
        <Twitter className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="outline" onClick={() => handleShare("pinterest")} disabled={isSharing}>
        <Instagram className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="outline" onClick={handleNativeShare}>
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
