"use client"

import { useState } from "react"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { WishlistButton } from "@/components/wishlist-button"
import { ProductOptionSelector } from "@/components/product-option-selector"
import { ProductComparisonButton } from "@/components/product-comparison-button"
import { PriceAlertButton } from "@/components/price-alert-button"
import { StockNotificationButton } from "@/components/stock-notification-button"
import { SocialShareButtons } from "@/components/social-share-buttons"

interface ProductDetailClientProps {
  productId: string
  productName: string
  productImage?: string
  productType: string | null
  productTypeDetails: any
  stockQuantity: number
  priceInCents: number
}

export function ProductDetailClient({
  productId,
  productName,
  productImage,
  productType,
  productTypeDetails,
  stockQuantity,
  priceInCents,
}: ProductDetailClientProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [showError, setShowError] = useState(false)

  // Determine if product has selectable options
  const hasOptions = productType && productTypeDetails && Object.keys(productTypeDetails).length > 0

  const handleAddToCart = () => {
    // Check if all required options are selected
    if (hasOptions) {
      const requiredFields = Object.keys(productTypeDetails).filter(
        (key) => productTypeDetails[key] && productTypeDetails[key].toString().includes(","),
      )

      const allSelected = requiredFields.every((field) => selectedOptions[field])

      if (!allSelected) {
        setShowError(true)
        return false
      }
    }

    setShowError(false)
    return true
  }

  return (
    <div className="space-y-6">
      {hasOptions && (
        <ProductOptionSelector
          productType={productType}
          productTypeDetails={productTypeDetails}
          onSelectionChange={(selections) => {
            setSelectedOptions(selections)
            setShowError(false)
          }}
        />
      )}

      {showError && (
        <p className="text-sm text-destructive">Please select all required options before adding to cart</p>
      )}

      <div className="flex gap-3">
        <div className="flex-1">
          <AddToCartButton
            productId={productId}
            disabled={stockQuantity === 0}
            selectedOptions={selectedOptions}
            onBeforeAdd={handleAddToCart}
          />
        </div>
        <WishlistButton productId={productId} />
      </div>

      {stockQuantity === 0 && (
        <StockNotificationButton productId={productId} productName={productName} isInStock={false} />
      )}

      <div className="flex gap-3">
        <ProductComparisonButton productId={productId} />
        <PriceAlertButton productId={productId} currentPrice={priceInCents} />
      </div>

      <div className="border-t pt-6">
        <SocialShareButtons productId={productId} productName={productName} productImage={productImage} />
      </div>
    </div>
  )
}
