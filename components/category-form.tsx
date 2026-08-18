"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { ImageKitUpload } from "@/components/imagekit-upload"

interface CategoryFormProps {
  category?: any
  categories?: any[]
}

export function CategoryForm({ category, categories = [] }: CategoryFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    image_url: category?.image_url || "",
    parent_id: category?.parent_id || null,
    is_active: category?.is_active ?? true,
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: !category ? generateSlug(name) : formData.slug,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createBrowserClient()

      if (category) {
        const { error } = await supabase.from("categories").update(formData).eq("id", category.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Category updated successfully",
        })
      } else {
        const { error } = await supabase.from("categories").insert(formData)

        if (error) throw error

        toast({
          title: "Success",
          description: "Category created successfully",
        })
      }

      router.push("/admin/categories")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter out current category from parent options to prevent circular reference
  const availableParents = categories.filter((c) => c.id !== category?.id)

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Speed Skating"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g., speed-skating"
            />
            <p className="text-xs text-muted-foreground">URL-friendly version of the name</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent">Parent Category</Label>
            <Select
              value={formData.parent_id || "none"}
              onValueChange={(value) => setFormData({ ...formData, parent_id: value === "none" ? null : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent category (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No parent (Main Category)</SelectItem>
                {availableParents
                  .filter((c) => !c.parent_id)
                  .map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Leave blank for main category, or select a parent for subcategory
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the category"
            />
          </div>

          <ImageKitUpload
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            folder="categories"
          />

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : category ? "Update Category" : "Create Category"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/categories")}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
