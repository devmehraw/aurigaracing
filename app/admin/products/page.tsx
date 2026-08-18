import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, Plus } from "lucide-react"
import { AdminProductsTable } from "@/components/admin-products-table"

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (userData?.role !== "admin") {
    redirect("/")
  }

  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      product_categories(
        categories(name, slug)
      )
    `)
    .order("created_at", { ascending: false })

  // Transform the data to match the table component expectations
  const transformedProducts =
    products?.map((product) => ({
      ...product,
      categories: product.product_categories?.map((pc: any) => pc.categories) || [],
    })) || []

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost">
            <Link href="/admin">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Product Management</h1>

        <AdminProductsTable products={transformedProducts} />
      </div>
    </div>
  )
}
