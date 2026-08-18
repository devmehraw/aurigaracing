// ImageKit.io configuration and utilities
export const IMAGEKIT_CONFIG = {
  publicKey: "public_DCAr0Ht+qi8o+ZpjRo3vbWV3rR8=",
  urlEndpoint: "https://ik.imagekit.io/aurigaracing",
  imagekitId: "aurigaracing",
}

const IMAGEKIT_URL = "https://ik.imagekit.io/aurigaracing"

export function getImageKitUrl(path: string, transformations?: Record<string, string | number>) {
  if (!path) return null

  // If it's already a full URL (starts with http:// or https://), return as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const baseUrl = `${IMAGEKIT_URL}${normalizedPath}`

  if (!transformations) {
    return baseUrl
  }

  const params = Object.entries(transformations)
    .map(([key, value]) => `${key}-${value}`)
    .join(",")

  return `${baseUrl}?tr=${params}`
}

// Common transformation presets
export const imagekitPresets = {
  thumbnail: { w: 300, h: 300, c: "at_max", q: 80 },
  productCard: { w: 600, h: 600, c: "at_max", q: 85 },
  productDetail: { w: 1200, h: 1200, c: "at_max", q: 90 },
  hero: { w: 1920, h: 1080, c: "at_max", q: 85 },
  banner: { w: 1920, h: 600, c: "at_max", q: 85 },
}
