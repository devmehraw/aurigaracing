// Compatibility shim: this app was migrated from Supabase to MongoDB.
// The Supabase import paths are preserved so call sites don't need to change,
// but they now return a MongoDB-backed client with the same API surface.
export { createClient, createServerClient } from "@/lib/mongodb/server"
