"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Eye, Edit, X, Trash2, FileText, Archive } from "lucide-react"
import Link from "next/link"
import { getImageKitUrl } from "@/lib/imagekit"
import Image from "next/image"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Product {
  id: string
  name: string
  slug: string
  brand: string | null
  sku: string | null
  price_in_cents: number
  original_price_in_cents: number | null
  discount_percentage: number | null
  stock_quantity: number
  is_active: boolean
  status: string
  product_type: string | null
  deal_of_the_day: boolean | null
  image_url: string | null
  created_at: string
  categories: { name: string }[]
}

interface AdminProductsTableProps {
  products: Product[]
}

export function AdminProductsTable({ products }: AdminProductsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [productTypeFilter, setProductTypeFilter] = useState<string>("all")
  const [dealFilter, setDealFilter] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<string>("all")
  const [brandFilter, setBrandFilter] = useState<string>("all")
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient()

  const uniqueBrands = useMemo(() => {
    const brands = products.map((p) => p.brand).filter((brand): brand is string => brand !== null)
    return Array.from(new Set(brands)).sort()
  }, [products])

  const uniqueProductTypes = useMemo(() => {
    const types = products.map((p) => p.product_type).filter((type): type is string => type !== null)
    return Array.from(new Set(types)).sort()
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        product.name.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.categories.some((cat) => cat.name.toLowerCase().includes(searchLower))

      const matchesStatus = statusFilter === "all" || product.status === statusFilter

      const matchesActive =
        activeFilter === "all" ||
        (activeFilter === "active" && product.is_active) ||
        (activeFilter === "inactive" && !product.is_active)

      const matchesProductType = productTypeFilter === "all" || product.product_type === productTypeFilter

      const matchesDeal =
        dealFilter === "all" ||
        (dealFilter === "yes" && product.deal_of_the_day) ||
        (dealFilter === "no" && !product.deal_of_the_day)

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in_stock" && product.stock_quantity > 0) ||
        (stockFilter === "low_stock" && product.stock_quantity > 0 && product.stock_quantity <= 10) ||
        (stockFilter === "out_of_stock" && product.stock_quantity === 0)

      const matchesBrand = brandFilter === "all" || product.brand === brandFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesActive &&
        matchesProductType &&
        matchesDeal &&
        matchesStock &&
        matchesBrand
      )
    })
  }, [products, searchQuery, statusFilter, activeFilter, productTypeFilter, dealFilter, stockFilter, brandFilter])

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setActiveFilter("all")
    setProductTypeFilter("all")
    setDealFilter("all")
    setStockFilter("all")
    setBrandFilter("all")
    setSelectedProducts(new Set())
    setIsAllSelected(false)
  }

  const activeFilterCount = [
    searchQuery,
    statusFilter !== "all",
    activeFilter !== "all",
    productTypeFilter !== "all",
    dealFilter !== "all",
    stockFilter !== "all",
    brandFilter !== "all",
  ].filter(Boolean).length

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedProducts(new Set())
      setIsAllSelected(false)
    } else {
      setSelectedProducts(new Set(filteredProducts.map((p) => p.id)))
      setIsAllSelected(true)
    }
  }

  const toggleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts)
    if (newSelected.has(productId)) {
      newSelected.delete(productId)
    } else {
      newSelected.add(productId)
    }
    setSelectedProducts(newSelected)
    setIsAllSelected(newSelected.size === filteredProducts.length)
  }

  const handleBulkStatusChange = async (status: string) => {
    if (selectedProducts.size === 0) return

    setIsProcessing(true)
    try {
      const { error } = await supabase.from("products").update({ status }).in("id", Array.from(selectedProducts))

      if (error) throw error

      router.refresh()
      setSelectedProducts(new Set())
      setIsAllSelected(false)
    } catch (error) {
      console.error("Error updating products:", error)
      alert("Failed to update products")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return

    setIsProcessing(true)
    try {
      await supabase.from("product_categories").delete().in("product_id", Array.from(selectedProducts))
      await supabase.from("product_gallery").delete().in("product_id", Array.from(selectedProducts))
      await supabase.from("product_specifications").delete().in("product_id", Array.from(selectedProducts))
      await supabase.from("product_tags").delete().in("product_id", Array.from(selectedProducts))

      const { error } = await supabase.from("products").delete().in("id", Array.from(selectedProducts))

      if (error) throw error

      router.refresh()
      setSelectedProducts(new Set())
      setIsAllSelected(false)
      setShowDeleteDialog(false)
    } catch (error) {
      console.error("Error deleting products:", error)
      alert("Failed to delete products")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, SKU, brand, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear ({activeFilterCount})
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Active Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={productTypeFilter} onValueChange={setProductTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Product Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueProductTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {uniqueBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={dealFilter} onValueChange={setDealFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Deal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="yes">Deal of the Day</SelectItem>
                  <SelectItem value="no">Regular</SelectItem>
                </SelectContent>
              </Select>

              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock (≤10)</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedProducts.size > 0 ? (
            <span className="font-medium">
              {selectedProducts.size} of {filteredProducts.length} selected
            </span>
          ) : (
            <span>
              Showing {filteredProducts.length} of {products.length} products
            </span>
          )}
        </div>

        {selectedProducts.size > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatusChange("published")}
              disabled={isProcessing}
            >
              <FileText className="h-4 w-4 mr-2" />
              Publish
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkStatusChange("draft")} disabled={isProcessing}>
              <FileText className="h-4 w-4 mr-2" />
              Draft
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatusChange("archived")}
              disabled={isProcessing}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)} disabled={isProcessing}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} />
                  </TableHead>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.has(product.id)}
                          onCheckedChange={() => toggleSelectProduct(product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="w-16 h-16 relative bg-muted rounded-md overflow-hidden">
                          {product.image_url ? (
                            <Image
                              src={
                                getImageKitUrl(product.image_url, { width: 64, height: 64 || "/placeholder.svg" }) ||
                                "/placeholder.svg"
                              }
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                              No image
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{product.name}</p>
                          {product.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {product.categories.slice(0, 2).map((cat) => (
                                <Badge key={cat.name} variant="outline" className="text-xs">
                                  {cat.name}
                                </Badge>
                              ))}
                              {product.categories.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{product.categories.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                          {product.deal_of_the_day && (
                            <Badge variant="destructive" className="text-xs">
                              Deal of the Day
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{product.brand || "-"}</TableCell>
                      <TableCell>
                        {product.sku ? <span className="font-mono text-xs">{product.sku}</span> : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">${(product.price_in_cents / 100).toFixed(2)}</p>
                          {product.original_price_in_cents && product.discount_percentage && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground line-through">
                                ${(product.original_price_in_cents / 100).toFixed(2)}
                              </span>
                              <Badge variant="destructive" className="text-xs">
                                -{product.discount_percentage}%
                              </Badge>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.stock_quantity === 0
                              ? "destructive"
                              : product.stock_quantity <= 10
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {product.stock_quantity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {product.product_type ? <Badge variant="default">{product.product_type}</Badge> : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={product.is_active ? "default" : "secondary"} className="w-fit">
                            {product.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline" className="w-fit">
                            {product.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/products/${product.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedProducts.size} product{selectedProducts.size > 1 ? "s" : ""} and all
              associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} disabled={isProcessing} className="bg-destructive">
              {isProcessing ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
