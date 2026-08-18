import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { UserManagementActions } from "@/components/user-management-actions"

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (userData?.role !== "admin") {
    redirect("/")
  }

  const { data: users } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/admin">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">User Management</h1>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage registered user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users && users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-semibold">Name</th>
                        <th className="text-left p-4 font-semibold">Email</th>
                        <th className="text-left p-4 font-semibold">Phone</th>
                        <th className="text-left p-4 font-semibold">Role</th>
                        <th className="text-left p-4 font-semibold">Joined</th>
                        <th className="text-right p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b last:border-0">
                          <td className="p-4">
                            {u.first_name} {u.last_name}
                          </td>
                          <td className="p-4">{u.email}</td>
                          <td className="p-4 text-muted-foreground">{u.phone || "N/A"}</td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                u.role === "admin"
                                  ? "bg-red-100 text-red-800"
                                  : u.role === "manager"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right">
                            <UserManagementActions userId={u.id} userName={`${u.first_name} ${u.last_name}`} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No users found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
