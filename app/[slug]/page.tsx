import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

const EXCLUDED_ROUTES = [
  "account",
  "admin",
  "manager",
  "products",
  "cart",
  "checkout",
  "auth",
  "about",
  "contact",
  "legal",
  "api",
]

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  if (EXCLUDED_ROUTES.includes(params.slug)) {
    return {
      title: "Page Not Found",
    }
  }

  const supabase = await createClient()

  const { data: page, error } = await supabase
    .from("front_pages")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .maybeSingle()

  if (!page || error) {
    return {
      title: "Page Not Found",
    }
  }

  return {
    title: page.meta_title || page.title,
    description: page.meta_description,
    openGraph: {
      title: page.og_title || page.title,
      description: page.og_description || page.meta_description,
      images: page.og_image ? [page.og_image] : [],
    },
  }
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  if (EXCLUDED_ROUTES.includes(params.slug)) {
    notFound()
  }

  const supabase = await createClient()

  const { data: page, error } = await supabase
    .from("front_pages")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .maybeSingle()

  if (!page || error) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">{page.title}</h1>

        <div className="prose prose-gray max-w-none">
          <div className="whitespace-pre-wrap text-muted-foreground">{page.content}</div>
        </div>
      </div>
    </div>
  )
}
