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
    <section className="bg-background py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#bd9131]">Just In</p>
            <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-foreground md:text-3xl text-balance">
              Featured Products
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-transparent"
              onClick={() => scroll("left")}
              aria-label="Scroll featured products left"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-[#bd9131] text-white hover:bg-[#a17d27]"
              onClick={() => scroll("right")}
              aria-label="Scroll featured products right"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[70%] shrink-0 snap-start sm:w-[40%] md:w-[27%] lg:w-[21%]"
            >
              <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow duration-300 hover:shadow-lg">
                <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-muted">
                  <Image
                    src={getImageKitUrl(product.image_url, { height: 400, width: 400 }) || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-3.5">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-[#bd9131]">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="mt-1.5 text-base font-bold text-foreground">
                    ${(product.price_in_cents / 100).toFixed(2)}
                  </p>
                  <Button
                    asChild
                    size="sm"
                    className="mt-3 w-fit rounded-md bg-[#bd9131] px-4 text-xs text-white hover:bg-[#a17d27]"
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
