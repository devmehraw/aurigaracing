import "server-only"
import { MongoClient, type Db } from "mongodb"

// Singleton MongoDB connection. Reused across hot reloads in development
// and across invocations in production (Node.js runtime only — never edge).
// Support the primary variable and the project's alternate URI variable.
// If the dashboard contains the literal text `process.env.MONGODB_URI_2`,
// treat it as a reference and resolve the actual alternate variable instead.
const configuredUri = process.env.MONGODB_URI?.trim()
const uri =
  configuredUri && !/^process\.env\.[A-Z0-9_]+$/.test(configuredUri)
    ? configuredUri
    : process.env.MONGODB_URI_2?.trim()
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
