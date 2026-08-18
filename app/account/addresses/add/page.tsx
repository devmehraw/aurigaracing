import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AddressForm } from "@/components/address-form"

export default async function AddAddressPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add New Address</h1>
          <p className="text-muted-foreground mt-1">Add a new shipping or billing address</p>
        </div>

        <AddressForm />
      </div>
    </div>
  )
}
