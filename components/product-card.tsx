import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { QuickAddToCartButton } from "@/components/quick-add-to-cart-button"
import { WishlistButton } from "@/components/wishlist-button"

export function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.image_url?.startsWith("http")
    ? product.image_url
    : product.image_url
      ? `https://ik.imagekit.io/aurigaracing${product.image_url}?tr=w-600,h-600,c-at_max,q-85`
      : "https://ik.imagekit.io/demo/img/placeholder.svg?tr=w-600,h-600,c-at_max,q-85"

  return (
    <Card className="h-full hover:shadow-lg transition-shadow group relative">
      <div className="absolute top-2 right-2 z-10">
        <WishlistButton productId={product.id} size="sm" />
      </div>

      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square bg-muted overflow-hidden rounded-t-lg">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        </div>
      </Link>
      <CardHeader>
        <Link href={`/products/${product.slug}`}>
          <CardTitle className="text-lg line-clamp-2 hover:text-primary transition-colors">{product.name}</CardTitle>
        </Link>
        {product.category && <CardDescription className="text-xs">{product.category.name}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">${(product.price_in_cents / 100).toFixed(2)}</span>
          {product.stock_quantity > 0 ? (
            <span className="text-xs text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-xs text-destructive font-medium">Out of Stock</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <QuickAddToCartButton productId={product.id} disabled={product.stock_quantity <= 0} />
        <Button
          asChild
          variant="outline"
          className="flex-1 bg-transparent group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        >
          <Link href={`/products/${product.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
