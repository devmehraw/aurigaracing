"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { Trash2, Plus, Minus } from "lucide-react"
import Link from "next/link"
import type { CartItem } from "@/lib/types"

export function CartItemsList({ items }: { items: CartItem[] }) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const router = useRouter()

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setIsUpdating(itemId)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("cart_items")
        .update({
          quantity: newQuantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", itemId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("[v0] Update cart error:", error)
    } finally {
      setIsUpdating(null)
    }
  }

  const removeItem = async (itemId: string) => {
    setIsUpdating(itemId)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("[v0] Remove cart item error:", error)
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                {item.product?.image_url ? (
                  <img
                    src={item.product.image_url || "/placeholder.svg"}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">No image</span>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link href={`/products/${item.product?.slug}`} className="font-semibold hover:text-primary">
                    {item.product?.name}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${((item.product?.price_in_cents || 0) / 100).toFixed(2)} each
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || isUpdating === item.id}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = Number.parseInt(e.target.value)
                        if (val > 0) updateQuantity(item.id, val)
                      }}
                      className="h-8 w-16 text-center"
                      disabled={isUpdating === item.id}
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={isUpdating === item.id}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive"
                    onClick={() => removeItem(item.id)}
                    disabled={isUpdating === item.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold">${(((item.product?.price_in_cents || 0) * item.quantity) / 100).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
