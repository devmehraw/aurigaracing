import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Plus, Tag, MessageSquare, Star, FileText } from "lucide-react"
import Link from "next/link"

export default async function ManagerDashboardPage() {
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

  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true })

  const { count: activeProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)

  const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*, user:users(first_name, last_name)")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage products and monitor orders</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">{activeProducts || 0} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">All time orders</p>
            </CardContent>
          </Card>

          <Link href="/manager/products/new">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Add Product</CardTitle>
                <Plus className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Create a new product listing</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Manager Navigation */}
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 mb-8">
          <Link href="/manager/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Package className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Manage Products</CardTitle>
                <CardDescription>Add and edit products</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/categories">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Tag className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Manage Categories</CardTitle>
                <CardDescription>Organize product categories</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/manager/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <ShoppingCart className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>View Orders</CardTitle>
                <CardDescription>Monitor customer orders</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/reviews">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Star className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>View Reviews</CardTitle>
                <CardDescription>Customer product reviews</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/tickets">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <MessageSquare className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>Handle customer support</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/pages">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <FileText className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Manage Pages</CardTitle>
                <CardDescription>Edit website pages</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.user?.first_name} {order.user?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(order.total_amount_in_cents / 100).toFixed(2)}</p>
                      <span
                        className={`text-xs font-medium ${
                          order.status === "delivered"
                            ? "text-green-600"
                            : order.status === "cancelled"
                              ? "text-red-600"
                              : "text-blue-600"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No orders yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
