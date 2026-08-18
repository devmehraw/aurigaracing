"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "./ui/button"
import { Bell } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { toast } from "sonner"

interface PriceAlertButtonProps {
  productId: string
  currentPrice: number
}

export function PriceAlertButton({ productId, currentPrice }: PriceAlertButtonProps) {
  const [open, setOpen] = useState(false)
  const [targetPrice, setTargetPrice] = useState("")
  const [loading, setLoading] = useState(false)

  async function createAlert() {
    if (!targetPrice || Number.parseFloat(targetPrice) >= currentPrice / 100) {
      toast.error("Target price must be lower than current price")
      return
    }

    setLoading(true)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      toast.error("Please login to set price alerts")
      setLoading(false)
      return
    }

    const { error } = await supabase.from("price_alerts").insert({
      user_id: user.id,
      product_id: productId,
      target_price_in_cents: Math.round(Number.parseFloat(targetPrice) * 100),
      is_active: true,
    })

    if (!error) {
      toast.success("Price alert created! We'll notify you when the price drops.")
      setOpen(false)
      setTargetPrice("")
    } else if (error.code === "23505") {
      toast.info("You already have an alert for this product")
    } else {
      toast.error("Failed to create alert")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Bell className="h-4 w-4 mr-2" />
          Price Alert
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Price Alert</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Current Price</Label>
            <div className="text-2xl font-bold">₹{(currentPrice / 100).toFixed(2)}</div>
          </div>
          <div>
            <Label htmlFor="targetPrice">Notify me when price drops to</Label>
            <Input
              id="targetPrice"
              type="number"
              step="0.01"
              placeholder="Enter target price"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
            />
          </div>
          <Button onClick={createAlert} disabled={loading} className="w-full">
            Create Alert
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
