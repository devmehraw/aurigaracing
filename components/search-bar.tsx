"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, Loader2, Tag, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SearchResult {
  id: string
  name: string
  slug: string
  price_in_cents: number
  image_url: string
  brand?: string
}

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Search products and categories
  useEffect(() => {
    const searchProducts = async () => {
      if (query.trim().length < 2) {
        setResults([])
        setCategories([])
        setBrands([])
        return
      }

      setIsLoading(true)
      const supabase = createClient()

      try {
        const { data: products } = await supabase
          .from("products")
          .select(`
            id,
            name,
            slug,
            price_in_cents,
            image_url,
            brand
          `)
          .eq("is_active", true)
          .eq("status", "published")
          .or(`name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(5)

        const { data: cats } = await supabase
          .from("categories")
          .select("name, slug")
          .eq("is_active", true)
          .ilike("name", `%${query}%`)
          .limit(3)

        const { data: brandData } = await supabase
          .from("products")
          .select("brand")
          .eq("is_active", true)
          .eq("status", "published")
          .not("brand", "is", null)
          .ilike("brand", `%${query}%`)
          .limit(5)

        const uniqueBrands = [...new Set(brandData?.map((item) => item.brand).filter(Boolean) as string[])]

        setResults(products || [])
        setCategories(cats || [])
        setBrands(uniqueBrands)
        setShowResults(true)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`)
      setShowResults(false)
      setQuery("")
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products, categories, or brands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowResults(true)}
            className="pl-10 pr-10"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (results.length > 0 || categories.length > 0 || brands.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
          {/* Categories Section */}
          {categories.length > 0 && (
            <div className="p-2 border-b">
              <p className="text-xs font-semibold text-muted-foreground px-2 mb-2 flex items-center gap-2">
                <Tag className="h-3 w-3" />
                Categories
              </p>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/products/category/${category.slug}`}
                  onClick={() => {
                    setShowResults(false)
                    setQuery("")
                  }}
                  className="block px-3 py-2 hover:bg-accent rounded-md text-sm text-black"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          {/* Brands Section */}
          {brands.length > 0 && (
            <div className="p-2 border-b">
              <p className="text-xs font-semibold text-muted-foreground px-2 mb-2 flex items-center gap-2">
                <Package className="h-3 w-3" />
                Brands
              </p>
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    router.push(`/products?brand=${encodeURIComponent(brand)}`)
                    setShowResults(false)
                    setQuery("")
                  }}
                  className="block w-full text-left px-3 py-2 hover:bg-accent rounded-md text-sm"
                >
                  {brand}
                </button>
              ))}
            </div>
          )}

          {/* Products Section */}
          {results.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-semibold text-muted-foreground px-2 mb-2">Products</p>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={() => {
                    setShowResults(false)
                    setQuery("")
                  }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-md"
                >
                  {product.image_url && (
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">${(product.price_in_cents / 100).toFixed(2)}</p>
                      {product.brand && <span className="text-xs text-muted-foreground">• {product.brand}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* View All Results */}
          <div className="p-2 border-t">
            <button
              onClick={() => {
                router.push(`/products?search=${encodeURIComponent(query)}`)
                setShowResults(false)
                setQuery("")
              }}
              className="w-full text-center text-sm text-primary hover:underline py-2"
            >
              View all results for "{query}"
            </button>
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults &&
        query.length >= 2 &&
        !isLoading &&
        results.length === 0 &&
        categories.length === 0 &&
        brands.length === 0 && (
          <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg z-50 p-4 text-center">
            <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
          </div>
        )}
    </div>
  )
}
