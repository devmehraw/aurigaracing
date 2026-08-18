import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TicketForm } from "@/components/ticket-form"

export default async function NewTicketPage() {
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
          <h1 className="text-3xl font-bold">Create Support Ticket</h1>
          <p className="text-muted-foreground mt-1">Describe your issue and we'll help you resolve it</p>
        </div>

        <TicketForm />
      </div>
    </div>
  )
}
