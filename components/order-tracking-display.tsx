"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react"

interface OrderTrackingDisplayProps {
  tracking: {
    tracking_number?: string
    carrier?: string
    status: string
    location?: string
    estimated_delivery?: string
    updated_at: string
  }
}

const statusIcons = {
  processing: Clock,
  shipped: Truck,
  in_transit: Truck,
  out_for_delivery: Package,
  delivered: CheckCircle,
}

const statusColors = {
  processing: "bg-blue-500",
  shipped: "bg-purple-500",
  in_transit: "bg-yellow-500",
  out_for_delivery: "bg-orange-500",
  delivered: "bg-green-500",
}

export function OrderTrackingDisplay({ tracking }: OrderTrackingDisplayProps) {
  const Icon = statusIcons[tracking.status as keyof typeof statusIcons] || Clock
  const statusColor = statusColors[tracking.status as keyof typeof statusColors] || "bg-gray-500"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          Order Tracking
        </CardTitle>
        <CardDescription>Track your order status and location</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status</span>
          <Badge className={statusColor}>{tracking.status.replace(/_/g, " ").toUpperCase()}</Badge>
        </div>

        {tracking.tracking_number && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tracking Number</span>
            <span className="text-sm font-mono">{tracking.tracking_number}</span>
          </div>
        )}

        {tracking.carrier && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Carrier</span>
            <span className="text-sm">{tracking.carrier}</span>
          </div>
        )}

        {tracking.location && (
          <div className="flex items-start justify-between">
            <span className="text-sm font-medium flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Current Location
            </span>
            <span className="text-sm text-right">{tracking.location}</span>
          </div>
        )}

        {tracking.estimated_delivery && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estimated Delivery</span>
            <span className="text-sm">{new Date(tracking.estimated_delivery).toLocaleDateString()}</span>
          </div>
        )}

        <div className="text-xs text-muted-foreground pt-2 border-t">
          Last updated: {new Date(tracking.updated_at).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  )
}
