"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface PageFormProps {
  page?: any
}

export function PageForm({ page }: PageFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: page?.title || "",
    slug: page?.slug || "",
    content: page?.content || "",
    meta_title: page?.meta_title || "",
    meta_description: page?.meta_description || "",
    og_title: page?.og_title || "",
    og_description: page?.og_description || "",
    og_image: page?.og_image || "",
    is_published: page?.is_published ?? true,
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: !page ? generateSlug(title) : formData.slug,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createBrowserClient()

      if (page) {
        const { error } = await supabase.from("front_pages").update(formData).eq("id", page.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Page updated successfully",
        })
      } else {
        const { error } = await supabase.from("front_pages").insert(formData)

        if (error) throw error

        toast({
          title: "Success",
          description: "Page created successfully",
        })
      }

      router.push("/admin/pages")
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Page title, slug, and content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Page Title *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., Privacy Policy"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g., privacy-policy"
            />
            <p className="text-xs text-muted-foreground">URL path: /{formData.slug}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              required
              rows={12}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Page content (supports markdown)"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked as boolean })}
            />
            <Label htmlFor="is_published" className="cursor-pointer">
              Publish page (make it publicly visible)
            </Label>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="seo">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="seo">SEO Settings</TabsTrigger>
          <TabsTrigger value="og">Open Graph</TabsTrigger>
        </TabsList>
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Meta Tags</CardTitle>
              <CardDescription>Optimize for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="SEO title (defaults to page title)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  rows={3}
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="Brief description for search results (150-160 characters)"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="og">
          <Card>
            <CardHeader>
              <CardTitle>Open Graph Tags</CardTitle>
              <CardDescription>Optimize for social media sharing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="og_title">OG Title</Label>
                <Input
                  id="og_title"
                  value={formData.og_title}
                  onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                  placeholder="Title for social media (defaults to page title)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og_description">OG Description</Label>
                <Textarea
                  id="og_description"
                  rows={3}
                  value={formData.og_description}
                  onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                  placeholder="Description for social media preview"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og_image">OG Image URL</Label>
                <Input
                  id="og_image"
                  type="url"
                  value={formData.og_image}
                  onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground">Recommended size: 1200x630px</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : page ? "Update Page" : "Create Page"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/pages")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
