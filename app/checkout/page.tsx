import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckoutForm } from "@/components/checkout-form"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { getImageKitUrl } from "@/lib/imagekit"

export default async function CheckoutPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/checkout")
  }

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select(`
      *,
      product:products(
        *,
        product_gallery(image_url, is_primary, display_order)
      )
    `)
    .eq("user_id", user.id)

  if (!cartItems || cartItems.length === 0) {
    redirect("/cart")
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price_in_cents || 0) * item.quantity, 0)

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CheckoutForm cartItems={cartItems} user={userData} subtotal={subtotal} addresses={addresses || []} />
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const primaryImage =
                      item.product?.product_gallery?.find((img: any) => img.is_primary)?.image_url ||
                      item.product?.product_gallery?.[0]?.image_url ||
                      item.product?.image_url

                    return (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={getImageKitUrl(primaryImage || "/placeholder.svg")}
                            alt={item.product?.name || "Product"}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-bl">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">{item.product?.name}</h4>
                          {item.product?.brand && (
                            <p className="text-xs text-muted-foreground mt-0.5">{item.product.brand}</p>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                            <span className="text-sm font-medium">
                              ${(((item.product?.price_in_cents || 0) * item.quantity) / 100).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${(subtotal / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Calculated at next step</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${(subtotal / 100).toFixed(2)}</span>
                  </div>
                </div>

                <Button type="submit" form="checkout-form" className="w-full" size="lg">
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
