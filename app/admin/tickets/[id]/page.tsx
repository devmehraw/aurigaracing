import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AdminTicketActions } from "@/components/admin-ticket-actions"
import { AdminTicketReplyForm } from "@/components/admin-ticket-reply-form"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronLeft } from "lucide-react"

export default async function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (userData?.role !== "admin" && userData?.role !== "manager") {
    redirect("/")
  }

  const { data: ticket } = await supabase
    .from("tickets")
    .select("*, user:users(first_name, last_name, email)")
    .eq("id", id)
    .single()

  if (!ticket) {
    redirect("/admin/tickets")
  }

  const { data: replies } = await supabase
    .from("ticket_replies")
    .select("*, user:users(first_name, last_name, role)")
    .eq("ticket_id", ticket.id)
    .order("created_at", { ascending: true })

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/admin/tickets">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Tickets
          </Link>
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl">{ticket.subject}</CardTitle>
                <CardDescription>
                  Ticket #{ticket.id.slice(0, 8)} • From {ticket.user?.first_name} {ticket.user?.last_name} (
                  {ticket.user?.email})
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace("_", " ")}</Badge>
                <AdminTicketActions ticketId={ticket.id} currentStatus={ticket.status} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>{ticket.user?.first_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {ticket.user?.first_name} {ticket.user?.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(ticket.created_at).toLocaleString()}</p>
                  <p className="mt-2 text-sm">{ticket.message}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {replies && replies.length > 0 && (
          <div className="space-y-4 mb-6">
            <h2 className="text-xl font-semibold">Conversation</h2>
            {replies.map((reply) => (
              <Card key={reply.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>{reply.is_staff ? "S" : reply.user?.first_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">
                          {reply.is_staff
                            ? "Support Team"
                            : `${reply.user?.first_name || ""} ${reply.user?.last_name || ""}`.trim() || "Customer"}
                        </p>
                        {reply.is_staff && (
                          <Badge variant="secondary" className="text-xs">
                            Staff
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(reply.created_at).toLocaleString()}</p>
                      <p className="mt-2 text-sm">{reply.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {ticket.status !== "closed" && <AdminTicketReplyForm ticketId={ticket.id} />}
      </div>
    </div>
  )
}
