"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageKitUpload } from "@/components/imagekit-upload"
import { Loader2, AlertCircle, CheckCircle2, Plus, X, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { createBrowserClient } from "@/lib/supabase/client"

interface ProductFormProps {
  product?: any
  categories: any[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const [name, setName] = useState(product?.name || "")
  const [sku, setSku] = useState(product?.sku || "")
  const [slug, setSlug] = useState(product?.slug || "")
  const [description, setDescription] = useState(product?.description || "")
  const [shortDescription, setShortDescription] = useState(product?.short_description || "")
  const [featureDescription, setFeatureDescription] = useState(product?.feature_description || "")
  const [price, setPrice] = useState(product ? (product.price_in_cents / 100).toString() : "")
  const [originalPrice, setOriginalPrice] = useState(
    product?.original_price_in_cents ? (product.original_price_in_cents / 100).toString() : "",
  )
  const [discountPercentage, setDiscountPercentage] = useState(product?.discount_percentage?.toString() || "")
  const [categoryIds, setCategoryIds] = useState<string[]>(product?.categoryIds || [])
  const [imageUrl, setImageUrl] = useState(product?.image_url || "")
  const [gallery, setGallery] = useState<string[]>(product?.gallery || [])
  const [tags, setTags] = useState<string[]>(product?.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [brand, setBrand] = useState(product?.brand || "")
  const [videoUrl, setVideoUrl] = useState(product?.video_url || "")
  const [status, setStatus] = useState(product?.status || "draft")
  const [stockQuantity, setStockQuantity] = useState(product?.stock_quantity?.toString() || "0")
  const [isActive, setIsActive] = useState(product?.is_active ?? true)
  const [productType, setProductType] = useState(product?.product_type || "")
  const [productTypeDetails, setProductTypeDetails] = useState<any>(product?.product_type_details || {})
  const [specifications, setSpecifications] = useState<Array<{ key: string; value: string }>>(
    product?.specifications
      ? Object.entries(product.specifications).map(([key, value]) => ({ key, value: String(value) }))
      : [],
  )
  const [features, setFeatures] = useState<string[]>(product?.features || [])
  const [featureInput, setFeatureInput] = useState("")

  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!product && name && !sku) {
      const generatedSku = name
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 20)
      setSku(`SKU-${generatedSku}-${Date.now().toString().substring(-4)}`)
    }
  }, [name, product, sku])

  useEffect(() => {
    if (!product && name && !slug) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
      setSlug(generatedSlug)
    }
  }, [name, product, slug])

  useEffect(() => {
    if (originalPrice && price) {
      const original = Number.parseFloat(originalPrice)
      const sale = Number.parseFloat(price)
      if (original > 0 && sale > 0 && original > sale) {
        const discount = Math.round(((original - sale) / original) * 100)
        setDiscountPercentage(discount.toString())
      }
    }
  }, [originalPrice, price])

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const addFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      setFeatures([...features, featureInput.trim()])
      setFeatureInput("")
    }
  }

  const removeFeature = (feature: string) => {
    setFeatures(features.filter((f) => f !== feature))
  }

  const addGalleryImage = (url: string) => {
    setGallery([...gallery, url])
  }

  const removeGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index))
  }

  const toggleCategory = (categoryId: string) => {
    setCategoryIds((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("[v0] Form submission started")
    setIsSaving(true)
    setMessage(null)

    const supabase = createBrowserClient()

    try {
      if (!name.trim()) throw new Error("Product name is required")
      if (!slug.trim()) throw new Error("Product slug is required")
      if (!imageUrl) throw new Error("Please upload a product image")
      if (categoryIds.length === 0) throw new Error("Please select at least one category")

      const priceInCents = Math.round(Number.parseFloat(price) * 100)
      const stock = Number.parseInt(stockQuantity)

      if (isNaN(priceInCents) || priceInCents <= 0) {
        throw new Error("Please enter a valid price")
      }

      if (isNaN(stock) || stock < 0) {
        throw new Error("Please enter a valid stock quantity")
      }

      console.log("[v0] Validation passed")

      const productData = {
        name: name.trim(),
        sku: sku.trim(),
        slug: slug.trim(),
        description: description.trim(),
        short_description: shortDescription.trim(),
        feature_description: featureDescription.trim(),
        price_in_cents: priceInCents,
        original_price_in_cents: originalPrice ? Math.round(Number.parseFloat(originalPrice) * 100) : null,
        discount_percentage: discountPercentage ? Number.parseInt(discountPercentage) : null,
        category_id: categoryIds[0], // Primary category
        image_url: imageUrl,
        brand: brand.trim() || null,
        video_url: videoUrl.trim() || null,
        status: status,
        stock_quantity: stock,
        is_active: isActive,
        product_type: productType || null,
        product_type_details: productTypeDetails,
        specifications: specifications.reduce((acc, spec) => {
          acc[spec.key] = spec.value
          return acc
        }, {}),
        features: features,
        tags: tags,
        updated_at: new Date().toISOString(),
      }

      console.log("[v0] Product data prepared:", productData)

      const { data: savedProduct, error: productError } = product
        ? await supabase.from("products").update(productData).eq("id", product.id).select().single()
        : await supabase.from("products").insert(productData).select().single()

      if (productError) {
        console.error("[v0] Update error:", productError)
        throw new Error(productError.message || "Failed to update product")
      }

      await supabase
        .from("product_categories")
        .delete()
        .eq("product_id", product ? product.id : savedProduct.id)

      if (categoryIds.length > 0) {
        const categoryData = categoryIds.map((catId) => ({
          product_id: product ? product.id : savedProduct.id,
          category_id: catId,
        }))
        await supabase.from("product_categories").insert(categoryData)
      }

      await supabase
        .from("product_gallery")
        .delete()
        .eq("product_id", product ? product.id : savedProduct.id)

      if (gallery.length > 0) {
        const galleryData = gallery.map((url, index) => ({
          product_id: product ? product.id : savedProduct.id,
          image_url: url,
          display_order: index,
          is_primary: index === 0,
        }))
        await supabase.from("product_gallery").insert(galleryData)
      }

      console.log("[v0] Saving specifications...")
      // Delete existing specifications
      if (product) {
        await supabase.from("product_specifications").delete().eq("product_id", product.id)
      }

      // Insert new specifications
      const specificationsToInsert = specifications
        .filter((spec) => spec.key && spec.value) // Only save if both key and value exist
        .map((spec, index) => ({
          product_id: product ? product.id : savedProduct.id,
          spec_key: spec.key,
          spec_value: spec.value,
          display_order: index,
        }))

      if (specificationsToInsert.length > 0) {
        const { error: specsError } = await supabase.from("product_specifications").insert(specificationsToInsert)

        if (specsError) {
          console.error("[v0] Specifications save error:", specsError)
          throw specsError
        }
      }

      console.log("[v0] Product saved successfully!")
      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error("[v0] Form submission error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to save product"
      setMessage({ type: "error", text: errorMessage })
    } finally {
      setIsSaving(false)
    }
  }

  const renderProductTypeFields = () => {
    switch (productType) {
      case "boot":
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Sizes (comma separated)</Label>
                <Input
                  value={productTypeDetails.sizes || ""}
                  onChange={(e) => setProductTypeDetails({ ...productTypeDetails, sizes: e.target.value })}
                  placeholder="36, 37, 38, 39, 40, 41, 42"
                />
              </div>
              <div className="space-y-2">
                <Label>Colors (comma separated)</Label>
                <Input
                  value={productTypeDetails.colors || ""}
                  onChange={(e) => setProductTypeDetails({ ...productTypeDetails, colors: e.target.value })}
                  placeholder="Black, White, Red"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Mounting</Label>
                <Input
                  value={productTypeDetails.mounting || ""}
                  onChange={(e) => setProductTypeDetails({ ...productTypeDetails, mounting: e.target.value })}
                  placeholder="165mm, 195mm"
                />
              </div>
              <div className="space-y-2">
                <Label>Shell Material</Label>
                <Input
                  value={productTypeDetails.shell || ""}
                  onChange={(e) => setProductTypeDetails({ ...productTypeDetails, shell: e.target.value })}
                  placeholder="Carbon Fiber, Fiberglass"
                />
              </div>
            </div>
          </div>
        )

      case "frame":
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Frame Sizes (comma separated)</Label>
                <Input
                  value={productTypeDetails.frame_sizes || ""}
                  onChange={(e) => setProductTypeDetails({ ...productTypeDetails, frame_sizes: e.target.value })}
                  placeholder="12.8, 13.0, 13.4, 14.0"
                />
              </div>
              <div className="space-y-2">
                <Label>Frame Colors (comma separated)</Label>
                <Input
                  value={productTypeDetails.frame_colors || ""}
                  onChange={(e) => setProductTypeDetails({ ...productTypeDetails, frame_colors: e.target.value })}
                  placeholder="Black, Silver, Gold"
                />
              </div>
            </div>
          </div>
        )

      case "wheel":
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Wheel Sizes (comma separated)</Label>
                <Input
                  value={productTypeDetails.wheel_sizes || ""}
                  onChange={(e) => setProductTypeDetails({ ...productTypeDetails, wheel_sizes: e.target.value })}
                  placeholder="100mm, 110mm, 125mm"
                />
              </div>
              <div className="space-y-2">
                <Label>Wheel Hardness (comma separated)</Label>
                <Input
                  value={productTypeDetails.wheel_hardness || ""}
                  onChange={(e) => setProductTypeDetails({ ...productTypeDetails, wheel_hardness: e.target.value })}
                  placeholder="85A, 88A, 90A"
                />
              </div>
            </div>
          </div>
        )

      case "bearing":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Bearing Features</Label>
              <Textarea
                value={productTypeDetails.bearing_features || ""}
                onChange={(e) => setProductTypeDetails({ ...productTypeDetails, bearing_features: e.target.value })}
                placeholder="ABEC-9, Ceramic, Swiss"
                rows={3}
              />
            </div>
          </div>
        )

      case "helmet":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Helmet Sizes (comma separated)</Label>
              <Input
                value={productTypeDetails.helmet_sizes || ""}
                onChange={(e) => setProductTypeDetails({ ...productTypeDetails, helmet_sizes: e.target.value })}
                placeholder="S, M, L, XL"
              />
            </div>
          </div>
        )

      case "accessory":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Accessory Type</Label>
              <select
                value={productTypeDetails.accessory_type || ""}
                onChange={(e) => setProductTypeDetails({ ...productTypeDetails, accessory_type: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select Type</option>
                <option value="speed_suits">Speed Suits</option>
                <option value="ankle_bootie">Ankle Bootie</option>
                <option value="gloves">Gloves</option>
                <option value="hoodies">Hoodies</option>
                <option value="wheel_bag">Wheel Bag</option>
                <option value="backpack">Backpack</option>
                <option value="spacers">Spacers</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            {(productTypeDetails.accessory_type === "speed_suits" ||
              productTypeDetails.accessory_type === "hoodies" ||
              productTypeDetails.accessory_type === "gloves") && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Sizes (comma separated)</Label>
                  <Input
                    value={productTypeDetails.sizes || ""}
                    onChange={(e) => setProductTypeDetails({ ...productTypeDetails, sizes: e.target.value })}
                    placeholder="XS, S, M, L, XL, XXL"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Colors (comma separated)</Label>
                  <Input
                    value={productTypeDetails.colors || ""}
                    onChange={(e) => setProductTypeDetails({ ...productTypeDetails, colors: e.target.value })}
                    placeholder="Black, Blue, Red"
                  />
                </div>
              </div>
            )}
            {productTypeDetails.accessory_type === "custom" && (
              <div className="space-y-2">
                <Label>Custom Name *</Label>
                <Input
                  value={productTypeDetails.custom_name || ""}
                  onChange={(e) => setProductTypeDetails({ ...productTypeDetails, custom_name: e.target.value })}
                  placeholder="Enter custom accessory name"
                />
              </div>
            )}
          </div>
        )

      case "package":
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Skate Boot Sizes (comma separated)</Label>
                <Input
                  value={productTypeDetails.boot_sizes || ""}
                  onChange={(e) => setProductTypeDetails({ ...productTypeDetails, boot_sizes: e.target.value })}
                  placeholder="36, 37, 38, 39, 40, 41"
                />
              </div>
              <div className="space-y-2">
                <Label>Colors (comma separated)</Label>
                <Input
                  value={productTypeDetails.colors || ""}
                  onChange={(e) => setProductTypeDetails({ ...productTypeDetails, colors: e.target.value })}
                  placeholder="Black, White, Blue"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Inline Skate Frame</Label>
              <Input
                value={productTypeDetails.frame_type || ""}
                onChange={(e) => setProductTypeDetails({ ...productTypeDetails, frame_type: e.target.value })}
                placeholder="e.g., 4x100mm, 3x125mm"
              />
            </div>
          </div>
        )

      default:
        return <p className="text-sm text-muted-foreground">Select a product type to see type-specific fields</p>
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"} className="border-2">
          {message.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <AlertDescription className="font-medium">{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="type">Type</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Core product details and descriptions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Speed Skating Boots"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Auto-generated" />
                  <p className="text-xs text-muted-foreground">Unique product identifier</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="speed-skating-boots"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Auriga" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Brief product summary..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed product description..."
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feature_description">Feature Description</Label>
                <Textarea
                  id="feature_description"
                  value={featureDescription}
                  onChange={(e) => setFeatureDescription(e.target.value)}
                  placeholder="Highlight key features..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories *</CardTitle>
              <CardDescription>Select one or more categories for this product</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`cat-${category.id}`}
                      checked={categoryIds.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`cat-${category.id}`} className="cursor-pointer">
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Add searchable tags for this product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Enter tag and press Enter"
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Information</CardTitle>
              <CardDescription>Set product prices and discounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="original_price">Original Price (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="original_price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      className="pl-8"
                      placeholder="199.99"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Sale Price (USD) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="pl-8"
                      placeholder="149.99"
                      required
                    />
                  </div>
                </div>
              </div>

              {discountPercentage && (
                <Alert>
                  <AlertDescription className="font-medium">Discount: {discountPercentage}% off</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload product images and videos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Main Product Image *</Label>
                <ImageKitUpload value={imageUrl} onChange={setImageUrl} folder="products" />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Product Gallery</Label>
                <ImageKitUpload value="" onChange={addGalleryImage} folder="products/gallery" />
                <div className="grid gap-4 grid-cols-3 mt-4">
                  {gallery.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Gallery ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="video_url">Product Video URL</Label>
                <Input
                  id="video_url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="type" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Type</CardTitle>
              <CardDescription>Define product category-specific attributes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product_type">Product Type</Label>
                <select
                  id="product_type"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select Type</option>
                  <option value="boot">Boot</option>
                  <option value="frame">Frame</option>
                  <option value="wheel">Wheel</option>
                  <option value="bearing">Bearing</option>
                  <option value="helmet">Helmet</option>
                  <option value="accessory">Accessory</option>
                  <option value="package">Package</option>
                </select>
              </div>

              <Separator />

              {renderProductTypeFields()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Features</CardTitle>
              <CardDescription>List key product features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  placeholder="Enter feature and press Enter"
                />
                <Button type="button" onClick={addFeature} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span>{feature}</span>
                    <button type="button" onClick={() => removeFeature(feature)}>
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
                    <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
              <CardDescription>Add technical specifications for the product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {specifications.map((spec, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Label>Title</Label>
                    <Input
                      value={spec.key}
                      onChange={(e) => {
                        const newSpecs = [...specifications]
                        newSpecs[index].key = e.target.value
                        setSpecifications(newSpecs)
                      }}
                      placeholder="e.g., Weight, Material, Size"
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Value</Label>
                    <Input
                      value={spec.value}
                      onChange={(e) => {
                        const newSpecs = [...specifications]
                        newSpecs[index].value = e.target.value
                        setSpecifications(newSpecs)
                      }}
                      placeholder="e.g., 36kg, Carbon Fiber, Large"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSpecifications(specifications.filter((_, i) => i !== index))
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSpecifications([...specifications, { key: "", value: "" }])
                }}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Specification
              </Button>

              <p className="text-xs text-muted-foreground">
                Add product specifications as title-value pairs. Example: Weight: 36kg
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock & Status</CardTitle>
              <CardDescription>Manage inventory and product visibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Product Status</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="active">Active Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {isActive ? "Product is visible" : "Product is hidden"}
                  </p>
                </div>
                <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving || !imageUrl || categoryIds.length === 0}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>{product ? "Update Product" : "Create Product"}</>
          )}
        </Button>
      </div>
    </form>
  )
}
