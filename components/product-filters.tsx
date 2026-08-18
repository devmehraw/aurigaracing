"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductFiltersProps {
  categories: Category[]
  brands?: string[]
}

export function ProductFilters({ categories, brands = [] }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/products?${params.toString()}`)
  }

  const toggleFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.get(key)

    if (current === "true") {
      params.delete(key)
    } else {
      params.set(key, "true")
    }

    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/products")
  }

  const hasFilters = Array.from(searchParams.keys()).length > 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Filters</CardTitle>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={searchParams.get("category") || "all"}
            onValueChange={(value) => updateFilter("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Brand Filter */}
        {brands.length > 0 && (
          <div className="space-y-2">
            <Label>Brand</Label>
            <Select value={searchParams.get("brand") || "all"} onValueChange={(value) => updateFilter("brand", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Product Type Filter */}
        <div className="space-y-2">
          <Label>Product Type</Label>
          <Select
            value={searchParams.get("product_type") || "all"}
            onValueChange={(value) => updateFilter("product_type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="boot">Boots</SelectItem>
              <SelectItem value="frame">Frames</SelectItem>
              <SelectItem value="wheel">Wheels</SelectItem>
              <SelectItem value="bearing">Bearings</SelectItem>
              <SelectItem value="helmet">Helmets</SelectItem>
              <SelectItem value="accessory">Accessories</SelectItem>
              <SelectItem value="package">Packages</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stock Filter */}
        <div className="space-y-2">
          <Label>Availability</Label>
          <Select value={searchParams.get("stock") || "all"} onValueChange={(value) => updateFilter("stock", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="in_stock">In Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Deal of the Day Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="deal"
            checked={searchParams.get("deal") === "true"}
            onCheckedChange={() => toggleFilter("deal")}
          />
          <label
            htmlFor="deal"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Deal of the Day
          </label>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price Range</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="Min"
              value={searchParams.get("minPrice") || ""}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
              className="w-full"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={searchParams.get("maxPrice") || ""}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select value={searchParams.get("sort") || "newest"} onValueChange={(value) => updateFilter("sort", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Newest First" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="name">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
