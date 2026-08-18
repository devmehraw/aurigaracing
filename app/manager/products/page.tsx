import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, Plus } from "lucide-react"
import { AdminProductActions } from "@/components/admin-product-actions"

export default async function ManagerProductsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (userData?.role !== "manager" && userData?.role !== "admin") {
    redirect("/")
  }

  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost">
            <Link href="/manager">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href="/manager/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Product Management</h1>

        <Card>
          <CardHeader>
            <CardTitle>All Products</CardTitle>
            <CardDescription>Manage your product catalog</CardDescription>
          </CardHeader>
          <CardContent>
            {products && products.length > 0 ? (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      {product.image_url ? (
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">No image</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category?.name || "No category"}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm font-medium">${(product.price_in_cents / 100).toFixed(2)}</span>
                        <span className="text-sm text-muted-foreground">Stock: {product.stock_quantity}</span>
                        <span className={`text-sm ${product.is_active ? "text-green-600" : "text-red-600"}`}>
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    <AdminProductActions productId={product.id} slug={product.slug} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No products found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
