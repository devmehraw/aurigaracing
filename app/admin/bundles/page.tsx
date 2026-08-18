import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export default async function AdminBundlesPage() {
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

  const { data: bundles } = await supabase
    .from("product_bundles")
    .select(
      `
      *,
      bundle_products (
        quantity,
        product:products (
          name,
          price_in_cents,
          image_url
        )
      )
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Product Bundles</h1>
          <p className="text-muted-foreground mt-1">Create and manage product bundles with discounts</p>
        </div>
        <Button asChild>
          <Link href="/admin/bundles/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Bundle
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bundles && bundles.length > 0 ? (
          bundles.map((bundle) => {
            const totalPrice = bundle.bundle_products?.reduce(
              (sum: number, bp: any) => sum + bp.product.price_in_cents * bp.quantity,
              0,
            )
            const discountedPrice = totalPrice ? totalPrice * (1 - bundle.discount_percentage / 100) : 0

            return (
              <Card key={bundle.id} className="overflow-hidden">
                {bundle.image_url && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={bundle.image_url || "/placeholder.svg"}
                      alt={bundle.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{bundle.name}</CardTitle>
                    <Badge variant={bundle.is_active ? "default" : "secondary"}>
                      {bundle.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <CardDescription>{bundle.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {bundle.bundle_products?.length || 0} product(s)
                      </p>
                      <div className="flex items-baseline gap-2">
                        {bundle.discount_percentage > 0 && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${(totalPrice / 100).toFixed(2)}
                          </span>
                        )}
                        <span className="text-lg font-bold text-[#bd9131]">${(discountedPrice / 100).toFixed(2)}</span>
                        {bundle.discount_percentage > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {bundle.discount_percentage}% OFF
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" asChild className="flex-1 bg-transparent">
                        <Link href={`/admin/bundles/${bundle.id}/edit`}>Edit</Link>
                      </Button>
                      <Button variant="outline" asChild className="flex-1 bg-transparent">
                        <Link href={`/bundles/${bundle.slug}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center mb-4">No product bundles yet</p>
              <Button asChild>
                <Link href="/admin/bundles/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Bundle
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
