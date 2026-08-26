"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckoutForm } from "@/components/checkout-form"
import { getImageKitUrl } from "@/lib/imagekit"
import type { CartItem, User } from "@/lib/types"

interface Address {
  id: string
  first_name: string
  last_name: string
  phone: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}

export function CheckoutSummary({
  cartItems,
  user,
  subtotal,
  addresses,
}: {
  cartItems: CartItem[]
  user: User | null
  subtotal: number
  addresses: Address[]
}) {
  const [shippingFeeInCents, setShippingFeeInCents] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = subtotal + shippingFeeInCents

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <CheckoutForm
          cartItems={cartItems}
          user={user}
          subtotal={subtotal}
          addresses={addresses}
          onSubmit={(loading, errorMsg) => {
            setIsLoading(loading)
            setError(errorMsg)
          }}
          onShippingChange={setShippingFeeInCents}
        />
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {cartItems.map((item: any) => {
                const primaryImage =
                  item.product?.product_gallery?.find((img: any) => img.is_primary)?.image_url ||
                  item.product?.product_gallery?.[0]?.image_url ||
                  item.product?.image_url

                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={getImageKitUrl(primaryImage || "/placeholder.svg")}
                        alt={item.product?.name || "Product"}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-bl">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">{item.product?.name}</h4>
                      {item.product?.brand && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.product.brand}</p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                        <span className="text-sm font-medium">
                          ${(((item.product?.price_in_cents || 0) * item.quantity) / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shippingFeeInCents > 0 ? `$${(shippingFeeInCents / 100).toFixed(2)}` : "Check PIN code"}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                {error}
              </div>
            )}

            <Button type="submit" form="checkout-form" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Placing order..." : "Place Order"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
