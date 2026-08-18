import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PageForm } from "@/components/page-form"

export default async function EditPagePage({ params }: { params: { id: string } }) {
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

  const { data: page } = await supabase.from("front_pages").select("*").eq("id", params.id).single()

  if (!page) {
    redirect("/admin/pages")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Page</h1>
          <p className="text-muted-foreground mt-1">Update page content and SEO settings</p>
        </div>

        <PageForm page={page} />
      </div>
    </div>
  )
}
