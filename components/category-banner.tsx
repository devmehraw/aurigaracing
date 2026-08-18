"use client"

import { useState } from "react"

interface CategoryBannerProps {
  name: string
  description?: string | null
  imageUrl?: string | null
}

export function CategoryBanner({ name, description, imageUrl }: CategoryBannerProps) {
  const [imgError, setImgError] = useState(false)

  const categoryBannerUrl = imageUrl?.startsWith("http")
    ? imageUrl
    : imageUrl
      ? `https://ik.imagekit.io/aurigaracing${imageUrl}?tr=w-1920,h-400,c-at_max,q-85`
      : null

  if (!categoryBannerUrl || imgError) return null

  return (
    <div className="relative h-48 md:h-64 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <img
        src={categoryBannerUrl || "/placeholder.svg"}
        alt={name}
        className="w-full h-full object-cover opacity-40"
        onError={() => setImgError(true)}
      />
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{name}</h1>
          {description && <p className="text-lg text-gray-300">{description}</p>}
        </div>
      </div>
    </div>
  )
}
