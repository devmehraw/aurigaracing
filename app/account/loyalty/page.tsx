import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Gift, TrendingUp } from "lucide-react"
import { format } from "date-fns"

export default async function LoyaltyPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Get or create loyalty points
  let { data: loyaltyData } = await supabase.from("loyalty_points").select("*").eq("user_id", user.id).single()

  if (!loyaltyData) {
    await supabase
      .from("loyalty_points")
      .insert({ user_id: user.id, total_points: 0, lifetime_points: 0, tier: "bronze" })

    loyaltyData = { total_points: 0, lifetime_points: 0, tier: "bronze" }
  }

  // Get transactions
  const { data: transactions } = await supabase
    .from("points_transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  const tierBenefits = {
    bronze: ["5% off on purchases", "Birthday bonus: 100 points"],
    silver: ["7% off on purchases", "Birthday bonus: 200 points", "Free shipping on orders over ₹5000"],
    gold: ["10% off on purchases", "Birthday bonus: 500 points", "Free shipping", "Early access to sales"],
    platinum: [
      "15% off on purchases",
      "Birthday bonus: 1000 points",
      "Free shipping",
      "Early access to sales",
      "Exclusive products",
    ],
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Loyalty Rewards</h1>
        <p className="text-muted-foreground">Earn points with every purchase</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Your Points
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Available Points</p>
              <p className="text-4xl font-bold">{loyaltyData.total_points}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Tier</span>
              <Badge variant="secondary" className="text-sm">
                {loyaltyData.tier.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Lifetime: {loyaltyData.lifetime_points} points</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Your Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tierBenefits[loyaltyData.tier as keyof typeof tierBenefits].map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#bd9131]">✓</span>
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions && transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.created_at), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div className={`font-semibold ${transaction.points > 0 ? "text-green-600" : "text-red-600"}`}>
                    {transaction.points > 0 ? "+" : ""}
                    {transaction.points}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No transactions yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
