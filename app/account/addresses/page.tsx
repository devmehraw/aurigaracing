import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Plus } from "lucide-react"
import Link from "next/link"
import { AddressActions } from "@/components/address-actions"

export default async function AddressesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Addresses</h1>
            <p className="text-muted-foreground mt-1">Manage your shipping and billing addresses</p>
          </div>
          <Button asChild>
            <Link href="/account/addresses/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {addresses && addresses.length > 0 ? (
            addresses.map((address) => (
              <Card key={address.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">
                          {address.first_name} {address.last_name}
                          {address.is_default && (
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">Default</span>
                          )}
                        </CardTitle>
                        <CardDescription className="capitalize">{address.address_type}</CardDescription>
                      </div>
                    </div>
                    <AddressActions address={address} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p>{address.address_line1}</p>
                    {address.address_line2 && <p>{address.address_line2}</p>}
                    <p>
                      {address.city}, {address.state} {address.postal_code}
                    </p>
                    <p>{address.country}</p>
                    {address.phone && <p className="text-muted-foreground">Phone: {address.phone}</p>}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No addresses saved yet</p>
                <Button asChild>
                  <Link href="/account/addresses/add">Add Your First Address</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/account">Back to Account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
