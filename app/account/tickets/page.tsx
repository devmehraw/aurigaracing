import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Plus } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function TicketsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500/10 text-blue-500"
      case "in_progress":
        return "bg-yellow-500/10 text-yellow-500"
      case "resolved":
        return "bg-green-500/10 text-green-500"
      case "closed":
        return "bg-gray-500/10 text-gray-500"
      default:
        return ""
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/10 text-red-500"
      case "high":
        return "bg-orange-500/10 text-orange-500"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500"
      case "low":
        return "bg-gray-500/10 text-gray-500"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Support Tickets</h1>
            <p className="text-muted-foreground mt-1">View and manage your support requests</p>
          </div>
          <Button asChild>
            <Link href="/account/tickets/new">
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {tickets && tickets.length > 0 ? (
            tickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                        <CardDescription className="mt-1">
                          Ticket #{ticket.id.slice(0, 8)} • {new Date(ticket.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                      <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace("_", " ")}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{ticket.message}</p>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/account/tickets/${ticket.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No support tickets yet</p>
                <Button asChild>
                  <Link href="/account/tickets/new">Create Your First Ticket</Link>
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
