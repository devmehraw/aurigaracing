import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Package, User, MapPin, MessageSquare } from "lucide-react"
import { SignOutButton } from "@/components/sign-out-button"

export default async function AccountPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Account</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {userData?.first_name || "Customer"}</p>
          </div>
          <SignOutButton />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Profile</CardTitle>
              </div>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">
                    {userData?.first_name} {userData?.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Role</p>
                  <p className="font-medium capitalize">{userData?.role}</p>
                </div>
              </div>
              <Button asChild className="w-full mt-4 bg-transparent" variant="outline">
                <Link href="/account/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <CardTitle>Orders</CardTitle>
              </div>
              <CardDescription>View your order history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {orders && orders.length > 0 ? (
                  <>
                    <p className="text-2xl font-bold">{orders.length}</p>
                    <p className="text-sm text-muted-foreground">
                      {orders.length === 1 ? "Order placed" : "Orders placed"}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No orders yet</p>
                )}
                <Button asChild className="w-full mt-4 bg-transparent" variant="outline">
                  <Link href="/account/orders">View All Orders</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                <Link href="/products">Browse Products</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                <Link href="/cart">View Cart</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                <Link href="/account/addresses">
                  <MapPin className="h-4 w-4 mr-2" />
                  Manage Addresses
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                <Link href="/account/tickets">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Support Tickets
                </Link>
              </Button>
              {(userData?.role === "admin" || userData?.role === "manager") && (
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href={userData.role === "admin" ? "/admin" : "/manager"}>
                    {userData.role === "admin" ? "Admin Dashboard" : "Manager Dashboard"}
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {orders && orders.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                      <p className="text-sm">
                        <span className="capitalize">{order.status}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(order.total_amount_in_cents / 100).toFixed(2)}</p>
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/account/orders/${order.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
