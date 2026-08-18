import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function TicketsManagementPage() {
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

  const { data: tickets } = await supabase
    .from("tickets")
    .select("*, user:users(first_name, last_name, email)")
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
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/admin">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Tickets Management</h1>
          <p className="text-muted-foreground mt-1">View and manage customer support tickets</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Tickets</CardTitle>
            <CardDescription>Support tickets from customers</CardDescription>
          </CardHeader>
          <CardContent>
            {tickets && tickets.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono text-xs">{ticket.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {ticket.user?.first_name} {ticket.user?.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">{ticket.user?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace("_", " ")}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/tickets/${ticket.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tickets yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
