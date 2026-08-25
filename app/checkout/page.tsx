import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CheckoutSummary } from "@/components/checkout-summary"

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

        <CheckoutSummary cartItems={cartItems} user={userData} subtotal={subtotal} addresses={addresses || []} />
      </div>
    </div>
  )
}
