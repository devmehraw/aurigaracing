"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ProductCard } from "./product-card"
import { Skeleton } from "./ui/skeleton"

interface Product {
  id: string
  name: string
  slug: string
  brand: string
  price_in_cents: number
  original_price_in_cents: number
  discount_percentage: number
  image_url: string
  stock_quantity: number
}

export function RecentlyViewedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentlyViewed() {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("recently_viewed")
        .select(`
          product_id,
          products (
            id,
            name,
            slug,
            brand,
            price_in_cents,
            original_price_in_cents,
            discount_percentage,
            image_url,
            stock_quantity
          )
        `)
        .eq("user_id", user.id)
        .order("viewed_at", { ascending: false })
        .limit(6)

      if (!error && data) {
        const productsList = data.map((item: any) => item.products).filter((p: any) => p !== null)
        setProducts(productsList)
      }

      setLoading(false)
    }

    fetchRecentlyViewed()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Recently Viewed</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Recently Viewed</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
