import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { CartItemsList } from "@/components/cart-items-list"

export default async function CartPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/cart")
  }

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("*, product:products(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const total = cartItems?.reduce((sum, item) => sum + (item.product?.price_in_cents || 0) * item.quantity, 0) || 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cartItems && cartItems.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CartItemsList items={cartItems} />
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold">Order Summary</h2>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${(total / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="border-t pt-2 flex items-center justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${(total / 100).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button asChild className="w-full" size="lg">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some products to get started</p>
              <Button asChild size="lg">
                <Link href="/products">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
