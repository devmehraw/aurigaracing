import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { RemoveFromWishlistButton } from "@/components/remove-from-wishlist-button"
import { AddToCartFromWishlist } from "@/components/add-to-cart-from-wishlist"

export default async function WishlistPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: wishlistItems } = await supabase
    .from("wishlist")
    .select(
      `
      id,
      created_at,
      product:products (
        id,
        name,
        slug,
        price_in_cents,
        image_url,
        stock_quantity,
        is_active
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-muted-foreground">
          {wishlistItems?.length || 0} {wishlistItems?.length === 1 ? "item" : "items"} in your wishlist
        </p>
      </div>

      {!wishlistItems || wishlistItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Start adding products you love!</p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item: any) => (
            <Card key={item.id} className="overflow-hidden">
              <Link href={`/products/${item.product.slug}`}>
                <div className="aspect-square relative overflow-hidden bg-muted">
                  {item.product.image_url && (
                    <img
                      src={item.product.image_url || "/placeholder.svg"}
                      alt={item.product.name}
                      className="object-cover w-full h-full hover:scale-105 transition-transform"
                    />
                  )}
                </div>
              </Link>
              <CardContent className="p-4">
                <Link href={`/products/${item.product.slug}`}>
                  <h3 className="font-semibold mb-2 hover:text-primary line-clamp-2">{item.product.name}</h3>
                </Link>
                <p className="text-lg font-bold text-[#bd9131] mb-4">
                  ${(item.product.price_in_cents / 100).toFixed(2)}
                </p>

                {item.product.is_active && item.product.stock_quantity > 0 ? (
                  <div className="flex gap-2">
                    <AddToCartFromWishlist productId={item.product.id} />
                    <RemoveFromWishlistButton wishlistItemId={item.id} />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-destructive">Out of stock</p>
                    <RemoveFromWishlistButton wishlistItemId={item.id} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
