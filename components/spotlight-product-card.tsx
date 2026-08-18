"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getImageKitUrl } from "@/lib/imagekit"
import Image from "next/image"
import Link from "next/link"
import { useRef, useState } from "react"

interface SpotlightProductCardProps {
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
  }
  variant?: "default" | "compact"
}

export function SpotlightProductCard({ product, variant = "default" }: SpotlightProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <Link href={`/products/${product.slug}`}>
      <Card
        ref={cardRef}
        className="h-full overflow-hidden group relative border-2 border-transparent hover:border-[#bd9131]/20 transition-all duration-500"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Spotlight effect */}
        {isHovered && (
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(189, 145, 49, 0.15), transparent 40%)`,
            }}
          />
        )}

        {/* Animated gradient border */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-[#bd9131] via-[#d4a947] to-[#bd9131] opacity-20 blur-xl animate-pulse" />
        </div>

        {/* Image Section */}
        <div className="relative aspect-square bg-gradient-to-br from-neutral-900 via-neutral-800 to-black overflow-hidden">
          <Image
            src={
              getImageKitUrl(product.image_url, {
                height: variant === "compact" ? 400 : 500,
                width: variant === "compact" ? 400 : 500,
              }) || "/placeholder.svg"
            }
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Discount Badge */}
          {product.discount_percentage && product.discount_percentage > 0 && (
            <div className="absolute top-4 left-4 z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-red-600 blur-md animate-pulse" />
                <div className="relative bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-2xl">
                  -{product.discount_percentage}%
                </div>
              </div>
            </div>
          )}

          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#bd9131]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content Section */}
        <CardHeader className="relative z-10">
          <CardTitle className="line-clamp-2 text-base group-hover:text-[#bd9131] transition-colors duration-300">
            {product.name}
          </CardTitle>
          {(product.short_description || product.brand) && (
            <CardDescription className="line-clamp-2 text-sm">
              {product.short_description || product.brand}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="relative z-10">
          {/* Price Section */}
          <div className="flex items-center gap-3">
            {product.original_price_in_cents && product.original_price_in_cents > product.price_in_cents ? (
              <>
                <div className="relative">
                  <div className="absolute inset-0 bg-[#bd9131]/20 blur-lg group-hover:blur-xl transition-all duration-300" />
                  <p className="relative text-xl font-bold text-[#bd9131] group-hover:scale-110 transition-transform duration-300">
                    ${(product.price_in_cents / 100).toFixed(2)}
                  </p>
                </div>
                <p className="text-base text-muted-foreground line-through">
                  ${(product.original_price_in_cents / 100).toFixed(2)}
                </p>
              </>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-[#bd9131]/20 blur-lg group-hover:blur-xl transition-all duration-300" />
                <p className="relative text-xl font-bold text-[#bd9131] group-hover:scale-110 transition-transform duration-300">
                  ${(product.price_in_cents / 100).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Hover indicator */}
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground group-hover:text-[#bd9131] transition-colors duration-300">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">View Details</span>
            <svg
              className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </CardContent>

        {/* Corner accent */}
        <div className="absolute bottom-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-tl from-[#bd9131]/30 to-transparent" />
        </div>
      </Card>
    </Link>
  )
}
