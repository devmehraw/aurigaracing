import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Award,
  Hammer,
  Globe,
  Headphones,
  ArrowRight,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Lock,
  Star,
  Quote,
  Flame,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { FeaturedProductsCarousel } from "@/components/featured-products-carousel"
import { EcommerceProductCard } from "@/components/ecommerce-product-card"
import { SkateWheelMark } from "@/components/decor/skate-wheel-mark"
import { HomeHeroSlider } from "@/components/home-hero-slider"

export default async function HomePage() {
  const supabase = await createClient()

  const baseFields =
    "id, slug, name, image_url, brand, price_in_cents, original_price_in_cents, discount_percentage, stock_quantity, is_featured, is_new, rating, review_count"

  const [{ data: featuredProducts, error: featuredError }, { data: bestSellers }, { data: dealProducts }] =
    await Promise.all([
      supabase
        .from("products")
        .select("id, slug, name, image_url, price_in_cents")
        .eq("is_active", true)
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("products")
        .select(baseFields)
        .eq("is_active", true)
        .eq("status", "published")
        .eq("is_featured", true)
        .order("rating", { ascending: false })
        .limit(4),
      supabase
        .from("products")
        .select(baseFields)
        .eq("is_active", true)
        .eq("status", "published")
        .eq("deal_of_the_day", true)
        .limit(4),
    ])

  if (featuredError) {
    console.error("[v0] Error fetching featured products:", featuredError)
  }

  const trustBar = [
    { icon: Truck, label: "Free Worldwide Shipping" },
    { icon: ShieldCheck, label: "2-Year Warranty" },
    { icon: RotateCcw, label: "30-Day Returns" },
    { icon: Lock, label: "Secure Checkout" },
  ]

  const newArrivals = [
    {
      title: "Featured Helmet",
      description: "Aerodynamic protection engineered for elite speed skating performance.",
      image: "/home/arrival-helmet.png",
      href: "/products/category/helmets",
    },
    {
      title: "Race Boots",
      description: "Handcrafted carbon fiber boots built for precision and control on the track.",
      image: "/home/arrival-boots.png",
      href: "/products/category/boots",
    },
    {
      title: "Elite Wheels",
      description: "Professional grade wheels tuned for maximum speed and grip in any condition.",
      image: "/home/arrival-wheels.png",
      href: "/products/category/wheels",
    },
  ]

  const collections = [
    { label: "Boots", image: "/home/arrival-boots.png", href: "/products/category/boots" },
    { label: "Frames", image: "/home/collection-frames.png", href: "/products/category/frames" },
    { label: "Wheels", image: "/home/arrival-wheels.png", href: "/products/category/wheels" },
    { label: "Helmets", image: "/home/arrival-helmet.png", href: "/products/category/helmets" },
    { label: "Skate Packages", image: "/home/cadet-skate.png", href: "/products" },
    { label: "Accessories", image: "/home/collection-accessories.png", href: "/products" },
  ]

  const whyChoose = [
    { icon: Award, title: "Race Proven Technology", description: "Engineered and tested by champions." },
    { icon: Hammer, title: "Handcrafted Perfection", description: "Purely handmade with the finest materials." },
    { icon: Globe, title: "Worldwide Shipping", description: "Delivering elite gear across the globe." },
    { icon: Headphones, title: "24/7 Expert Support", description: "Dedicated support whenever you need it." },
  ]

  const testimonials = [
    {
      name: "Marcus Reyes",
      role: "National Team Sprinter",
      image: "/home/athlete-1.png",
      quote: "The OCCULT frames shaved real seconds off my splits. Nothing on the market feels this locked-in.",
    },
    {
      name: "Elena Cruz",
      role: "Marathon Skater",
      image: "/home/athlete-2.png",
      quote: "Auriga boots molded to my feet in one session. Support, comfort, precision — every box checked.",
    },
    {
      name: "Coach D. Whitfield",
      role: "Junior Development Coach",
      image: "/home/athlete-3.png",
      quote: "I outfit my entire roster in Auriga. Consistent quality and it holds up to a full competitive season.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero slider */}
      <HomeHeroSlider />

      {/* Trust bar */}
      <section className="relative overflow-hidden border-y border-border/60 bg-neutral-950 text-white">
        <SkateWheelMark className="pointer-events-none absolute -right-6 top-1/2 hidden h-20 w-20 -translate-y-1/2 text-white/[0.06] animate-spin-slow md:block" />
        <div className="container relative mx-auto grid grid-cols-2 gap-3 px-4 py-3 sm:grid-cols-4">
          {trustBar.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex items-center justify-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-[#e0b64f]" />
                <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-300">
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Featured Products carousel */}
      {featuredProducts && featuredProducts.length > 0 && (
        <FeaturedProductsCarousel products={featuredProducts} />
      )}

      {/* Best Sellers */}
      {bestSellers && bestSellers.length > 0 && (
        <section className="relative overflow-hidden bg-muted/40 py-10 md:py-14">
          <SkateWheelMark className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 text-foreground/[0.04] animate-spin-slow" />
          <div className="container relative mx-auto px-4">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#bd9131]">
                  Top Rated
                </p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-foreground md:text-3xl">Best Sellers</h2>
              </div>
              <Link
                href="/products"
                className="hidden items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#bd9131] hover:text-[#a17d27] sm:flex"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {bestSellers.map((product) => (
                <EcommerceProductCard key={product.id} product={product} variant="compact" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="relative overflow-hidden bg-background py-10 md:py-14">
        <div
          className="pointer-events-none absolute -left-8 bottom-0 h-24 w-48 opacity-[0.05]"
          style={{
            backgroundImage: "repeating-linear-gradient(-45deg, #bd9131 0px, #bd9131 2px, transparent 2px, transparent 12px)",
          }}
          aria-hidden="true"
        />
        <div className="container relative mx-auto px-4">
          <div className="mb-6 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#bd9131]">Fresh Off the Line</p>
            <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              New Arrivals
            </h2>
          </div>

          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
            {newArrivals.map((item) => (
              <div
                key={item.title}
                className="group flex flex-col overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border/60 transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-serif text-base font-bold text-foreground">{item.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  <Button
                    asChild
                    size="sm"
                    className="mt-3 w-fit rounded-md bg-[#bd9131] px-4 text-xs text-white hover:bg-[#a17d27]"
                  >
                    <Link href={item.href}>Shop Now</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Limited Time Offers */}
      {dealProducts && dealProducts.length > 0 && (
        <section className="relative overflow-hidden bg-neutral-950 py-10 text-white md:py-14">
          <div
            className="absolute -left-16 -top-16 h-40 w-40 rotate-12 opacity-20"
            style={{
              backgroundImage: "repeating-conic-gradient(#e0b64f 0% 25%, transparent 0% 50%)",
              backgroundSize: "16px 16px",
            }}
            aria-hidden="true"
          />
          <div className="container relative mx-auto px-4">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#e0b64f]">
                  <Flame className="h-3 w-3" /> Limited Time
                </p>
                <h2 className="mt-1 font-serif text-2xl font-bold md:text-3xl">Race Day Offers</h2>
              </div>
              <Link
                href="/products?deal=true"
                className="hidden items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#e0b64f] hover:text-white sm:flex"
              >
                Shop Deals <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {dealProducts.map((product) => (
                <EcommerceProductCard key={product.id} product={product} variant="compact" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shop by Collection */}
      <section className="relative overflow-hidden bg-background py-10 md:py-14">
        <SkateWheelMark className="pointer-events-none absolute -left-12 top-1/3 h-48 w-48 text-foreground/[0.035] animate-spin-slow" />
        <div className="container relative mx-auto px-4">
          <div className="mb-6 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#bd9131]">Curated Gear</p>
            <h2 className="mt-1 font-serif text-2xl font-bold uppercase tracking-wide text-foreground md:text-3xl">
              Shop by Collection
            </h2>
          </div>

          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
            {collections.map((collection) => (
              <Link
                key={collection.label}
                href={collection.href}
                className="group relative block h-40 overflow-hidden rounded-xl bg-black md:h-48"
              >
                <Image
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.label}
                  fill
                  className="object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-serif text-lg font-bold text-white">{collection.label}</h3>
                  <span className="mt-0.5 inline-flex items-center text-xs font-medium text-[#e0b64f] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Explore <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Precision Boots feature */}
      <section className="relative overflow-hidden bg-neutral-950 py-10 text-white md:py-14">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #333 0px, #333 2px, transparent 2px, transparent 10px)",
          }}
          aria-hidden="true"
        />
        <SkateWheelMark className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 text-[#e0b64f]/10 animate-spin-slow" />
        <div className="container relative mx-auto px-4">
          <div className="mb-6 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#e0b64f]">Signature Series</p>
            <h2 className="mt-1 font-serif text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Precision Boots
            </h2>
          </div>
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 md:flex-row">
            <div className="relative h-52 w-full flex-1 md:h-64">
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background: "radial-gradient(circle at center, rgba(189,145,49,0.25), transparent 65%)",
                }}
                aria-hidden="true"
              />
              <Image
                src="/home/precision-boot.png"
                alt="Auriga Racing Pro carbon fiber boot"
                fill
                className="relative object-contain"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-xl font-bold text-[#e0b64f]">Auriga Racing Pro</h3>
              <ul className="mt-3 space-y-2.5">
                {["Heat-moldable carbon", "Integrated ankle support", "High-strength materials"].map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-neutral-200">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#bd9131]">
                      <Check className="h-3 w-3 text-white" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild size="sm" className="mt-5 rounded-md bg-[#bd9131] px-6 text-white hover:bg-[#a17d27]">
                <Link href="/products/category/boots">Shop Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Frames feature */}
      <section className="relative overflow-hidden bg-neutral-900 py-10 text-white md:py-14">
        <div className="container relative mx-auto px-4">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 md:flex-row">
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#e0b64f]">Performance Frames</p>
              <h2 className="mt-2 font-serif text-2xl font-bold leading-tight md:text-3xl text-balance">
                Auriga Racing OCCULT Frames
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                Laser-engraved, precision-machined aluminum frames engineered for exceptional performance in
                intense high-speed racing.
              </p>
              <Button asChild size="sm" className="mt-5 rounded-md bg-[#bd9131] px-6 text-white hover:bg-[#a17d27]">
                <Link href="/products/category/frames">Shop Now</Link>
              </Button>
            </div>
            <div className="relative h-44 w-full flex-1 md:h-56">
              <span className="absolute top-[20%] h-[2px] w-16 bg-gradient-to-r from-transparent via-[#e0b64f] to-transparent animate-speed-streak" />
              <span className="absolute top-[70%] h-[2px] w-20 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-speed-streak [animation-delay:1s]" />
              <Image src="/home/performance-frame.png" alt="Auriga Racing OCCULT frame" fill className="relative object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Race-Ready Kits feature */}
      <section className="relative overflow-hidden bg-muted/40 py-10 md:py-14">
        <div
          className="absolute -right-10 top-6 hidden h-20 w-60 -rotate-12 opacity-70 md:block"
          style={{
            backgroundImage: "repeating-conic-gradient(#171717 0% 25%, #e0b64f 0% 50%)",
            backgroundSize: "20px 20px",
          }}
          aria-hidden="true"
        />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 md:flex-row">
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#bd9131]">Complete Setup</p>
              <h2 className="mt-1 font-serif text-2xl font-bold uppercase tracking-wide text-foreground md:text-3xl text-balance">
                Race-Ready Kits
              </h2>
              <h3 className="mt-2 text-lg font-bold text-foreground">Auriga Racing Cadet Inline Skate</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The quality and versatility of a complete race setup for both training and competition, with
                transformation from a three-wheel to four-wheel configuration.
              </p>
              <Button asChild size="sm" className="mt-5 rounded-md bg-[#bd9131] px-6 text-white hover:bg-[#a17d27]">
                <Link href="/products">Shop Now</Link>
              </Button>
            </div>
            <div className="relative h-44 w-full flex-1 md:h-56">
              <Image src="/home/cadet-skate.png" alt="Auriga Racing Cadet inline skate" fill className="object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative overflow-hidden bg-background py-10 md:py-14">
        <SkateWheelMark className="pointer-events-none absolute -bottom-16 right-1/4 h-40 w-40 text-foreground/[0.035] animate-spin-slow" />
        <div className="container relative mx-auto px-4">
          <div className="mb-6 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#bd9131]">Trusted On Track</p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-foreground md:text-3xl">What Athletes Say</h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-xl border border-border/60 bg-card p-5 shadow-sm"
              >
                <Quote className="h-5 w-5 text-[#bd9131]/50" />
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{t.quote}</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                    <Image src={t.image || "/placeholder.svg"} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-[#bd9131] text-[#bd9131]" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Auriga Racing */}
      <section className="relative overflow-hidden bg-muted/40 py-10 md:py-14">
        <SkateWheelMark className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 text-foreground/[0.04] animate-spin-slow" />
        <SkateWheelMark className="pointer-events-none absolute -bottom-14 right-0 h-40 w-40 text-foreground/[0.04] animate-spin-slow [animation-direction:reverse]" />
        <div className="container relative mx-auto px-4">
          <div className="mb-6 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#bd9131]">The Difference</p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-foreground md:text-3xl text-balance">
              Why Choose Auriga Racing
            </h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#bd9131]/15">
                    <Icon className="h-5 w-5 text-[#bd9131]" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Race Stats strip */}
      <section className="relative overflow-hidden bg-neutral-950 py-8 text-white md:py-10">
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: "linear-gradient(90deg, transparent, #bd9131, transparent)" }}
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute top-1/2 h-[1px] w-24 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#e0b64f]/60 to-transparent animate-speed-streak"
          aria-hidden="true"
        />
        <div className="container relative mx-auto grid grid-cols-2 gap-6 px-4 text-center sm:grid-cols-4">
          {[
            { value: "12,400+", label: "Athletes Equipped" },
            { value: "38", label: "Countries Shipped" },
            { value: "4.9/5", label: "Average Rating" },
            { value: "07", label: "World Records Set" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="font-serif text-2xl font-bold text-[#e0b64f] md:text-3xl">{stat.value}</span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
