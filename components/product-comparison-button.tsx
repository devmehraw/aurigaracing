"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "./ui/button"
import { GitCompare, Check } from "lucide-react"
import { toast } from "sonner"

interface ProductComparisonButtonProps {
  productId: string
}

export function ProductComparisonButton({ productId }: ProductComparisonButtonProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [loading, setLoading] = useState(false)

  async function toggleComparison() {
    setLoading(true)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      toast.error("Please login to compare products")
      setLoading(false)
      return
    }

    if (isAdded) {
      const { error } = await supabase
        .from("product_comparisons")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId)

      if (!error) {
        setIsAdded(false)
        toast.success("Removed from comparison")
      }
    } else {
      const { error } = await supabase.from("product_comparisons").insert({ user_id: user.id, product_id: productId })

      if (!error) {
        setIsAdded(true)
        toast.success("Added to comparison")
      } else if (error.code === "23505") {
        toast.info("Already in comparison")
      }
    }

    setLoading(false)
  }

  return (
    <Button variant={isAdded ? "default" : "outline"} size="sm" onClick={toggleComparison} disabled={loading}>
      {isAdded ? <Check className="h-4 w-4 mr-2" /> : <GitCompare className="h-4 w-4 mr-2" />}
      {isAdded ? "In Comparison" : "Compare"}
    </Button>
  )
}
