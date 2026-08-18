"use client"

import Image from "next/image"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { getImageKitUrl } from "@/lib/imagekit"

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  dealOfTheDay?: boolean
  hasDiscount?: boolean
  discountPercentage?: number
}

export function ProductImageGallery({
  images,
  productName,
  dealOfTheDay,
  hasDiscount,
  discountPercentage,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  const handleImageError = (index: number) => {
    console.log("[v0] Image load error:", images[index])
    setImageErrors((prev) => ({ ...prev, [index]: true }))
  }

  const mainImage = images.length > 0 ? images[selectedImage] : null

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
        {mainImage && !imageErrors[selectedImage] ? (
          <Image
            src={getImageKitUrl(mainImage) || "/placeholder.svg?height=800&width=800"}
            alt={productName}
            fill
            className="object-cover"
            priority
            onError={() => handleImageError(selectedImage)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No image available</p>
          </div>
        )}
        {dealOfTheDay && <Badge className="absolute top-4 left-4 bg-red-500 text-white">Deal of the Day</Badge>}
        {hasDiscount && (
          <Badge className="absolute top-4 right-4 bg-green-600 text-white">{discountPercentage}% OFF</Badge>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 4).map((image, index) => (
            <div
              key={index}
              className={`aspect-square bg-muted rounded-lg overflow-hidden relative cursor-pointer border-2 transition ${
                selectedImage === index ? "border-primary" : "border-transparent hover:border-primary/50"
              }`}
              onClick={() => setSelectedImage(index)}
            >
              {!imageErrors[index] ? (
                <Image
                  src={getImageKitUrl(image) || "/placeholder.svg?height=200&width=200"}
                  alt={`${productName} ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(index)}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-xs text-muted-foreground">No image</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
