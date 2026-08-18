import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ChevronLeft, Package, User, MapPin, CreditCard, Calendar } from "lucide-react"
import { format } from "date-fns"

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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

  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      user:users(*),
      order_items(
        *,
        product:products(*)
      )
    `)
    .eq("id", id)
    .single()

  if (!order) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "processing":
        return "bg-blue-500"
      case "shipped":
        return "bg-purple-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost">
        <Link href="/admin/orders">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.id.slice(0, 8)}</h1>
          <p className="text-muted-foreground mt-1">Placed on {format(new Date(order.created_at), "PPP 'at' p")}</p>
        </div>
        <div className="flex gap-2">
          <Badge className={`${getStatusColor(order.status)} text-white`}>{order.status}</Badge>
          <Badge variant="outline">{order.payment_status}</Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">
                {order.user.first_name} {order.user.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{order.user.email}</p>
            </div>
            {order.user.phone && (
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{order.user.phone}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground space-y-1">
              {order.shipping_address.name}
              <br />
              {order.shipping_address.street}
              <br />
              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
              <br />
              {order.shipping_address.country}
              {order.shipping_address.phone && (
                <>
                  <br />
                  Phone: {order.shipping_address.phone}
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Payment Status</p>
              <p className="text-sm text-muted-foreground">{order.payment_status}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Amount</p>
              <p className="text-lg font-semibold">${(order.total_amount_in_cents / 100).toFixed(2)}</p>
            </div>
            {order.stripe_payment_intent_id && (
              <div>
                <p className="text-sm font-medium">Payment Intent ID</p>
                <p className="text-xs text-muted-foreground font-mono">{order.stripe_payment_intent_id}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Delivery Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Expected Delivery</p>
              <p className="text-sm text-muted-foreground">
                {order.delivery_date ? format(new Date(order.delivery_date), "PPP") : "Not set"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Order Status</p>
              <p className="text-sm text-muted-foreground">{order.status}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Items
          </CardTitle>
          <CardDescription>{order.order_items.length} items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.order_items.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${(item.price_in_cents / 100).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    ${(item.price_in_cents / 100 / item.quantity).toFixed(2)} each
                  </p>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 border-t font-semibold">
              <span>Total</span>
              <span className="text-xl">${(order.total_amount_in_cents / 100).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
