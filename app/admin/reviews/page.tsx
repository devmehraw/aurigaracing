import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, Star } from "lucide-react"
import { ReviewActions } from "@/components/review-actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function ReviewsManagementPage() {
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

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, product:products(name), user:users(first_name, last_name)")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/admin">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Reviews Management</h1>
          <p className="text-muted-foreground mt-1">Manage customer product reviews</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Reviews</CardTitle>
            <CardDescription>View and moderate customer reviews</CardDescription>
          </CardHeader>
          <CardContent>
            {reviews && reviews.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">{review.product?.name || "Unknown"}</TableCell>
                      <TableCell>
                        {review.user?.first_name} {review.user?.last_name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span>{review.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md truncate">{review.comment || "No comment"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <ReviewActions review={review} isAdmin={userData?.role === "admin"} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No reviews yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
