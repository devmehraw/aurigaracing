"use client"

// Compatibility shim: this app was migrated from Supabase to MongoDB.
// The browser "client" proxies all queries/auth to the /api/db route handler.
export { createClient, createBrowserClient } from "@/lib/mongodb/client"
