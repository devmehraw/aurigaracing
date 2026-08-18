import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, TrendingUp, Users } from "lucide-react"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  // Fetch analytics data
  const [ordersData, productsData, usersData, revenueData] = await Promise.all([
    supabase.from("orders").select("id, total_amount_in_cents, status, created_at"),
    supabase.from("products").select("id, name, price_in_cents, stock_quantity"),
    supabase.from("users").select("id, created_at, role"),
    supabase.from("orders").select("total_amount_in_cents, status"),
  ])

  const orders = ordersData.data || []
  const products = productsData.data || []
  const users = usersData.data || []

  // Calculate metrics
  const totalRevenue =
    orders.filter((o) => o.status !== "cancelled").reduce((sum, order) => sum + (order.total_amount_in_cents || 0), 0) /
    100

  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === "pending").length
  const completedOrders = orders.filter((o) => o.status === "delivered").length
  const totalCustomers = users.filter((u) => u.role === "customer").length
  const lowStockProducts = products.filter((p) => p.stock_quantity < 10).length

  // Get this month's revenue
  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)

  const monthlyRevenue =
    orders
      .filter((o) => {
        const orderDate = new Date(o.created_at)
        return orderDate >= thisMonth && o.status !== "cancelled"
      })
      .reduce((sum, order) => sum + (order.total_amount_in_cents || 0), 0) / 100

  // Top products by revenue
  const productRevenue = await supabase.from("order_items").select(`
      product_id,
      quantity,
      price_in_cents,
      products (name, image_url)
    `)

  const topProducts = Object.values(
    (productRevenue.data || []).reduce((acc: any, item: any) => {
      const id = item.product_id
      if (!acc[id]) {
        acc[id] = {
          name: item.products?.name,
          revenue: 0,
          quantity: 0,
        }
      }
      acc[id].revenue += (item.price_in_cents * item.quantity) / 100
      acc[id].quantity += item.quantity
      return acc
    }, {}),
  )
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">₹{monthlyRevenue.toFixed(2)} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {pendingOrders} pending, {completedOrders} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">{lowStockProducts} low stock items</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product: any, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.quantity} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{product.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
