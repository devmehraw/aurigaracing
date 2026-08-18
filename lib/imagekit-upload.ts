import { IMAGEKIT_CONFIG } from "./imagekit"

// Server-side upload with authentication
export async function uploadToImageKitServer(file: File, folder = "products"): Promise<string> {
  try {
    console.log("[v0] Starting ImageKit upload...")

    // Get authentication parameters from server
    const authResponse = await fetch("/api/imagekit-auth")
    if (!authResponse.ok) {
      const errorText = await authResponse.text()
      console.error("[v0] Auth response error:", errorText)
      throw new Error("Failed to get ImageKit authentication")
    }
    const authData = await authResponse.json()
    console.log("[v0] Got auth data:", { token: authData.token, expire: authData.expire })

    const formData = new FormData()
    formData.append("file", file)
    formData.append("publicKey", IMAGEKIT_CONFIG.publicKey)
    formData.append("folder", folder)
    formData.append("fileName", `${Date.now()}-${file.name}`)
    formData.append("signature", authData.signature)
    formData.append("expire", authData.expire.toString())
    formData.append("token", authData.token)

    console.log("[v0] Uploading to ImageKit...")
    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Upload error:", errorData)
      throw new Error(errorData.message || "Failed to upload image to ImageKit")
    }

    const data = await response.json()
    console.log("[v0] Upload successful:", data.url)
    return data.url
  } catch (error) {
    console.error("[v0] Upload error:", error)
    throw error
  }
}

// Legacy function for backward compatibility
export async function uploadToImageKit(file: File, folder = "products"): Promise<string> {
  return uploadToImageKitServer(file, folder)
}
