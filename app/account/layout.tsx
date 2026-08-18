import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AccountSidebar } from "@/components/account-sidebar"

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  return (
    <div className="flex min-h-screen">
      <AccountSidebar role={userData?.role} />
      <div className="flex-1">{children}</div>
    </div>
  )
}
