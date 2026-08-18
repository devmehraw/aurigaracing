"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({
        email,
      })

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation
          toast.error("This email is already subscribed!")
        } else {
          throw error
        }
      } else {
        toast.success("Successfully subscribed to our newsletter!")
        setEmail("")
      }
    } catch (error) {
      console.error("[v0] Newsletter subscription error:", error)
      toast.error("Failed to subscribe. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10"
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  )
}
