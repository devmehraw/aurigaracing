"use client"

import { createDbClient, type DbClient } from "./builder"
import type { QuerySpec, QueryResult } from "./query-engine"

// Browser client: MongoDB can't be reached from the browser, so every query and
// auth call is proxied to the /api/db route handler, which runs server-side.

async function post(body: unknown): Promise<unknown> {
  const res = await fetch("/api/db", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  })
  if (!res.ok) {
    return { data: null, error: { message: `Request failed (${res.status})` }, count: null }
  }
  return res.json()
}

async function queryRunner(spec: QuerySpec): Promise<QueryResult> {
  return (await post({ kind: "query", spec })) as QueryResult
}

async function authRunner(method: string, args?: unknown): Promise<unknown> {
  return post({ kind: "auth", method, args })
}

export function createClient(): DbClient {
  return createDbClient(queryRunner, authRunner)
}

export const createBrowserClient = createClient
