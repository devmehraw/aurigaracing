import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, TrendingUp, Tag, MessageSquare, Star, FileText } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboardPage() {
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

  // Get statistics
  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true })

  const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*, user:users(first_name, last_name)")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: orders } = await supabase.from("orders").select("total_amount_in_cents")

  const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount_in_cents, 0) || 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your e-commerce platform</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalRevenue / 100).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">From {totalOrders || 0} orders</p>
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Active products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered users</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 mb-8">
          <Link href="/admin/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Users className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Package className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Manage Products</CardTitle>
                <CardDescription>Add, edit, or remove products</CardDescription>
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

          <Link href="/admin/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <ShoppingCart className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Manage Orders</CardTitle>
                <CardDescription>Process and track orders</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/reviews">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Star className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Manage Reviews</CardTitle>
                <CardDescription>Moderate customer reviews</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/tickets">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <MessageSquare className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Manage Tickets</CardTitle>
                <CardDescription>Handle support tickets</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/pages">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <FileText className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Manage Pages</CardTitle>
                <CardDescription>Edit website pages & SEO</CardDescription>
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
