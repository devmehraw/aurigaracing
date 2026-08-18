import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { ProductSearch } from "@/components/product-search"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Products | Auriga Racing - Premium Speed Skating & Cycling Equipment",
  description: "Browse our complete collection of professional speed skating and cycling equipment",
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    category?: string
    search?: string
    brand?: string
    product_type?: string
    status?: string
    stock?: string
    deal?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
  }
}) {
  const supabase = await createClient()

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Fetch unique brands
  const { data: brandsData } = await supabase.from("products").select("brand").not("brand", "is", null).order("brand")

  const brands = [...new Set(brandsData?.map((p) => p.brand).filter(Boolean))] as string[]

  // Build query
  let query = supabase.from("products").select("*").eq("is_active", true)

  if (searchParams.category) {
    // Use product_categories junction table
    const { data: productCategories } = await supabase
      .from("product_categories")
      .select("product_id")
      .eq("category_id", searchParams.category)

    const productIds = productCategories?.map((pc) => pc.product_id) || []
    if (productIds.length > 0) {
      query = query.in("id", productIds)
    } else {
      // No products in category
      query = query.eq("id", "00000000-0000-0000-0000-000000000000")
    }
  }

  if (searchParams.search) {
    query = query.or(
      `name.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%,brand.ilike.%${searchParams.search}%,sku.ilike.%${searchParams.search}%`,
    )
  }

  if (searchParams.brand) {
    query = query.eq("brand", searchParams.brand)
  }

  if (searchParams.product_type) {
    query = query.eq("product_type", searchParams.product_type)
  }

  if (searchParams.status) {
    query = query.eq("status", searchParams.status)
  } else {
    // Default to published only for customers
    query = query.eq("status", "published")
  }

  if (searchParams.stock === "in_stock") {
    query = query.gt("stock_quantity", 0)
  } else if (searchParams.stock === "out_of_stock") {
    query = query.lte("stock_quantity", 0)
  }

  if (searchParams.deal === "true") {
    query = query.eq("deal_of_the_day", true)
  }

  if (searchParams.minPrice) {
    const minPriceCents = Number.parseFloat(searchParams.minPrice) * 100
    query = query.gte("price_in_cents", minPriceCents)
  }

  if (searchParams.maxPrice) {
    const maxPriceCents = Number.parseFloat(searchParams.maxPrice) * 100
    query = query.lte("price_in_cents", maxPriceCents)
  }

  // Apply sorting
  const sortBy = searchParams.sort || "created_at"
  if (sortBy === "price_asc") {
    query = query.order("price_in_cents", { ascending: true })
  } else if (sortBy === "price_desc") {
    query = query.order("price_in_cents", { ascending: false })
  } else if (sortBy === "name") {
    query = query.order("name", { ascending: true })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data: products } = await query

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Premium Performance Equipment</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto text-balance leading-relaxed">
            Discover top-quality speed skating and cycling gear designed for champions
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <ProductSearch />
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters categories={categories || []} brands={brands} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                {products?.length || 0} {products?.length === 1 ? "product" : "products"} found
              </p>

              {/* Active Filters Display */}
              {Object.keys(searchParams).length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {searchParams.search && (
                    <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                      Search: {searchParams.search}
                    </span>
                  )}
                  {searchParams.deal === "true" && (
                    <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">Deal of the Day</span>
                  )}
                </div>
              )}
            </div>

            {products && products.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <p className="text-lg text-muted-foreground mb-4">No products found matching your criteria</p>
                <Button asChild>
                  <Link href="/products">Clear Filters</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
