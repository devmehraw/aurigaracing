import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ChevronLeft, Star, Package, Truck, Shield, Tag } from "lucide-react"
import { ReviewSection } from "@/components/review-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductDetailClient } from "@/components/product-detail-client"
import { ProductImageGallery } from "@/components/product-image-gallery"
import { ProductQASection } from "@/components/product-qa-section"
import { RecentlyViewedProducts } from "@/components/recently-viewed-products"
import { TrackProductView } from "@/components/track-product-view"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!product) {
    notFound()
  }

  const { data: galleryImages } = await supabase
    .from("product_gallery")
    .select("*")
    .eq("product_id", product.id)
    .order("display_order", { ascending: true })

  const { data: specifications } = await supabase
    .from("product_specifications")
    .select("*")
    .eq("product_id", product.id)
    .order("display_order", { ascending: true })

  const { data: tags } = await supabase.from("product_tags").select("*").eq("product_id", product.id)

  const { data: productCategories } = await supabase
    .from("product_categories")
    .select("category:categories(*)")
    .eq("product_id", product.id)

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, user:users(first_name, last_name)")
    .eq("product_id", product.id)
    .order("created_at", { ascending: false })

  const averageRating =
    reviews && reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  const allImages =
    galleryImages && galleryImages.length > 0
      ? galleryImages.map((img) => img.image_url)
      : product.image_url
        ? [product.image_url]
        : []

  const hasDiscount = product.original_price_in_cents && product.original_price_in_cents > product.price_in_cents
  const discountPercentage = hasDiscount
    ? Math.round(((product.original_price_in_cents - product.price_in_cents) / product.original_price_in_cents) * 100)
    : 0

  return (
    <div className="min-h-screen bg-background">
      <TrackProductView productId={product.id} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href={product.category ? `/products/category/${product.category.slug}` : "/products"}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to {product.category?.name || "Products"}
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-2 mb-12">
          <ProductImageGallery
            images={allImages}
            productName={product.name}
            dealOfTheDay={product.deal_of_the_day}
            hasDiscount={hasDiscount}
            discountPercentage={discountPercentage}
          />

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {productCategories &&
                productCategories.map((pc: any) => (
                  <Link
                    key={pc.category.id}
                    href={`/products/category/${pc.category.slug}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {pc.category.name}
                  </Link>
                ))}
              {product.brand && (
                <Badge variant="outline" className="ml-2">
                  {product.brand}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>

            {product.sku && <p className="text-sm text-muted-foreground mb-4">SKU: {product.sku}</p>}

            {/* Rating */}
            {reviews && reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(averageRating) ? "fill-primary text-primary" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}

            <div className="mb-6">
              {hasDiscount ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">${(product.price_in_cents / 100).toFixed(2)}</span>
                  <span className="text-xl text-muted-foreground line-through">
                    ${(product.original_price_in_cents / 100).toFixed(2)}
                  </span>
                  <Badge variant="destructive">{discountPercentage}% OFF</Badge>
                </div>
              ) : (
                <div className="text-3xl font-bold">${(product.price_in_cents / 100).toFixed(2)}</div>
              )}
            </div>

            {product.short_description && (
              <p className="text-muted-foreground leading-relaxed mb-6">{product.short_description}</p>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock_quantity > 0 ? (
                <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  In Stock ({product.stock_quantity} available)
                </p>
              ) : (
                <p className="text-sm text-destructive font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Out of Stock
                </p>
              )}
            </div>

            {/* Product Details Section */}
            <ProductDetailClient
              productId={product.id}
              productName={product.name}
              productImage={product.image_url}
              productType={product.product_type}
              productTypeDetails={product.product_type_details}
              stockQuantity={product.stock_quantity}
              priceInCents={product.price_in_cents}
            />

            {product.features && Array.isArray(product.features) && product.features.length > 0 && (
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Key Features</h3>
                <ul className="space-y-1">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs font-medium">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs font-medium">Secure Payment</p>
              </div>
              <div className="text-center">
                <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs font-medium">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-4 p-6 bg-muted rounded-lg">
            {product.description && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {product.feature_description && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Features</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.feature_description}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="specifications" className="p-6 bg-muted rounded-lg">
            {specifications && specifications.length > 0 ? (
              <div className="space-y-2">
                {specifications.map((spec: any) => (
                  <div key={spec.id} className="flex py-3 border-b last:border-0">
                    <span className="font-medium w-1/3">{spec.spec_key}</span>
                    <span className="text-muted-foreground w-2/3">{spec.spec_value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No specifications available</p>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-4 p-6 bg-muted rounded-lg">
            {product.product_type && (
              <div>
                <h4 className="font-semibold mb-2">Product Type</h4>
                <p className="text-muted-foreground capitalize">{product.product_type}</p>
              </div>
            )}

            {product.product_type_details && (
              <div>
                <h4 className="font-semibold mb-2">Additional Details</h4>
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {JSON.stringify(product.product_type_details, null, 2)}
                </pre>
              </div>
            )}

            {product.video_url && (
              <div>
                <h4 className="font-semibold mb-2">Product Video</h4>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={product.video_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {tags && tags.length > 0 && (
          <div className="mb-12 flex items-center gap-2 flex-wrap">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {tags.map((tag: any) => (
              <Badge key={tag.id} variant="secondary">
                {tag.tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Reviews Section */}
        <ReviewSection productId={product.id} reviews={reviews || []} />

        <div className="mt-12">
          <ProductQASection productId={product.id} />
        </div>

        <div className="mt-12">
          <RecentlyViewedProducts />
        </div>
      </div>
    </div>
  )
}
