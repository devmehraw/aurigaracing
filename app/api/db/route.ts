import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { executeQuery, type QuerySpec } from "@/lib/mongodb/query-engine"
import {
  createSessionToken,
  verifySessionToken,
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/mongodb/session"
import { createUser, verifyCredentials, getUserById, updateUserById } from "@/lib/mongodb/auth-core"

// Node runtime: the MongoDB driver and bcrypt require Node APIs.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function currentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const payload = await verifySessionToken(token)
  if (!payload) return null
  return getUserById(payload.sub)
}

async function setSession(userId: string, email: string, role: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, await createSessionToken({ sub: userId, email, role }), SESSION_COOKIE_OPTIONS)
}

async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, "", { ...SESSION_COOKIE_OPTIONS, maxAge: 0 })
}

export async function POST(request: NextRequest) {
  let body: { kind: string; spec?: QuerySpec; method?: string; args?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ data: null, error: { message: "Invalid request body" } }, { status: 400 })
  }

  if (body.kind === "query" && body.spec) {
    const result = await executeQuery(body.spec)
    return NextResponse.json(result)
  }

  if (body.kind === "auth") {
    const { method, args } = body
    switch (method) {
      case "getUser": {
        const user = await currentUser()
        return NextResponse.json({ data: { user }, error: null })
      }
      case "getSession": {
        const user = await currentUser()
        return NextResponse.json({ data: { session: user ? { user } : null }, error: null })
      }
      case "signInWithPassword": {
        const { email, password } = (args || {}) as { email: string; password: string }
        const { user, error } = await verifyCredentials(email, password)
        if (error || !user) {
          return NextResponse.json({ data: { user: null, session: null }, error: { message: error || "Login failed" } })
        }
        await setSession(user.id, user.email, user.role)
        return NextResponse.json({ data: { user, session: { user } }, error: null })
      }
      case "signUp": {
        const { email, password, options } = (args || {}) as {
          email: string
          password: string
          options?: { data?: Record<string, unknown> }
        }
        if (!email?.trim() || !password) {
          return NextResponse.json(
            { data: { user: null, session: null }, error: { message: "Email and password are required" } },
            { status: 400 },
          )
        }

        try {
          const { user, error } = await createUser({ email, password, metadata: options?.data })
          if (error || !user) {
            return NextResponse.json(
              { data: { user: null, session: null }, error: { message: error || "Sign up failed" } },
              { status: error === "User already registered" ? 409 : 400 },
            )
          }
          await setSession(user.id, user.email, user.role)
          return NextResponse.json({ data: { user, session: { user } }, error: null })
        } catch (error) {
          console.error("[v0] Signup database error:", error)
          return NextResponse.json(
            { data: { user: null, session: null }, error: { message: "Registration is temporarily unavailable. Please check the database connection and try again." } },
            { status: 503 },
          )
        }
      }
      case "signOut": {
        await clearSession()
        return NextResponse.json({ error: null })
      }
      case "updateUser": {
        const user = await currentUser()
        if (!user) return NextResponse.json({ data: { user: null }, error: { message: "Not authenticated" } })
        const attrs = (args || {}) as { password?: string; email?: string; data?: Record<string, unknown> }
        const { user: updated, error } = await updateUserById(user.id, {
          password: attrs.password,
          email: attrs.email,
          metadata: attrs.data,
        })
        if (error) return NextResponse.json({ data: { user: null }, error: { message: error } })
        if (updated) await setSession(updated.id, updated.email, updated.role)
        return NextResponse.json({ data: { user: updated }, error: null })
      }
      default:
        return NextResponse.json({ data: null, error: { message: `Unsupported auth method: ${method}` } })
    }
  }

  return NextResponse.json({ data: null, error: { message: "Unknown request kind" } }, { status: 400 })
}
