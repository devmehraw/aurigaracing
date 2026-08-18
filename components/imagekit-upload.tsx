"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadToImageKit } from "@/lib/imagekit-upload"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"

export function ImageKitUpload({
  value,
  onChange,
  folder = "products",
  label = "Image",
}: {
  value?: string
  onChange: (url: string) => void
  folder?: string
  label?: string
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      console.log("[v0] Starting file upload...")
      const url = await uploadToImageKit(file, folder)
      console.log("[v0] Upload complete, URL:", url)
      onChange(url)
    } catch (err) {
      console.error("[v0] Upload failed:", err)
      setError(err instanceof Error ? err.message : "Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className="space-y-4">
      {label && <Label>{label}</Label>}
      {value ? (
        <div className="relative">
          <div className="relative w-full h-64 border rounded-lg overflow-hidden bg-muted">
            <Image src={value || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-muted">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <Label htmlFor={`image-upload-${folder}`} className="cursor-pointer">
                <span className="text-sm font-medium text-primary hover:underline">Click to upload</span>
                <span className="text-sm text-muted-foreground"> or drag and drop</span>
                <Input
                  id={`image-upload-${folder}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </Label>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>
          {isUploading && (
            <div className="mt-4 flex items-center justify-center gap-2 text-primary">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">Uploading image...</span>
            </div>
          )}
          {error && (
            <div className="mt-4 p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
