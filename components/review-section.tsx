import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import type { Review } from "@/lib/types"
import { AddReviewForm } from "@/components/add-review-form"

export function ReviewSection({
  productId,
  reviews,
}: {
  productId: string
  reviews: Review[]
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground mb-6">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-4 mb-6">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        {review.user?.first_name} {review.user?.last_name}
                      </CardTitle>
                      <CardDescription>
                        {new Date(review.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= review.rating ? "fill-primary text-primary" : "text-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                {review.comment && (
                  <CardContent>
                    <p className="text-sm leading-relaxed">{review.comment}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddReviewForm productId={productId} />
    </div>
  )
}
