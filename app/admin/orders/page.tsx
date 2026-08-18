import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { AdminOrdersTable } from "@/components/admin-orders-table"

export default async function AdminOrdersPage() {
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

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      user:users(first_name, last_name, email, phone),
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
          <Link href="/admin">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">Order Management</h1>

        <div className="space-y-6">
          {orders && orders.length > 0 ? (
            <AdminOrdersTable orders={orders} />
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
