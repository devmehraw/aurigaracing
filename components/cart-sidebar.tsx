"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/lib/supabase/client"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import Link from "next/link"

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price_in_cents: number
    image_url: string | null
  }
}

export function CartSidebar({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (open) {
      fetchCartItems()
    }
  }, [open])

  const fetchCartItems = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setCartItems([])
      setIsLoading(false)
      return
    }

    const { data } = await supabase
      .from("cart_items")
      .select("id, quantity, product:products(id, name, slug, price_in_cents, image_url)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    setCartItems(data || [])
    setIsLoading(false)
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setIsUpdating(itemId)
    const supabase = createClient()

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
      .eq("id", itemId)

    if (!error) {
      await fetchCartItems()
      router.refresh()
    }
    setIsUpdating(null)
  }

  const removeItem = async (itemId: string) => {
    setIsUpdating(itemId)
    const supabase = createClient()

    const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

    if (!error) {
      await fetchCartItems()
      router.refresh()
    }
    setIsUpdating(null)
  }

  const total = cartItems.reduce((sum, item) => sum + (item.product?.price_in_cents || 0) * item.quantity, 0)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({cartItems.length})
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mb-4">Add some products to get started</p>
            <Button asChild onClick={() => onOpenChange(false)}>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 -mx-6 px-6 my-6">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-4 border-b">
                    <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      {item.product?.image_url ? (
                        <img
                          src={
                            item.product.image_url?.startsWith("http")
                              ? item.product.image_url
                              : `https://ik.imagekit.io/aurigaracing${item.product.image_url}?tr=w-200,h-200,c-at_max,q-85`
                          }
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">No image</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product?.slug}`}
                        onClick={() => onOpenChange(false)}
                        className="font-medium text-sm hover:text-primary line-clamp-2"
                      >
                        {item.product?.name}
                      </Link>
                      <p className="text-sm font-semibold text-primary mt-1">
                        ${((item.product?.price_in_cents || 0) / 100).toFixed(2)}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isUpdating === item.id}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isUpdating === item.id}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive ml-auto"
                          onClick={() => removeItem(item.id)}
                          disabled={isUpdating === item.id}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>

              <div className="space-y-2">
                <Button asChild className="w-full" size="lg" onClick={() => onOpenChange(false)}>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                  size="lg"
                  onClick={() => onOpenChange(false)}
                >
                  <Link href="/cart">View Full Cart</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
