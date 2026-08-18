import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ChevronLeft, Edit } from "lucide-react"
import { getImageKitUrl } from "@/lib/imagekit"
import Image from "next/image"

export default async function ViewProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (userData?.role !== "admin" && userData?.role !== "manager") {
    redirect("/")
  }

  const { data: product, error: productError } = await supabase.from("products").select("*").eq("id", id).single()

  if (productError || !product) {
    console.error("[v0] Product fetch error:", productError)
    redirect("/admin/products")
  }

  const { data: productCategories } = await supabase
    .from("product_categories")
    .select("categories(name, slug)")
    .eq("product_id", id)

  const { data: gallery } = await supabase
    .from("product_gallery")
    .select("*")
    .eq("product_id", id)
    .order("display_order")

  const { data: specifications } = await supabase
    .from("product_specifications")
    .select("*")
    .eq("product_id", id)
    .order("display_order")

  const productTypeDetails = product.product_type_details || {}
  const features = product.features || []
  const hasDiscount = product.discount_percentage && product.original_price_in_cents

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost">
            <Link href="/admin/products">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/products/${id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                {product.image_url ? (
                  <div className="aspect-square relative bg-gray-50 rounded-lg overflow-hidden">
                    <Image
                      src={
                        getImageKitUrl(product.image_url, { width: 600, height: 600 || "/placeholder.svg" }) ||
                        "/placeholder.svg"
                      }
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="aspect-square flex items-center justify-center bg-gray-100 rounded-lg">
                    <p className="text-muted-foreground">No image</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {gallery && gallery.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Product Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {gallery.map((img: any, index: number) => (
                      <div key={index} className="aspect-square relative bg-gray-50 rounded-lg overflow-hidden">
                        <Image
                          src={
                            getImageKitUrl(img.image_url, { width: 200, height: 200 || "/placeholder.svg" }) ||
                            "/placeholder.svg"
                          }
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.brand && <Badge variant="outline">{product.brand}</Badge>}
                    {product.sku && (
                      <Badge variant="secondary" className="font-mono text-xs">
                        SKU: {product.sku}
                      </Badge>
                    )}
                    {product.product_type && <Badge variant="default">{product.product_type}</Badge>}
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">{product.status}</Badge>
                    {product.deal_of_the_day && <Badge variant="destructive">Deal of the Day</Badge>}
                  </div>
                  <CardTitle className="text-3xl">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">Slug: {product.slug}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">${(product.price_in_cents / 100).toFixed(2)}</p>
                    {hasDiscount && (
                      <>
                        <p className="text-lg text-muted-foreground line-through">
                          ${(product.original_price_in_cents / 100).toFixed(2)}
                        </p>
                        <Badge variant="destructive">-{product.discount_percentage}%</Badge>
                      </>
                    )}
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
                  </div>
                )}

                {/* Short Description */}
                {product.short_description && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Short Description</p>
                    <p className="text-sm text-muted-foreground">{product.short_description}</p>
                  </div>
                )}

                {/* Categories */}
                {productCategories && productCategories.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {productCategories.map((pc: any) => (
                        <Badge key={pc.categories.slug} variant="outline">
                          {pc.categories.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock */}
                <div className="space-y-1">
                  <p className="text-sm font-medium">Stock Quantity</p>
                  <p className="text-2xl font-semibold">{product.stock_quantity}</p>
                </div>
              </CardContent>
            </Card>

            {/* Product Type Details */}
            {product.product_type && Object.keys(productTypeDetails).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Product Type Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {Object.entries(productTypeDetails).map(([key, value]) => (
                      <div key={key} className="py-3 grid grid-cols-2 gap-4">
                        <p className="font-medium capitalize">{key.replace(/_/g, " ")}</p>
                        <p className="text-muted-foreground">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1">
                    {features.map((feature: string, index: number) => (
                      <li key={index} className="text-sm">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Specifications */}
            {specifications && specifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {specifications.map((spec: any) => (
                      <div key={spec.id} className="py-3 grid grid-cols-2 gap-4">
                        <p className="font-medium">{spec.spec_key}</p>
                        <p className="text-muted-foreground">{spec.spec_value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Video */}
            {product.video_url && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Product Video</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video">
                    <iframe src={product.video_url} className="w-full h-full rounded-lg" allowFullScreen />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(product.created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{new Date(product.updated_at).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
