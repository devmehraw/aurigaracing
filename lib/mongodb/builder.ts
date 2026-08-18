// Isomorphic, Supabase-compatible query + auth client.
// The same chainable builder runs on the server (direct DB access) and in the
// browser (proxied to /api/db). Behaviour is determined by the injected runners.

import type { QuerySpec, QueryResult, Filter } from "./query-engine"

export type QueryRunner = (spec: QuerySpec) => Promise<QueryResult>
export type AuthRunner = (method: string, args?: unknown) => Promise<unknown>

type SelectOptions = { count?: "exact" | "planned" | "estimated"; head?: boolean }

class QueryBuilder implements PromiseLike<QueryResult> {
  private spec: QuerySpec
  private runner: QueryRunner
  private promise: Promise<QueryResult> | null = null

  constructor(table: string, runner: QueryRunner) {
    this.runner = runner
    this.spec = { table, action: "select", filters: [], order: [], select: null }
  }

  select(columns?: string, options?: SelectOptions): this {
    this.spec.select = columns ?? "*"
    if (this.spec.action === "select") {
      if (options?.count) this.spec.countMode = options.count
      if (options?.head) this.spec.head = true
    }
    return this
  }

  insert(payload: Record<string, unknown> | Record<string, unknown>[]): this {
    this.spec.action = "insert"
    this.spec.payload = payload
    this.spec.select = null
    return this
  }

  upsert(payload: Record<string, unknown> | Record<string, unknown>[], options?: { onConflict?: string }): this {
    this.spec.action = "upsert"
    this.spec.payload = payload
    if (options?.onConflict) this.spec.upsertOnConflict = options.onConflict
    this.spec.select = null
    return this
  }

  update(payload: Record<string, unknown>): this {
    this.spec.action = "update"
    this.spec.payload = payload
    this.spec.select = null
    return this
  }

  delete(): this {
    this.spec.action = "delete"
    this.spec.select = null
    return this
  }

  private addFilter(f: Filter): this {
    this.spec.filters.push(f)
    return this
  }

  eq(column: string, value: unknown) { return this.addFilter({ type: "eq", column, value }) }
  neq(column: string, value: unknown) { return this.addFilter({ type: "neq", column, value }) }
  gt(column: string, value: unknown) { return this.addFilter({ type: "gt", column, value }) }
  gte(column: string, value: unknown) { return this.addFilter({ type: "gte", column, value }) }
  lt(column: string, value: unknown) { return this.addFilter({ type: "lt", column, value }) }
  lte(column: string, value: unknown) { return this.addFilter({ type: "lte", column, value }) }
  like(column: string, value: string) { return this.addFilter({ type: "like", column, value }) }
  ilike(column: string, value: string) { return this.addFilter({ type: "ilike", column, value }) }
  in(column: string, value: unknown[]) { return this.addFilter({ type: "in", column, value }) }
  is(column: string, value: unknown) { return this.addFilter({ type: "is", column, value }) }
  contains(column: string, value: unknown) { return this.addFilter({ type: "contains", column, value }) }
  match(value: Record<string, unknown>) { return this.addFilter({ type: "match", value }) }
  or(value: string) { return this.addFilter({ type: "or", value }) }
  not(column: string, op: string, value: unknown) { return this.addFilter({ type: "not", column, op, value }) }
  filter(column: string, op: string, value: unknown) {
    // Map PostgREST operator names to our filter types.
    if (op === "in") {
      const arr = typeof value === "string" ? value.replace(/^\(|\)$/g, "").split(",") : (value as unknown[])
      return this.addFilter({ type: "in", column, value: arr })
    }
    return this.addFilter({ type: (op as Filter["type"]) || "eq", column, value })
  }

  order(column: string, options?: { ascending?: boolean }): this {
    this.spec.order.push({ column, ascending: options?.ascending !== false })
    return this
  }

  limit(count: number): this {
    this.spec.limit = count
    return this
  }

  range(from: number, to: number): this {
    this.spec.range = { from, to }
    return this
  }

  single(): this {
    this.spec.single = true
    return this
  }

  maybeSingle(): this {
    this.spec.maybeSingle = true
    return this
  }

  private exec(): Promise<QueryResult> {
    if (!this.promise) this.promise = this.runner(this.spec)
    return this.promise
  }

  then<TResult1 = QueryResult, TResult2 = never>(
    onfulfilled?: ((value: QueryResult) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.exec().then(onfulfilled, onrejected)
  }

  catch<TResult = never>(onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null) {
    return this.exec().catch(onrejected)
  }

  finally(onfinally?: (() => void) | null) {
    return this.exec().finally(onfinally)
  }
}

class AuthClient {
  private runner: AuthRunner
  constructor(runner: AuthRunner) {
    this.runner = runner
  }

  async getUser() {
    return (await this.runner("getUser")) as { data: { user: unknown }; error: unknown }
  }

  async getSession() {
    return (await this.runner("getSession")) as { data: { session: unknown }; error: unknown }
  }

  async signInWithPassword(args: { email: string; password: string }) {
    return (await this.runner("signInWithPassword", args)) as { data: unknown; error: { message: string } | null }
  }

  async signUp(args: { email: string; password: string; options?: { data?: Record<string, unknown> } }) {
    return (await this.runner("signUp", args)) as { data: unknown; error: { message: string } | null }
  }

  async signOut() {
    return (await this.runner("signOut")) as { error: unknown }
  }

  async updateUser(attributes: Record<string, unknown>) {
    return (await this.runner("updateUser", attributes)) as { data: unknown; error: { message: string } | null }
  }

  // No realtime in MongoDB; return a no-op subscription matching the Supabase shape.
  onAuthStateChange(_callback: (event: string, session: unknown) => void) {
    return { data: { subscription: { unsubscribe() {} } } }
  }
}

export type DbClient = {
  from: (table: string) => QueryBuilder
  auth: AuthClient
  rpc: (fn: string, args?: unknown) => Promise<QueryResult>
}

export function createDbClient(queryRunner: QueryRunner, authRunner: AuthRunner): DbClient {
  return {
    from: (table: string) => new QueryBuilder(table, queryRunner),
    auth: new AuthClient(authRunner),
    rpc: async () => ({ data: null, error: { message: "rpc is not supported" }, count: null, status: 400, statusText: "Error" }),
  }
}
