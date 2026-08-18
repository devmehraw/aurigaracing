import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Package, TrendingDown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminInventoryPage() {
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

  // Get low stock products (stock_quantity <= 10)
  const { data: lowStockProducts } = await supabase
    .from("products")
    .select("*")
    .lte("stock_quantity", 10)
    .eq("is_active", true)
    .order("stock_quantity", { ascending: true })

  // Get out of stock products
  const { data: outOfStockProducts } = await supabase
    .from("products")
    .select("*")
    .eq("stock_quantity", 0)
    .eq("is_active", true)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground mt-1">Monitor stock levels and manage inventory</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockProducts?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Products need restocking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockProducts?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Products running low</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(lowStockProducts?.reduce((sum, p) => sum + p.stock_quantity, 0) || 0) +
                (outOfStockProducts?.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Items in stock</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Out of Stock Products
            </CardTitle>
            <CardDescription>Products that need immediate restocking</CardDescription>
          </CardHeader>
          <CardContent>
            {outOfStockProducts && outOfStockProducts.length > 0 ? (
              <div className="space-y-3">
                {outOfStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>Restock</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No out of stock products</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange-600" />
              Low Stock Products
            </CardTitle>
            <CardDescription>Products with 10 or fewer items remaining</CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockProducts && lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 10).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={product.stock_quantity <= 5 ? "destructive" : "secondary"} className="font-mono">
                        {product.stock_quantity} left
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>Update</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">All products well-stocked</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
