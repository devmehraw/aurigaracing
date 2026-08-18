import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, ChevronLeft } from "lucide-react"
import { PageActions } from "@/components/page-actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function PagesManagementPage() {
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

  const { data: pages } = await supabase.from("front_pages").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/admin">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Pages Management</h1>
            <p className="text-muted-foreground mt-1">Manage website pages and SEO settings</p>
          </div>
          <Button asChild>
            <Link href="/admin/pages/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Page
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Pages</CardTitle>
            <CardDescription>Manage content, SEO, and Open Graph tags</CardDescription>
          </CardHeader>
          <CardContent>
            {pages && pages.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell className="text-muted-foreground">{page.slug}</TableCell>
                      <TableCell>
                        <Badge variant={page.is_published ? "default" : "secondary"}>
                          {page.is_published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(page.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <PageActions page={page} isAdmin={userData?.role === "admin"} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No pages yet</p>
                <Button asChild>
                  <Link href="/admin/pages/add">Add Your First Page</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
