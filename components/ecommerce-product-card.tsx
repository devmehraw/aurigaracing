"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getImageKitUrl } from "@/lib/imagekit"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Heart, ShoppingCart, Eye, Star, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface EcommerceProductCardProps {
  product: {
    id: string
    slug: string
    name: string
    image_url: string
    short_description?: string
    brand?: string
    price_in_cents: number
    original_price_in_cents?: number
    discount_percentage?: number
    stock_quantity?: number
    is_featured?: boolean
    is_new?: boolean
    rating?: number
    review_count?: number
  }
  variant?: "default" | "compact"
  onAddToCart?: (productId: string) => void
  onAddToWishlist?: (productId: string) => void
  onQuickView?: (productId: string) => void
}

export function EcommerceProductCard({
  product,
  variant = "default",
  onAddToCart,
  onAddToWishlist,
  onQuickView,
}: EcommerceProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const isOnSale = product.original_price_in_cents && product.original_price_in_cents > product.price_in_cents
  const isOutOfStock = product.stock_quantity !== undefined && product.stock_quantity <= 0
  const isLowStock = product.stock_quantity !== undefined && product.stock_quantity > 0 && product.stock_quantity <= 5

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isOutOfStock && onAddToCart) {
      onAddToCart(product.id)
    }
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    if (onAddToWishlist) {
      onAddToWishlist(product.id)
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onQuickView) {
      onQuickView(product.id)
    }
  }

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group relative overflow-hidden border-2 border-transparent hover:border-[#bd9131]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#bd9131]/20 h-full">
        {/* Image Section */}
        <div className="relative aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 overflow-hidden">
          {/* Product Image */}
          <Image
            src={
              getImageKitUrl(product.image_url, {
                height: variant === "compact" ? 400 : 500,
                width: variant === "compact" ? 400 : 500,
              }) || "/placeholder.svg"
            }
            alt={product.name}
            fill
            className={cn(
              "object-cover transition-all duration-700 ease-out",
              "group-hover:scale-110",
              imageLoaded ? "opacity-100" : "opacity-0",
            )}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {isOnSale && product.discount_percentage && (
              <Badge className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 shadow-lg">
                -{product.discount_percentage}% OFF
              </Badge>
            )}
            {product.is_new && (
              <Badge className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 shadow-lg">NEW</Badge>
            )}
            {product.is_featured && (
              <Badge className="bg-[#bd9131] hover:bg-[#a17d27] text-white font-bold px-3 py-1.5 shadow-lg flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                FEATURED
              </Badge>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
            {/* Wishlist Button */}
            <Button
              size="icon"
              variant="secondary"
              className={cn(
                "h-10 w-10 rounded-full shadow-lg backdrop-blur-sm bg-white/90 dark:bg-black/90",
                "opacity-0 group-hover:opacity-100 translate-x-12 group-hover:translate-x-0",
                "transition-all duration-300 delay-75",
                isWishlisted && "text-red-500",
              )}
              onClick={handleWishlist}
            >
              <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
            </Button>

            {/* Quick View Button */}
            <Button
              size="icon"
              variant="secondary"
              className={cn(
                "h-10 w-10 rounded-full shadow-lg backdrop-blur-sm bg-white/90 dark:bg-black/90",
                "opacity-0 group-hover:opacity-100 translate-x-12 group-hover:translate-x-0",
                "transition-all duration-300 delay-100",
              )}
              onClick={handleQuickView}
            >
              <Eye className="h-5 w-5" />
            </Button>
          </div>

          {/* Stock Status Badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20">
              <Badge className="bg-red-600 text-white font-bold px-6 py-3 text-lg shadow-2xl">OUT OF STOCK</Badge>
            </div>
          )}

          {/* Add to Cart Button - Appears on hover */}
          {!isOutOfStock && (
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10 opacity-0 group-hover:opacity-100 translate-y-12 group-hover:translate-y-0 transition-all duration-500">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-[#bd9131] hover:bg-[#a17d27] text-white font-bold py-6 shadow-2xl"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="p-4 space-y-3">
          {/* Brand */}
          {product.brand && (
            <p className="text-sm text-[#bd9131] font-semibold uppercase tracking-wider">{product.brand}</p>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem] group-hover:text-[#bd9131] transition-colors duration-300">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating !== undefined && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(product.rating!)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600",
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)} {product.review_count && `(${product.review_count})`}
              </span>
            </div>
          )}

          {/* Price Section */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex flex-col gap-1">
              {isOnSale ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#bd9131]">
                      ${(product.price_in_cents / 100).toFixed(2)}
                    </span>
                    <span className="text-base text-muted-foreground line-through">
                      ${(product.original_price_in_cents! / 100).toFixed(2)}
                    </span>
                  </div>
                  <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                    Save ${((product.original_price_in_cents! - product.price_in_cents) / 100).toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-[#bd9131]">${(product.price_in_cents / 100).toFixed(2)}</span>
              )}
            </div>

            {/* Stock Indicator */}
            {isLowStock && (
              <Badge variant="outline" className="border-orange-500 text-orange-500">
                Only {product.stock_quantity} left
              </Badge>
            )}
          </div>

          {/* Free Shipping Badge */}
          {product.price_in_cents >= 5000 && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              Free Shipping
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
