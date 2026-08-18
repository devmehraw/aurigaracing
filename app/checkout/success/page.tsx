import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { handleSuccessfulPayment } from "@/app/actions/stripe"

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string; order_id?: string }
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const sessionId = searchParams.session_id
  const orderId = searchParams.order_id

  if (sessionId && orderId) {
    const result = await handleSuccessfulPayment(sessionId, orderId)
    if (result.error) {
      console.error("[v0] Payment verification failed:", result.error)
    }
  }

  if (!orderId) {
    redirect("/account/orders")
  }

  const { data: order } = await supabase.from("orders").select("*").eq("id", orderId).eq("user_id", user.id).single()

  if (!order) {
    redirect("/account/orders")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Order Placed Successfully!</CardTitle>
            <CardDescription>Thank you for your purchase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-mono font-semibold">#{order.id.slice(0, 8)}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">${(order.total_amount_in_cents / 100).toFixed(2)}</p>
            </div>

            <p className="text-sm text-muted-foreground">
              We've sent a confirmation email with your order details. You can track your order status from your account
              page.
            </p>

            <div className="flex flex-col gap-2 pt-4">
              <Button asChild>
                <Link href="/account/orders">View Order History</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
