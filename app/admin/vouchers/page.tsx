import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Ticket } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default async function VouchersPage() {
  const supabase = await createClient()

  const { data: vouchers } = await supabase.from("vouchers").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vouchers & Gift Cards</h1>
          <p className="text-muted-foreground">Manage discount codes and promotions</p>
        </div>
        <Button asChild>
          <Link href="/admin/vouchers/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Voucher
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {vouchers && vouchers.length > 0 ? (
          vouchers.map((voucher) => (
            <Card key={voucher.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5" />
                    {voucher.code}
                  </CardTitle>
                  <Badge variant={voucher.is_active ? "default" : "secondary"}>
                    {voucher.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Discount</p>
                    <p className="font-medium">
                      {voucher.discount_type === "percentage"
                        ? `${voucher.discount_value}%`
                        : `₹${(voucher.discount_value / 100).toFixed(2)}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Usage</p>
                    <p className="font-medium">
                      {voucher.current_uses} / {voucher.max_uses || "∞"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valid From</p>
                    <p className="font-medium">{format(new Date(voucher.valid_from), "MMM dd, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valid Until</p>
                    <p className="font-medium">
                      {voucher.valid_until ? format(new Date(voucher.valid_until), "MMM dd, yyyy") : "No expiry"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No vouchers created yet</p>
          </Card>
        )}
      </div>
    </div>
  )
}
