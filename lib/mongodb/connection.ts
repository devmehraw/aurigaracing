import "server-only"
import { MongoClient, type Db } from "mongodb"

// Singleton MongoDB connection. Reused across hot reloads in development
// and across invocations in production (Node.js runtime only — never edge).
const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || "auriga"

let clientPromise: Promise<MongoClient> | null = null

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it in Project Settings → Environment Variables.")
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect()
    }
    return global._mongoClientPromise
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect()
  }
  return clientPromise
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise()
  return client.db(dbName)
}

export function isConfigured(): boolean {
  return Boolean(uri)
}
