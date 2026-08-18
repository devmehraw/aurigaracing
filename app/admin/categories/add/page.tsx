import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CategoryForm } from "@/components/category-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function AddCategoryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (userData?.role !== "admin" && userData?.role !== "manager") {
    redirect("/")
  }

  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/admin/categories">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add New Category</h1>
          <p className="text-muted-foreground mt-1">Create a new product category</p>
        </div>

        <CategoryForm categories={categories || []} />
      </div>
    </div>
  )
}
