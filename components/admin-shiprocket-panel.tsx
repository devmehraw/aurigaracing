"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Truck, Loader2 } from "lucide-react"
import { createShiprocketOrderForOrder, refreshOrderTracking } from "@/app/actions/shipping"
import { useToast } from "@/hooks/use-toast"

export function AdminShiprocketPanel({
  orderId,
  shiprocketShipmentId,
  shiprocketOrderId,
  awbCode,
  courierName,
  estimatedDeliveryDays,
  shippingFeeInCents,
}: {
  orderId: string
  shiprocketShipmentId?: number
  shiprocketOrderId?: number
  awbCode?: string
  courierName?: string
  estimatedDeliveryDays?: string
  shippingFeeInCents?: number
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handlePush = async () => {
    setLoading(true)
    const result = await createShiprocketOrderForOrder(orderId)
    setLoading(false)
    if (result.error) {
      toast({ title: "Failed to create shipment", description: result.error, variant: "destructive" })
      return
    }
    toast({ title: "Shipment created in Shiprocket" })
    router.refresh()
  }

  const handleRefresh = async () => {
    setLoading(true)
    const result = await refreshOrderTracking(orderId)
    setLoading(false)
    if (result.error) {
      toast({ title: "Unable to refresh tracking", description: result.error, variant: "destructive" })
      return
    }
    toast({ title: "Tracking updated" })
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Shiprocket Shipment
        </CardTitle>
        <CardDescription>Fulfillment status with Shiprocket</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {shiprocketShipmentId ? (
          <>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipment ID</span>
                <span className="font-mono">{shiprocketShipmentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono">{shiprocketOrderId}</span>
              </div>
              {awbCode && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AWB Code</span>
                  <span className="font-mono">{awbCode}</span>
                </div>
              )}
              {courierName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Courier</span>
                  <span>{courierName}</span>
                </div>
              )}
              {estimatedDeliveryDays && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Delivery</span>
                  <span>{estimatedDeliveryDays}</span>
                </div>
              )}
              {typeof shippingFeeInCents === "number" && shippingFeeInCents > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping Fee</span>
                  <span>${(shippingFeeInCents / 100).toFixed(2)}</span>
                </div>
              )}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Refresh Tracking
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">This order hasn&apos;t been pushed to Shiprocket yet.</p>
            <Button type="button" size="sm" onClick={handlePush} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Push to Shiprocket
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
