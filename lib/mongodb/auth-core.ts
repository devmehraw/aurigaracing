import "server-only"
import { scrypt, randomBytes } from "node:crypto"
import { promisify } from "node:util"
import { ObjectId } from "mongodb"
import { getDb } from "./connection"

const scryptAsync = promisify(scrypt)

// Shape returned to the app, mirroring the fields Supabase's auth user exposes
// that this codebase actually reads (id, email, user_metadata, role).
export type AuthUser = {
  id: string
  email: string
  role: string
  user_metadata: Record<string, unknown>
  created_at?: string
}

type UserDoc = {
  _id?: ObjectId
  email: string
  password_hash: string
  first_name?: string | null
  last_name?: string | null
  role: string
  created_at?: string
  updated_at?: string
}

export function toAuthUser(doc: UserDoc): AuthUser {
  return {
    id: doc._id?.toString() || "",
    email: doc.email,
    role: doc.role || "customer",
    created_at: doc.created_at,
    user_metadata: {
      first_name: doc.first_name ?? null,
      last_name: doc.last_name ?? null,
      role: doc.role || "customer",
    },
  }
}

// Hash password using scrypt (matching the format: salt:hash in hex)
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(32)
  const hash = (await scryptAsync(password, salt, 64)) as Buffer
  return salt.toString("hex") + ":" + hash.toString("hex")
}

// Verify password using scrypt
async function verifyPassword(password: string, hashStr: string): Promise<boolean> {
  const [saltHex, hashHex] = hashStr.split(":")
  if (!saltHex || !hashHex) return false
  try {
    const salt = Buffer.from(saltHex, "hex")
    const hash = (await scryptAsync(password, salt, 64)) as Buffer
    return hash.toString("hex") === hashHex
  } catch {
    return false
  }
}

export async function createUser(params: {
  email: string
  password: string
  metadata?: Record<string, unknown>
}): Promise<{ user: AuthUser | null; error: string | null }> {
  const db = await getDb()
  const users = db.collection<UserDoc>("users")
  const email = params.email.trim().toLowerCase()

  const existing = await users.findOne({ email })
  if (existing) {
    return { user: null, error: "User already registered" }
  }

  if (!params.password || params.password.length < 6) {
    return { user: null, error: "Password must be at least 6 characters" }
  }

  const meta = params.metadata || {}
  const now = new Date().toISOString()
  const doc: UserDoc = {
    email,
    password_hash: await hashPassword(params.password),
    first_name: (meta.first_name as string) ?? null,
    last_name: (meta.last_name as string) ?? null,
    role: (meta.role as string) || "customer",
    created_at: now,
    updated_at: now,
  }
  const result = await users.insertOne(doc)
  doc._id = result.insertedId
  return { user: toAuthUser(doc), error: null }
}

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<{ user: AuthUser | null; error: string | null }> {
  const db = await getDb()
  const users = db.collection<UserDoc>("users")
  const doc = await users.findOne({ email: email.trim().toLowerCase() })
  if (!doc || !doc.password_hash) {
    return { user: null, error: "Invalid login credentials" }
  }
  const valid = await verifyPassword(password, doc.password_hash)
  if (!valid) {
    return { user: null, error: "Invalid login credentials" }
  }
  return { user: toAuthUser(doc), error: null }
}

export async function getUserById(id: string): Promise<AuthUser | null> {
  const db = await getDb()
  try {
    const doc = await db.collection<UserDoc>("users").findOne({ _id: new ObjectId(id) })
    return doc ? toAuthUser(doc) : null
  } catch {
    return null
  }
}

export async function updateUserById(
  id: string,
  updates: { password?: string; email?: string; metadata?: Record<string, unknown> },
): Promise<{ user: AuthUser | null; error: string | null }> {
  const db = await getDb()
  const users = db.collection<UserDoc>("users")
  const set: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (updates.password) {
    if (updates.password.length < 6) return { user: null, error: "Password must be at least 6 characters" }
    set.password_hash = await hashPassword(updates.password)
  }
  if (updates.email) set.email = updates.email.trim().toLowerCase()
  if (updates.metadata) {
    if ("first_name" in updates.metadata) set.first_name = updates.metadata.first_name
    if ("last_name" in updates.metadata) set.last_name = updates.metadata.last_name
    if ("role" in updates.metadata) set.role = updates.metadata.role
  }
  try {
    await users.updateOne({ _id: new ObjectId(id) }, { $set: set })
    const doc = await users.findOne({ _id: new ObjectId(id) })
    return { user: doc ? toAuthUser(doc) : null, error: null }
  } catch {
    return { user: null, error: "User not found" }
  }
}
