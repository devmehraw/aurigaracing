"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getImageKitUrl } from "@/lib/imagekit"

interface FeaturedProduct {
  id: string
  slug: string
  name: string
  image_url: string
  price_in_cents: number
}

export function FeaturedProductsCarousel({ products }: { products: FeaturedProduct[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" })
  }

  return (
    <section className="bg-background py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Featured Products
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-transparent"
              onClick={() => scroll("left")}
              aria-label="Scroll featured products left"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              className="h-10 w-10 rounded-full bg-[#bd9131] text-white hover:bg-[#a17d27]"
              onClick={() => scroll("right")}
              aria-label="Scroll featured products right"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[75%] shrink-0 snap-start sm:w-[45%] md:w-[30%] lg:w-[23%]"
            >
              <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow duration-300 hover:shadow-xl">
                <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-muted">
                  <Image
                    src={getImageKitUrl(product.image_url, { height: 400, width: 400 }) || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="line-clamp-2 min-h-[2.75rem] font-semibold leading-snug text-foreground transition-colors group-hover:text-[#bd9131]">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="mt-2 text-lg font-bold text-foreground">
                    ${(product.price_in_cents / 100).toFixed(2)}
                  </p>
                  <Button
                    asChild
                    className="mt-4 w-fit rounded-md bg-[#bd9131] px-6 text-white hover:bg-[#a17d27]"
                  >
                    <Link href={`/products/${product.slug}`}>Shop Now</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
