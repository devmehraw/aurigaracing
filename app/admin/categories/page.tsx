import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, ChevronLeft } from "lucide-react"
import { CategoryActions } from "@/components/category-actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function CategoriesManagementPage() {
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

  const { data: categories } = await supabase
    .from("categories")
    .select("*, parent:categories!parent_id(name), products(count)")
    .order("name", { ascending: true })

  // Group categories by parent
  const mainCategories = categories?.filter((c) => !c.parent_id) || []
  const subCategories = categories?.filter((c) => c.parent_id) || []

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
            <h1 className="text-3xl font-bold">Categories Management</h1>
            <p className="text-muted-foreground mt-1">Manage product categories and subcategories</p>
          </div>
          <Button asChild>
            <Link href="/admin/categories/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
            <CardDescription>View and manage all product categories</CardDescription>
          </CardHeader>
          <CardContent>
            {categories && categories.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mainCategories.map((category) => (
                    <>
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Main Category</Badge>
                        </TableCell>
                        <TableCell>{category.products?.[0]?.count || 0}</TableCell>
                        <TableCell>
                          <Badge variant={category.is_active ? "default" : "secondary"}>
                            {category.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <CategoryActions category={category} isAdmin={userData?.role === "admin"} />
                        </TableCell>
                      </TableRow>
                      {/* Show subcategories */}
                      {subCategories
                        .filter((sub) => sub.parent_id === category.id)
                        .map((subCat) => (
                          <TableRow key={subCat.id} className="bg-muted/30">
                            <TableCell className="font-medium pl-8">↳ {subCat.name}</TableCell>
                            <TableCell className="text-muted-foreground">{subCat.slug}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{category.name}</Badge>
                            </TableCell>
                            <TableCell>{subCat.products?.[0]?.count || 0}</TableCell>
                            <TableCell>
                              <Badge variant={subCat.is_active ? "default" : "secondary"}>
                                {subCat.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <CategoryActions category={subCat} isAdmin={userData?.role === "admin"} />
                            </TableCell>
                          </TableRow>
                        ))}
                    </>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No categories yet</p>
                <Button asChild>
                  <Link href="/admin/categories/add">Add Your First Category</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
