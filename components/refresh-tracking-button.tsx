"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { refreshOrderTracking } from "@/app/actions/shipping"
import { useToast } from "@/hooks/use-toast"

export function RefreshTrackingButton({ orderId }: { orderId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

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
    <Button type="button" variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
      Refresh Tracking
    </Button>
  )
}
