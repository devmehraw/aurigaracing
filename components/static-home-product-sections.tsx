import Link from "next/link"
import { ArrowRight, Flame, Sparkles, Timer } from "lucide-react"
import { EcommerceProductCard } from "@/components/ecommerce-product-card"

type StaticProduct = {
  id: string
  slug: string
  name: string
  image_url: string
  brand: string
  price_in_cents: number
  original_price_in_cents?: number
  discount_percentage?: number
  stock_quantity: number
  is_featured?: boolean
  is_new?: boolean
  rating: number
  review_count: number
}

const productGroups: Array<{
  eyebrow: string
  title: string
  icon: typeof Timer
  description: string
  tone: string
  products: StaticProduct[]
}> = [
  {
    eyebrow: "Limited run",
    title: "Deal of the Day",
    icon: Timer,
    description: "Race-ready essentials, marked down while today's stock lasts.",
    tone: "bg-neutral-950 text-white",
    products: [
      { id: "deal-1", slug: "velocity-carbon-frame", name: "Velocity Carbon Frame", image_url: "/home/collection-frames.png", brand: "AURIGA", price_in_cents: 18900, original_price_in_cents: 24900, discount_percentage: 24, stock_quantity: 8, rating: 4.9, review_count: 42 },
      { id: "deal-2", slug: "apex-race-wheels", name: "Apex Race Wheels", image_url: "/home/arrival-wheels.png", brand: "AURIGA", price_in_cents: 9900, original_price_in_cents: 12900, discount_percentage: 23, stock_quantity: 12, rating: 4.8, review_count: 36 },
      { id: "deal-3", slug: "trackline-helmet", name: "Trackline Aero Helmet", image_url: "/home/arrival-helmet.png", brand: "AURIGA", price_in_cents: 7900, original_price_in_cents: 9900, discount_percentage: 20, stock_quantity: 14, rating: 4.7, review_count: 28 },
      { id: "deal-4", slug: "race-lace-kit", name: "Race Lace Kit", image_url: "/home/collection-accessories.png", brand: "AURIGA", price_in_cents: 2900, original_price_in_cents: 3900, discount_percentage: 26, stock_quantity: 20, rating: 4.6, review_count: 19 },
    ],
  },
  {
    eyebrow: "Fresh off the line",
    title: "New Arrivals",
    icon: Sparkles,
    description: "The latest equipment built for your next personal best.",
    tone: "bg-background text-foreground",
    products: [
      { id: "new-1", slug: "occult-carbon-boots", name: "Occult Carbon Boots", image_url: "/home/arrival-boots.png", brand: "AURIGA", price_in_cents: 32900, stock_quantity: 10, is_new: true, rating: 4.9, review_count: 17 },
      { id: "new-2", slug: "cadet-skate-package", name: "Cadet Skate Package", image_url: "/home/cadet-skate.png", brand: "AURIGA", price_in_cents: 24900, stock_quantity: 7, is_new: true, rating: 4.8, review_count: 11 },
      { id: "new-3", slug: "pro-fit-helmet", name: "Pro Fit Helmet", image_url: "/home/arrival-helmet.png", brand: "AURIGA", price_in_cents: 10900, stock_quantity: 16, is_new: true, rating: 4.7, review_count: 9 },
      { id: "new-4", slug: "precision-wheel-set", name: "Precision Wheel Set", image_url: "/home/arrival-wheels.png", brand: "AURIGA", price_in_cents: 13900, stock_quantity: 13, is_new: true, rating: 4.8, review_count: 14 },
    ],
  },
  {
    eyebrow: "Trending in the peloton",
    title: "Hot Products",
    icon: Flame,
    description: "The gear serious skaters are choosing right now.",
    tone: "bg-muted/40 text-foreground",
    products: [
      { id: "hot-1", slug: "elite-race-boots", name: "Elite Race Boots", image_url: "/home/arrival-boots.png", brand: "AURIGA", price_in_cents: 28900, stock_quantity: 9, is_featured: true, rating: 5, review_count: 64 },
      { id: "hot-2", slug: "championship-frame", name: "Championship Frame", image_url: "/home/collection-frames.png", brand: "AURIGA", price_in_cents: 21900, stock_quantity: 6, is_featured: true, rating: 4.9, review_count: 51 },
      { id: "hot-3", slug: "sprint-wheel-pack", name: "Sprint Wheel Pack", image_url: "/home/arrival-wheels.png", brand: "AURIGA", price_in_cents: 11900, stock_quantity: 18, is_featured: true, rating: 4.8, review_count: 47 },
      { id: "hot-4", slug: "aero-race-helmet", name: "Aero Race Helmet", image_url: "/home/arrival-helmet.png", brand: "AURIGA", price_in_cents: 12900, stock_quantity: 11, is_featured: true, rating: 4.8, review_count: 39 },
    ],
  },
]

export function StaticHomeProductSections() {
  return (
    <div className="border-y border-border/60">
      {productGroups.map(({ eyebrow, title, icon: Icon, description, tone, products }) => (
        <section key={title} className={`relative overflow-hidden py-10 md:py-14 ${tone}`}>
          <div className="container relative mx-auto px-4">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#bd9131]">
                  <Icon className="h-3.5 w-3.5" />
                  {eyebrow}
                </p>
                <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
              <Link href="/products" className="hidden items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#bd9131] hover:text-[#a17d27] sm:flex">
                Shop all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {products.map((product) => <EcommerceProductCard key={product.id} product={product} variant="compact" />)}
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}

export default StaticHomeProductSections
