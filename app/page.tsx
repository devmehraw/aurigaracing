import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Award, Hammer, Globe, Headphones, ArrowRight, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { FeaturedProductsCarousel } from "@/components/featured-products-carousel"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featuredProducts, error: featuredError } = await supabase
    .from("products")
    .select("id, slug, name, image_url, price_in_cents")
    .eq("is_active", true)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(10)

  if (featuredError) {
    console.error("[v0] Error fetching featured products:", featuredError)
  }

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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-[520px] w-full overflow-hidden bg-black md:h-[600px]">
        <Image
          src="/home/hero-skater.png"
          alt="Professional speed skater racing on a track"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />

        <div className="container relative mx-auto flex h-full items-center px-4">
          <div className="max-w-md rounded-2xl bg-background/95 p-8 shadow-2xl backdrop-blur-sm md:p-10">
            <h1 className="text-4xl font-extrabold uppercase leading-[1.05] tracking-tight text-foreground md:text-5xl text-balance">
              Precision Engineered. Race Proven.
            </h1>
            <p className="mt-4 text-sm font-medium uppercase tracking-wide text-muted-foreground md:text-base leading-relaxed">
              Dominate the track. Explore our elite skating tech.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-6 rounded-md bg-[#bd9131] px-8 text-white hover:bg-[#a17d27]"
            >
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>

        {/* New Collection badge */}
        <div className="absolute bottom-6 right-6 flex items-center gap-3 rounded-xl bg-background/95 px-5 py-3 shadow-xl backdrop-blur-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#bd9131]">New</p>
            <p className="text-sm font-bold uppercase tracking-wide text-foreground">Collection</p>
          </div>
          <div
            className="h-8 w-8 rounded"
            style={{
              backgroundImage:
                "repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)",
              backgroundSize: "8px 8px",
            }}
            aria-hidden="true"
          />
        </div>
      </section>

      {/* Featured Products carousel */}
      {featuredProducts && featuredProducts.length > 0 && (
        <FeaturedProductsCarousel products={featuredProducts} />
      )}

      {/* New Arrivals */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">New Arrivals</h2>
            <p className="mt-3 text-muted-foreground">The latest gear from the Auriga Racing lineup</p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {newArrivals.map((item) => (
              <div
                key={item.title}
                className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-md transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 flex-1 leading-relaxed text-muted-foreground">{item.description}</p>
                  <Button
                    asChild
                    className="mt-5 w-fit rounded-md bg-[#bd9131] px-6 text-white hover:bg-[#a17d27]"
                  >
                    <Link href={item.href}>Shop Now</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Collection */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold uppercase tracking-wide text-foreground md:text-5xl">
              Shop by Collection
            </h2>
            <p className="mt-3 text-muted-foreground">Discover our specialized equipment collections</p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            {collections.map((collection) => (
              <Link
                key={collection.label}
                href={collection.href}
                className="group relative block h-56 overflow-hidden rounded-2xl bg-black md:h-64"
              >
                <Image
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.label}
                  fill
                  className="object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-2xl font-bold text-white">{collection.label}</h3>
                  <span className="mt-1 inline-flex items-center text-sm font-medium text-[#e0b64f] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Explore <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Precision Boots feature */}
      <section className="relative overflow-hidden bg-neutral-950 py-16 text-white md:py-24">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #333 0px, #333 2px, transparent 2px, transparent 10px)",
          }}
          aria-hidden="true"
        />
        <div className="container relative mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold uppercase tracking-wide md:text-5xl">Precision Boots</h2>
            <p className="mt-3 text-neutral-400">Handcrafted carbon fiber built for champions</p>
          </div>
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 md:flex-row">
            <div className="relative h-64 w-full flex-1 md:h-80">
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
              <h3 className="text-3xl font-bold text-[#e0b64f]">Auriga Racing Pro</h3>
              <ul className="mt-6 space-y-4">
                {["Heat-moldable carbon", "Integrated ankle support", "High-strength materials"].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-lg text-neutral-200">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#bd9131]">
                      <Check className="h-4 w-4 text-white" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                className="mt-8 rounded-md bg-[#bd9131] px-8 text-white hover:bg-[#a17d27]"
              >
                <Link href="/products/category/boots">Shop Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Frames feature */}
      <section className="bg-neutral-900 py-16 text-white md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 md:flex-row">
            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-widest text-[#e0b64f]">Performance Frames</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl text-balance">
                Auriga Racing OCCULT Frames
              </h2>
              <p className="mt-4 leading-relaxed text-neutral-300">
                Laser-engraved, precision-machined aluminum frames engineered for exceptional performance in
                intense high-speed racing.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-6 rounded-md bg-[#bd9131] px-8 text-white hover:bg-[#a17d27]"
              >
                <Link href="/products/category/frames">Shop Now</Link>
              </Button>
            </div>
            <div className="relative h-56 w-full flex-1 md:h-72">
              <Image src="/home/performance-frame.png" alt="Auriga Racing OCCULT frame" fill className="object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Race-Ready Kits feature */}
      <section className="relative overflow-hidden bg-muted/40 py-16 md:py-24">
        <div
          className="absolute -right-10 top-8 hidden h-24 w-72 -rotate-12 opacity-70 md:block"
          style={{
            backgroundImage: "repeating-conic-gradient(#171717 0% 25%, #e0b64f 0% 50%)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden="true"
        />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 md:flex-row">
            <div className="flex-1">
              <h2 className="text-3xl font-bold uppercase tracking-wide text-foreground md:text-4xl text-balance">
                Race-Ready Kits
              </h2>
              <h3 className="mt-3 text-2xl font-bold text-foreground">Auriga Racing Cadet Inline Skate</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                The quality and versatility of a complete race setup for both training and competition, with
                transformation from a three-wheel to four-wheel configuration.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-6 rounded-md bg-[#bd9131] px-8 text-white hover:bg-[#a17d27]"
              >
                <Link href="/products">Shop Now</Link>
              </Button>
            </div>
            <div className="relative h-56 w-full flex-1 md:h-72">
              <Image src="/home/cadet-skate.png" alt="Auriga Racing Cadet inline skate" fill className="object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Auriga Racing */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl text-balance">
            Why Choose Auriga Racing
          </h2>
          <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#bd9131]/15">
                    <Icon className="h-8 w-8 text-[#bd9131]" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
