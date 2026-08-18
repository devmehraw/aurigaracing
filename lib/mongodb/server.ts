import "server-only"
import { cookies } from "next/headers"
import { createDbClient, type DbClient } from "./builder"
import { executeQuery } from "./query-engine"
import {
  createSessionToken,
  verifySessionToken,
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
} from "./session"
import {
  createUser,
  verifyCredentials,
  getUserById,
  updateUserById,
} from "./auth-core"

// Server-side client: queries hit MongoDB directly; auth reads/writes the
// signed session cookie. Cookie writes only persist in Server Actions / Route
// Handlers (sign-in/up/out are triggered from the browser via /api/db).

async function readSessionUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const payload = await verifySessionToken(token)
  if (!payload) return null
  const user = await getUserById(payload.sub)
  return user
}

async function trySetCookie(value: string) {
  try {
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, value, SESSION_COOKIE_OPTIONS)
  } catch {
    // Called from a Server Component where cookies can't be written; ignore.
  }
}

async function tryClearCookie() {
  try {
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, "", { ...SESSION_COOKIE_OPTIONS, maxAge: 0 })
  } catch {
    // ignore
  }
}

async function authRunner(method: string, args?: unknown): Promise<unknown> {
  switch (method) {
    case "getUser": {
      const user = await readSessionUser()
      return { data: { user }, error: null }
    }
    case "getSession": {
      const user = await readSessionUser()
      return { data: { session: user ? { user } : null }, error: null }
    }
    case "signInWithPassword": {
      const { email, password } = args as { email: string; password: string }
      const { user, error } = await verifyCredentials(email, password)
      if (error || !user) return { data: { user: null, session: null }, error: { message: error || "Login failed" } }
      await trySetCookie(await createSessionToken({ sub: user.id, email: user.email, role: user.role }))
      return { data: { user, session: { user } }, error: null }
    }
    case "signUp": {
      const { email, password, options } = args as {
        email: string
        password: string
        options?: { data?: Record<string, unknown> }
      }
      const { user, error } = await createUser({ email, password, metadata: options?.data })
      if (error || !user) return { data: { user: null, session: null }, error: { message: error || "Sign up failed" } }
      await trySetCookie(await createSessionToken({ sub: user.id, email: user.email, role: user.role }))
      return { data: { user, session: { user } }, error: null }
    }
    case "signOut": {
      await tryClearCookie()
      return { error: null }
    }
    case "updateUser": {
      const user = await readSessionUser()
      if (!user) return { data: { user: null }, error: { message: "Not authenticated" } }
      const attrs = args as { password?: string; email?: string; data?: Record<string, unknown> }
      const { user: updated, error } = await updateUserById(user.id, {
        password: attrs.password,
        email: attrs.email,
        metadata: attrs.data,
      })
      if (error) return { data: { user: null }, error: { message: error } }
      if (updated) await trySetCookie(await createSessionToken({ sub: updated.id, email: updated.email, role: updated.role }))
      return { data: { user: updated }, error: null }
    }
    default:
      return { data: null, error: { message: `Unsupported auth method: ${method}` } }
  }
}

export async function createClient(): Promise<DbClient> {
  return createDbClient((spec) => executeQuery(spec), authRunner)
}

export async function createServerClient(): Promise<DbClient> {
  return createClient()
}
