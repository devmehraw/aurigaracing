import { SignJWT, jwtVerify } from "jose"

// Edge-safe session helpers (used in middleware AND node runtime).
// Sessions are signed JWTs so middleware can verify them without a DB call.
// The user's role is embedded in the token for fast role-based routing.

export const SESSION_COOKIE = "auriga-session"
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days

export type SessionPayload = {
  sub: string // user id
  email: string
  role: string
}

function getSecretKey(): Uint8Array {
  // Prefer an explicit secret; otherwise derive a stable key from the Mongo URI
  // so the app works without an extra env var. Set AUTH_SECRET for production.
  const secret = process.env.AUTH_SECRET || process.env.MONGODB_URI || "auriga-dev-insecure-secret"
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecretKey())
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    if (!payload.sub) return null
    return {
      sub: payload.sub as string,
      email: (payload.email as string) || "",
      role: (payload.role as string) || "customer",
    }
  } catch {
    return null
  }
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE_SECONDS,
}
