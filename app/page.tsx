import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Shield, Clock, Headphones, ArrowRight } from "lucide-react"
import { getImageKitUrl } from "@/lib/imagekit"
import { Hero3DScene } from "@/components/hero-3d-scene"
import { AnimatedParticles } from "@/components/animated-particles"
import { Hoodie3D } from "@/components/hoodie-3d"
import { createClient } from "@/lib/supabase/server"
import Bootie3D from "@/components/bootie-3d"
import { Helmet3D } from "@/components/helmet-3d"
import { HeroBannerSlider } from "@/components/hero-banner-slider" // Added hero banner slider import
import Frame3DClouds from "@/components/frame-3d-clouds"
import BootGrey3D from "@/components/boot-grey-3d" // Imported BootGrey3D
import Wheel3D from "@/components/wheel-3d" // Added Wheel3D import
import { CadetSkate3D } from "@/components/cadet-skate-3d" // Added CadetSkate3D import
import { BootBanner3D } from "@/components/boot-banner-3d"
import { EcommerceProductCard } from "@/components/ecommerce-product-card"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: dealProducts, error: dealError } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("deal_of_the_day", true)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(6)

  if (dealError) {
    console.error("[v0] Error fetching deal products:", dealError)
  }

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .is("parent_id", null)
    .order("name")

  if (categoriesError) {
    console.error("[v0] Error fetching categories:", categoriesError)
  }

  const { data: inlineSkatingCategory, error: inlineError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", "inline-speed-skating")
    .eq("is_active", true)
    .maybeSingle()

  if (inlineError) {
    console.error("[v0] Error fetching inline category:", inlineError)
  }

  const { data: bootsCategory, error: bootsError } = await supabase
    .from("categories")
    .select("id")
    .ilike("name", "%boots%")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle()

  if (bootsError) {
    console.error("[v0] Error fetching boots category:", bootsError)
  }

  const { data: framesCategory, error: framesError } = await supabase
    .from("categories")
    .select("id")
    .ilike("name", "%frames%")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle()

  if (framesError) {
    console.error("[v0] Error fetching frames category:", framesError)
  }

  const { data: wheelsCategory, error: wheelsError } = await supabase
    .from("categories")
    .select("id")
    .ilike("name", "%wheels%")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle()

  if (wheelsError) {
    console.error("[v0] Error fetching wheels category:", wheelsError)
  }

  const { data: packagesCategory, error: packagesError } = await supabase
    .from("categories")
    .select("id")
    .ilike("name", "%packages%")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle()

  if (packagesError) {
    console.error("[v0] Error fetching packages category:", packagesError)
  }

  let inlineProducts: any[] = []
  let bootsProducts: any[] = []
  let framesProducts: any[] = []
  let wheelsProducts: any[] = []
  let packagesProducts: any[] = []

  if (inlineSkatingCategory?.id) {
    // Changed variable name to match original fetch
    const { data, error } = await supabase
      .from("products")
      .select("*, product_categories!inner(category_id)") // Adjusted select to include product_categories relationship
      .eq("product_categories.category_id", inlineSkatingCategory.id) // Changed variable name
      .eq("is_active", true)
      .eq("status", "published")
      .limit(8)

    if (error) {
      console.error("[v0] Error fetching inline products:", error)
    } else {
      inlineProducts = data || []
    }
  }

  if (bootsCategory?.id) {
    const { data, error } = await supabase
      .from("products")
      .select("*, product_categories!inner(category_id)")
      .eq("product_categories.category_id", bootsCategory.id)
      .eq("is_active", true)
      .eq("status", "published")
      .limit(8)

    if (error) {
      console.error("[v0] Error fetching boots products:", error)
    } else {
      bootsProducts = data || []
    }
  }

  if (framesCategory?.id) {
    const { data, error } = await supabase
      .from("products")
      .select("*, product_categories!inner(category_id)")
      .eq("product_categories.category_id", framesCategory.id)
      .eq("is_active", true)
      .eq("status", "published")
      .limit(8)

    if (error) {
      console.error("[v0] Error fetching frames products:", error)
    } else {
      framesProducts = data || []
    }
  }

  if (wheelsCategory?.id) {
    const { data, error } = await supabase
      .from("products")
      .select("*, product_categories!inner(category_id)")
      .eq("product_categories.category_id", wheelsCategory.id)
      .eq("is_active", true)
      .eq("status", "published")
      .limit(8)

    if (error) {
      console.error("[v0] Error fetching wheels products:", error)
    } else {
      wheelsProducts = data || []
    }
  }

  if (packagesCategory?.id) {
    const { data, error } = await supabase
      .from("products")
      .select("*, product_categories!inner(category_id)")
      .eq("product_categories.category_id", packagesCategory.id)
      .eq("is_active", true)
      .eq("status", "published")
      .limit(8) // Changed limit to 8 for consistency with other product fetches

    if (error) {
      console.error("[v0] Error fetching packages products:", error)
    } else {
      packagesProducts = data || []
    }
  }

  return (
    <div className="min-h-screen">
      <section className="relative bg-black text-white overflow-hidden h-[600px] md:h-[700px]">
        {/* 3D WebGL Background */}
        <Hero3DScene />

        {/* Animated Particles */}
        <AnimatedParticles />

        {/* Banner Slider */}
        <HeroBannerSlider />
      </section>

      <section className="py-12 bg-gradient-to-r from-neutral-50 to-neutral-100">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl md:text-2xl font-light text-neutral-800 italic text-balance leading-relaxed">
            &quot;Auriga Racing: True Racing...The Outcome of several year&apos;s research and hard work&quot;
          </p>
        </div>
      </section>

      {dealProducts && dealProducts.length > 0 && (
        <section className="bg-gradient-to-br from-[#bd9131]/10 to-[#bd9131]/5 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 uppercase tracking-wide">DEAL OF THE DAY</h2>
              <p className="text-lg text-muted-foreground mb-6">Ends In</p>
              <div className="flex gap-4 justify-center items-center">
                <div className="text-center">
                  <div className="bg-black text-white px-6 py-4 rounded-lg text-2xl md:text-3xl font-bold min-w-[80px]">
                    00
                  </div>
                  <p className="text-sm mt-2 font-medium">Days</p>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="text-center">
                  <div className="bg-black text-white px-6 py-4 rounded-lg text-2xl md:text-3xl font-bold min-w-[80px]">
                    23
                  </div>
                  <p className="text-sm mt-2 font-medium">Hours</p>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="text-center">
                  <div className="bg-black text-white px-6 py-4 rounded-lg text-2xl md:text-3xl font-bold min-w-[80px]">
                    59
                  </div>
                  <p className="text-sm mt-2 font-medium">Minutes</p>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="text-center">
                  <div className="bg-black text-white px-6 py-4 rounded-lg text-2xl md:text-3xl font-bold min-w-[80px]">
                    59
                  </div>
                  <p className="text-sm mt-2 font-medium">Seconds</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {dealProducts.slice(0, 6).map((product) => (
                <EcommerceProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" className="bg-[#bd9131] hover:bg-[#a17d27] text-white px-8 py-6 text-base">
                <Link href="/products">
                  View All Deals <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-20 bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-white z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance leading-tight">
                New Auriga Racing Hoodies
              </h2>
              <p className="text-base md:text-lg mb-6 text-balance leading-relaxed">
                Look stylish and fabulous during the winters supporting a suave and elegant Auriga Racing hoodies in
                Navy Blue color.
              </p>
              <Button asChild size="lg" className="bg-[#bd9131] hover:bg-[#a17d27] text-white px-8 py-6 text-base">
                <Link href="/products">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="flex-1 relative h-[400px] w-full">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bd9131]"></div>
                  </div>
                }
              >
                <Hoodie3D />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {categories && categories.length > 0 && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-wide">SHOP BY CATEGORY</h2>
              <p className="text-base text-muted-foreground">Explore Our Complete Product Range</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
              {categories.map((category) => (
                <Link key={category.id} href={`/products/category/${category.slug}`}>
                  <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 h-full">
                    <div className="aspect-square bg-muted overflow-hidden relative">
                      <Image
                        src={getImageKitUrl(category.image_url, { height: 400, width: 400 || "/placeholder.svg" })}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardHeader className="text-center">
                      <CardTitle className="text-lg group-hover:text-[#bd9131] transition-colors">
                        {category.name}
                      </CardTitle>
                      {category.description && (
                        <CardDescription className="line-clamp-2 leading-relaxed text-sm">
                          {category.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="text-center">
                      <Button className="w-full bg-[#bd9131] hover:bg-[#a17d27] text-white text-sm">
                        Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-20 bg-gradient-to-br from-neutral-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance leading-tight">
                Auriga Racing Ankle Booties
              </h2>
              <p className="text-base md:text-lg mb-6 text-balance leading-relaxed text-gray-200">
                Auriga Racing Ankle Booties are made with special kind of fabric bonded with superfine microfiber Lycra
                inside the booties making it the most advance product for the anti-friction and anti-blisters properties
                for your feet.
              </p>
              <Button asChild size="lg" className="bg-[#bd9131] hover:bg-[#a17d27] text-white px-8 py-6 text-base">
                <Link href="/products">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="flex-1 relative h-[400px] w-full">
              <Bootie3D />
            </div>
          </div>
        </div>
      </section>

      {inlineProducts && inlineProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-wide">INLINE SPEED SKATING</h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Discover our premium collection of inline speed skating equipment
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
              {inlineProducts.slice(0, 8).map((product: any) => (
                <EcommerceProductCard key={product.id} product={product} variant="compact" />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" className="bg-[#bd9131] hover:bg-[#a17d27] text-white px-8 py-6 text-lg">
                <Link href="/products/category/inline-speed-skating">
                  View All Products <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Pro Inline Skate Boots Banner 1 */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-[#bd9131] to-[#a17d27] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance leading-tight">
                Auriga Racing Pro Inline Skate Boots
              </h2>
              <p className="text-base md:text-lg mb-6 text-balance leading-relaxed">
                Auriga Racing Pro Inline Skate Boots are designed in India and produced by some of the finest leather
                craftsmen, purely handmade with love using the finest Japanese Carbon Fiber layered unilaterally and
                microfiber leather upper bonded with the genuine leather.
              </p>
              <Button asChild size="lg" className="bg-black hover:bg-neutral-800 text-white px-8 py-6 text-base">
                <Link href="/products">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="flex-1 relative h-[400px] w-full">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                  </div>
                }
              >
                <BootBanner3D />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Helmets Full Width Banner */}
      <section className="relative h-[400px] md:h-[500px] bg-black overflow-hidden group">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop"
          alt="Speed Skating Helmets"
          fill
          className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-slide-in-left">Premium Helmets</h2>
            <p className="text-xl text-white/90 max-w-xl animate-slide-in-left animation-delay-200">
              Aerodynamic design for maximum performance
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gradient-to-br from-neutral-400 to-neutral-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance leading-tight">
                Auriga Racing Aero Helmets
              </h2>
              <p className="text-lg md:text-xl mb-6 text-balance leading-relaxed">
                Auriga Racing Aero helmets delivers not just the aerodynamics but pure speed and unmatched performance.
                These helmets have showed improved performance during the wind tunnel testings.
              </p>
              <Button asChild size="lg" className="bg-white hover:bg-neutral-100 text-neutral-800 px-8 py-6 text-lg">
                <Link href="/products">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="flex-1 relative h-[400px] w-full">
              <Helmet3D />
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Collection Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-wide">SHOP BY COLLECTION</h2>
            <p className="text-lg text-muted-foreground">Discover our specialized equipment collections</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {["Boots", "Frames", "Wheels", "Bearings", "Helmets", "Skate Packages"].map((collection) => (
              <Card key={collection} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 relative overflow-hidden">
                  <Image
                    src={getImageKitUrl(
                      `/.jpg?key=i4odi&height=400&width=400&query=${collection.toLowerCase() || "/placeholder.svg"}`,
                    )}
                    alt={collection}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{collection}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Button asChild className="w-full bg-[#bd9131] hover:bg-[#a17d27] text-white">
                    <Link href="/products">
                      Explore <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Skate Packages Section */}
      {packagesProducts && packagesProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-wide">EXPLORE SKATE PACKAGES</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Complete skating solutions for every level
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {packagesProducts.map((product: any) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                    <div className="relative aspect-square bg-muted overflow-hidden">
                      <Image
                        src={getImageKitUrl(product.image_url, { height: 400, width: 400 || "/placeholder.svg" })}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.discount_percentage && product.discount_percentage > 0 && (
                        <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                          SAVE {product.discount_percentage}%
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                      {product.brand && <CardDescription>{product.brand}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-[#bd9131]">${(product.price_in_cents / 100).toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" className="bg-[#bd9131] hover:bg-[#a17d27] text-white px-8 py-6 text-lg">
                <Link href="/products">
                  View All Packages <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-20 bg-white text-neutral-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 relative h-[400px] w-full">
              <CadetSkate3D />
            </div>
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance leading-tight">
                Auriga Racing Cadet inline Skates 4x90 / 3x110
              </h2>
              <p className="text-lg md:text-xl mb-6 text-balance leading-relaxed">
                This skate offers versatility and transformation of a three wheels to four wheels&apos; race setup in
                the same skate package.
              </p>
              <Button asChild size="lg" className="bg-[#bd9131] hover:bg-[#a17d27] text-white px-8 py-6 text-lg">
                <Link href="/products">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Boots Full Width Banner */}
      <section className="relative h-[400px] md:h-[500px] bg-black overflow-hidden group">
        <Image
          src="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=1920&h=1080&fit=crop"
          alt="Inline Skate Boots"
          fill
          className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-slide-in-left">Precision Boots</h2>
            <p className="text-xl text-white/90 max-w-xl animate-slide-in-left animation-delay-200">
              Handcrafted perfection for elite athletes
            </p>
          </div>
        </div>
      </section>

      {/* Auriga Racing Boots Section */}
      {bootsProducts && bootsProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-wide">AURIGA RACING BOOTS</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Engineered for champions, crafted with precision
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
              {bootsProducts.slice(0, 8).map((product: any) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                    <div className="relative aspect-square bg-muted overflow-hidden">
                      <Image
                        src={getImageKitUrl(product.image_url, { height: 400, width: 400 || "/placeholder.svg" })}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-base">{product.name}</CardTitle>
                      {product.brand && <CardDescription className="text-sm">{product.brand}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold text-[#bd9131]">${(product.price_in_cents / 100).toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" className="bg-[#bd9131] hover:bg-[#a17d27] text-white px-8 py-6 text-lg">
                <Link href="/products">
                  View All Boots <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Pro Inline Skate Boots Banner 2 */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-neutral-500 to-neutral-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance leading-tight">
                Auriga Racing Pro Inline Skate Boots
              </h2>
              <p className="text-lg md:text-xl mb-6 text-balance leading-relaxed">
                Auriga Racing Pro Inline Skate Boots are designed in India and produced by some of the finest leather
                craftsmen, purely handmade with love using the finest Japanese Carbon Fiber layered unilaterally and
                microfiber leather upper bonded with the genuine leather.
              </p>
              <Button asChild size="lg" className="bg-white hover:bg-neutral-100 text-neutral-800 px-8 py-6 text-lg">
                <Link href="/products">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="flex-1 relative h-[400px] w-full">
              <BootGrey3D />
            </div>
          </div>
        </div>
      </section>

      {/* Frames Full Width Banner */}
      <section className="relative h-[400px] md:h-[500px] bg-black overflow-hidden group">
        <Image
          src="https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1920&h=1080&fit=crop"
          alt="Inline Skate Frames"
          fill
          className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-slide-in-left">Performance Frames</h2>
            <p className="text-xl text-white/90 max-w-xl animate-slide-in-left animation-delay-200">
              Built for speed and stability
            </p>
          </div>
        </div>
      </section>

      {/* Auriga Racing Frames Collection Section */}
      {framesProducts && framesProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-wide">
                AURIGA RACING FRAMES COLLECTION
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Advanced engineering for competitive edge
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
              {framesProducts.slice(0, 8).map((product: any) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                    <div className="relative aspect-square bg-muted overflow-hidden">
                      <Image
                        src={getImageKitUrl(product.image_url, { height: 400, width: 400 || "/placeholder.svg" })}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-base">{product.name}</CardTitle>
                      {product.brand && <CardDescription className="text-sm">{product.brand}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold text-[#bd9131]">${(product.price_in_cents / 100).toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" className="bg-[#bd9131] hover:bg-[#a17d27] text-white px-8 py-6 text-lg">
                <Link href="/products">
                  View All Frames <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* OCCULT Frames Banner Section */}
      <section className="py-16 md:py-24 bg-black text-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance leading-tight">
                Auriga Racing &apos;OCCULT&apos; 4x110 Inline Skate Frames
              </h2>
              <p className="text-lg md:text-xl mb-6 text-balance leading-relaxed">
                Auriga Racing &apos;OCCULT&apos; frames are solid frames, specially designed and engineered for
                exceptional performance in intense high-speed racing.
              </p>
              <Button asChild size="lg" className="bg-[#bd9131] hover:bg-[#a17d27] text-white px-8 py-6 text-lg">
                <Link href="/products">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="flex-1 relative h-[400px] w-full">
              <Frame3DClouds />
            </div>
          </div>
        </div>
      </section>

      {/* Wheels Full Width Banner */}
      <section className="relative h-[400px] md:h-[500px] bg-black overflow-hidden group">
        <Image
          src="https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=1920&h=1080&fit=crop"
          alt="Inline Skate Wheels"
          fill
          className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-slide-in-left">High-Speed Wheels</h2>
            <p className="text-xl text-white/90 max-w-xl animate-slide-in-left animation-delay-200">
              Engineered for champions
            </p>
          </div>
        </div>
      </section>

      {/* Inline Skate Wheels Section */}
      {wheelsProducts && wheelsProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-wide">INLINE SKATE WHEELS</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                High-performance wheels for every condition
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
              {wheelsProducts.slice(0, 8).map((product: any) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                    <div className="relative aspect-square bg-muted overflow-hidden">
                      <Image
                        src={getImageKitUrl(product.image_url, { height: 400, width: 400 || "/placeholder.svg" })}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-base">{product.name}</CardTitle>
                      {product.brand && <CardDescription className="text-sm">{product.brand}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold text-[#bd9131]">${(product.price_in_cents / 100).toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" className="bg-[#bd9131] hover:bg-[#a17d27] text-white px-8 py-6 text-lg">
                <Link href="/products">
                  View All Wheels <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* MPC Storm Surge Banner */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance leading-tight">
                MPC Storm Surge Inline Skate Wheels 100mm XFirm (8pcs)
              </h2>
              <p className="text-lg md:text-xl mb-6 text-balance leading-relaxed">
                Own the road in the rain. MPC Storm Surge inline skate wheels are the best ever produced specially for
                the rain conditions.
              </p>
              <Button asChild size="lg" className="bg-[#bd9131] hover:bg-[#a17d27] text-white px-8 py-6 text-lg">
                <Link href="/products">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="flex-1 relative h-[400px] w-full">
              <Wheel3D />
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 uppercase tracking-wide">
              LATEST NEWS FROM AURIGA RACING
            </h2>
            <p className="text-lg text-muted-foreground">Stay updated with our latest announcements and stories</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-muted relative">
                  <Image
                    src={getImageKitUrl(
                      `breaking-news-headline.png?key=83qof&height=400&width=600&query=news ${item || "/placeholder.svg"}`,
                    )}
                    alt={`News ${item}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="text-sm text-muted-foreground mb-2">December 2024</div>
                  <CardTitle className="text-xl">Latest Updates from Auriga Racing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Discover what&apos;s new in the world of speed skating and our latest product innovations.
                  </p>
                  <Button asChild variant="link" className="text-[#bd9131] px-0">
                    <Link href="#">
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="px-8 py-6 text-lg bg-transparent">
              <Link href="/blog">View All News</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#bd9131]/10 to-neutral-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            <Card className="text-center border-none shadow-lg bg-white hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#bd9131]/20">
                  <Truck className="h-10 w-10 text-[#bd9131]" />
                </div>
                <CardTitle className="text-xl font-bold">Free Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">For all orders over $99 within India</p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg bg-white hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#bd9131]/20">
                  <Clock className="h-10 w-10 text-[#bd9131]" />
                </div>
                <CardTitle className="text-xl font-bold">30 Days Return</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">If goods have problems</p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg bg-white hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#bd9131]/20">
                  <Shield className="h-10 w-10 text-[#bd9131]" />
                </div>
                <CardTitle className="text-xl font-bold">Secure Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">100% secure payment</p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg bg-white hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#bd9131]/20">
                  <Headphones className="h-10 w-10 text-[#bd9131]" />
                </div>
                <CardTitle className="text-xl font-bold">24/7 Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">Dedicated support team</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-black to-neutral-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Ready to Elevate Your Performance?</h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto text-balance leading-relaxed">
            Join thousands of athletes who trust Auriga Racing for world-class speed skating equipment
          </p>
          <Button asChild size="lg" className="text-lg px-10 py-6 bg-[#bd9131] hover:bg-[#a17d27] text-white">
            <Link href="/products">
              Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
