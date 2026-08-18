import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { CategoryBanner } from "@/components/category-banner"

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (categoryError || !category) {
    notFound()
  }

  const { data: productCategories } = await supabase
    .from("product_categories")
    .select("product_id")
    .eq("category_id", category.id)

  const productIds = productCategories?.map((pc) => pc.product_id) || []

  const { data: subcategories } = await supabase
    .from("categories")
    .select("id")
    .eq("parent_id", category.id)
    .eq("is_active", true)

  const subcategoryIds = subcategories?.map((sub) => sub.id) || []

  if (subcategoryIds.length > 0) {
    const { data: subProductCategories } = await supabase
      .from("product_categories")
      .select("product_id")
      .in("category_id", subcategoryIds)

    const subProductIds = subProductCategories?.map((pc) => pc.product_id) || []
    productIds.push(...subProductIds)
  }

  const uniqueProductIds = [...new Set(productIds)]

  let products: any[] = []
  if (uniqueProductIds.length > 0) {
    const { data } = await supabase
      .from("products")
      .select(
        `
        *,
        product_categories!inner(
          category:categories(*)
        )
      `,
      )
      .in("id", uniqueProductIds)
      .eq("is_active", true)
      .order("name")

    products = data || []
  }

  return (
    <div className="min-h-screen bg-background">
      <CategoryBanner name={category.name} description={category.description} imageUrl={category.image_url} />

      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/products">
            <ChevronLeft className="h-4 w-4 mr-2" />
            All Products
          </Link>
        </Button>

        {!category.image_url && (
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
            {category.description && <p className="text-lg text-muted-foreground">{category.description}</p>}
          </div>
        )}

        {products && products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-lg">
            <div className="max-w-md mx-auto px-4">
              <h3 className="text-xl font-semibold mb-2">No Products Available</h3>
              <p className="text-muted-foreground mb-6">
                There are currently no products in the {category.name} category. Check back soon or explore our other
                collections.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="/products">Browse All Products</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
