import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { UpdateOrderStatus } from "@/components/update-order-status"

export default async function ManagerOrdersPage() {
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

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      user:users(first_name, last_name, email),
      order_items(
        *,
        product:products(name)
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/manager">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">Order Management</h1>

        <div className="space-y-6">
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                      <CardDescription>
                        {order.user?.first_name} {order.user?.last_name}
                      </CardDescription>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-xl">${(order.total_amount_in_cents / 100).toFixed(2)}</div>
                      <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold mb-2">Items</h4>
                    <div className="space-y-2">
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span>
                            {item.product?.name || "Product"} x{item.quantity}
                          </span>
                          <span>${(item.price_in_cents / 100).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No orders found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
