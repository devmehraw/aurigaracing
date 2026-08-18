import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { ProductForm } from "@/components/product-form"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (userData?.role !== "admin" && userData?.role !== "manager") {
    redirect("/")
  }

  const { data: product, error: productError } = await supabase.from("products").select("*").eq("id", id).single()

  if (productError || !product) {
    console.error("[v0] Product fetch error:", productError)
    redirect("/admin/products")
  }

  const { data: productCategories } = await supabase
    .from("product_categories")
    .select("category_id")
    .eq("product_id", id)

  const { data: gallery } = await supabase
    .from("product_gallery")
    .select("image_url")
    .eq("product_id", id)
    .order("display_order")

  const productWithRelations = {
    ...product,
    categoryIds: productCategories?.map((pc) => pc.category_id) || [],
    gallery: gallery?.map((g) => g.image_url) || [],
  }

  const { data: categories, error: categoriesError } = await supabase.from("categories").select("*").order("name")

  if (categoriesError) {
    console.error("[v0] Categories fetch error:", categoriesError)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-8 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href={`/admin/products/${id}`}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Product
          </Link>
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">Update product information and settings</p>
        </div>

        <ProductForm product={productWithRelations} categories={categories || []} />
      </div>
    </div>
  )
}
