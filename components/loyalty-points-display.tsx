"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Award, TrendingUp } from "lucide-react"

export function LoyaltyPointsDisplay() {
  const [points, setPoints] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPoints() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase.from("loyalty_points").select("*").eq("user_id", user.id).single()

      setPoints(data)
      setLoading(false)
    }

    fetchPoints()
  }, [])

  if (loading || !points) return null

  const tierColors = {
    bronze: "bg-orange-100 text-orange-800",
    silver: "bg-gray-100 text-gray-800",
    gold: "bg-yellow-100 text-yellow-800",
    platinum: "bg-purple-100 text-purple-800",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Loyalty Rewards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Available Points</p>
            <p className="text-3xl font-bold">{points.total_points}</p>
          </div>
          <Badge className={tierColors[points.tier as keyof typeof tierColors]}>{points.tier.toUpperCase()}</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>Lifetime: {points.lifetime_points} points</span>
        </div>
      </CardContent>
    </Card>
  )
}
