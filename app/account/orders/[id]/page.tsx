import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, Package } from "lucide-react"
import { CancelOrderButton } from "@/components/cancel-order-button"
import { Badge } from "@/components/ui/badge"
import { OrderTrackingDisplay } from "@/components/order-tracking-display"

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(
        *,
        product:products(*)
      )
    `)
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (!order) {
    redirect("/account/orders")
  }

  const { data: tracking } = await supabase.from("order_tracking").select("*").eq("order_id", order.id).single()

  const canCancel = order.status === "pending" || order.status === "processing"

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500"
      case "processing":
        return "bg-blue-500/10 text-blue-500"
      case "shipped":
        return "bg-purple-500/10 text-purple-500"
      case "delivered":
        return "bg-green-500/10 text-green-500"
      case "cancelled":
        return "bg-red-500/10 text-red-500"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/account/orders">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Order #{order.id.slice(0, 8)}</h1>
            <p className="text-muted-foreground mt-1">
              Placed on{" "}
              {new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.product?.name || "Product"}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      <p className="text-sm text-muted-foreground">${(item.price_in_cents / 100).toFixed(2)} each</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${((item.price_in_cents * item.quantity) / 100).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${(order.total_amount_in_cents / 100).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${(order.total_amount_in_cents / 100).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {tracking && <OrderTrackingDisplay tracking={tracking} />}

            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.shipping_address.name}</p>
                  <p>{order.shipping_address.street}</p>
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                  </p>
                </div>
              </CardContent>
            </Card>

            {canCancel && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                  <CardDescription>Manage this order</CardDescription>
                </CardHeader>
                <CardContent>
                  <CancelOrderButton orderId={order.id} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
