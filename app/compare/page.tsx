import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { X } from "lucide-react"
import { getImageKitUrl } from "@/lib/imagekit"

export default async function ComparePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login?redirect=/compare")
  }

  const { data: comparisons } = await supabase
    .from("product_comparisons")
    .select(`
      id,
      product_id,
      products (
        id,
        name,
        slug,
        brand,
        price_in_cents,
        original_price_in_cents,
        discount_percentage,
        image_url,
        stock_quantity,
        product_type,
        features
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const products = comparisons?.map((c: any) => c.products).filter(Boolean) || []

  if (products.length === 0) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">Product Comparison</h1>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No products to compare yet</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Compare Products</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-4 bg-muted text-left font-semibold">Feature</th>
              {products.map((product: any) => (
                <th key={product.id} className="border p-4 bg-muted min-w-[250px]">
                  <div className="relative">
                    <form
                      action={async () => {
                        "use server"
                        const supabase = await createClient()
                        await supabase
                          .from("product_comparisons")
                          .delete()
                          .eq("user_id", user.id)
                          .eq("product_id", product.id)
                      }}
                    >
                      <Button variant="ghost" size="icon" className="absolute -top-2 -right-2" type="submit">
                        <X className="h-4 w-4" />
                      </Button>
                    </form>
                    <Image
                      src={
                        getImageKitUrl(product.image_url, { width: 200, height: 200 || "/placeholder.svg" }) ||
                        "/placeholder.svg"
                      }
                      alt={product.name}
                      width={200}
                      height={200}
                      className="mx-auto object-cover rounded mb-2"
                    />
                    <div className="text-sm font-medium">{product.name}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-4 font-medium">Brand</td>
              {products.map((product: any) => (
                <td key={product.id} className="border p-4 text-center">
                  {product.brand}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-4 font-medium">Price</td>
              {products.map((product: any) => (
                <td key={product.id} className="border p-4 text-center">
                  <div>
                    <span className="font-semibold">₹{(product.price_in_cents / 100).toFixed(2)}</span>
                    {product.discount_percentage > 0 && (
                      <div className="text-sm text-muted-foreground line-through">
                        ₹{(product.original_price_in_cents / 100).toFixed(2)}
                      </div>
                    )}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-4 font-medium">Stock</td>
              {products.map((product: any) => (
                <td key={product.id} className="border p-4 text-center">
                  {product.stock_quantity > 0 ? (
                    <span className="text-green-600">In Stock ({product.stock_quantity})</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-4 font-medium">Type</td>
              {products.map((product: any) => (
                <td key={product.id} className="border p-4 text-center capitalize">
                  {product.product_type?.replace("_", " ") || "N/A"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-4 font-medium">Actions</td>
              {products.map((product: any) => (
                <td key={product.id} className="border p-4 text-center">
                  <Button asChild className="w-full">
                    <Link href={`/products/${product.slug}`}>View Details</Link>
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
