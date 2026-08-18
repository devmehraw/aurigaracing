"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function TicketReplyForm({ ticketId }: { ticketId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("ticket_replies").insert({
        ticket_id: ticketId,
        user_id: user.id,
        message,
        is_staff: false,
      })

      if (error) throw error

      // Update ticket status to in_progress
      await supabase.from("tickets").update({ status: "in_progress" }).eq("id", ticketId).eq("status", "open")

      toast({
        title: "Success",
        description: "Reply added successfully",
      })

      setMessage("")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Reply</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Your Message *</Label>
            <Textarea
              id="message"
              required
              rows={4}
              placeholder="Type your reply here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reply"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
