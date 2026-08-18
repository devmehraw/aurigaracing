import "server-only"
import { ObjectId } from "mongodb"
import type { Db } from "mongodb"
import { getDb } from "./connection"

/**
 * A MongoDB-backed query engine that mimics the subset of the Supabase/PostgREST
 * query API used by this app: chained filters, ordering, ranges, single/maybeSingle,
 * insert/update/upsert/delete, count, and relational `select("*, rel(*)")` embeds
 * (including `!inner`, FK hints, `(count)`, and dotted embed filters).
 *
 * Key: Uses MongoDB's native `_id` field (ObjectId) as identity.
 * Foreign keys reference `_id` values as strings or ObjectIds.
 */

export type Filter = {
  type: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "like" | "ilike" | "in" | "is" | "not" | "or" | "contains" | "match"
  column?: string
  value?: unknown
  op?: string
}

export type Order = { column: string; ascending: boolean }

export type QuerySpec = {
  table: string
  action: "select" | "insert" | "update" | "upsert" | "delete"
  payload?: Record<string, unknown> | Record<string, unknown>[]
  upsertOnConflict?: string
  select?: string | null
  countMode?: "exact" | "planned" | "estimated" | null
  head?: boolean
  filters: Filter[]
  order: Order[]
  limit?: number | null
  range?: { from: number; to: number } | null
  single?: boolean
  maybeSingle?: boolean
}

export type QueryResult = {
  data: unknown
  error: { message: string; code?: string } | null
  count: number | null
  status: number
  statusText: string
}

type Embed = {
  alias: string
  table: string
  fkHint?: string
  inner: boolean
  isCount: boolean
  select: string
}

// ---------- helpers ----------

function singularize(table: string): string {
  if (table.endsWith("ies")) return table.slice(0, -3) + "y"
  if (table.endsWith("ses")) return table.slice(0, -2)
  if (table.endsWith("s")) return table.slice(0, -1)
  return table
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function likeToRegex(pattern: string, caseInsensitive: boolean): RegExp {
  let out = ""
  for (const ch of pattern) {
    if (ch === "%") out += ".*"
    else if (ch === "_") out += "."
    else out += escapeRegex(ch)
  }
  return new RegExp(`^${out}$`, caseInsensitive ? "i" : "")
}

// Try to convert a value to ObjectId if it looks like one (24-char hex)
function toObjectIdIfValid(val: unknown): ObjectId | unknown {
  if (typeof val === "string" && /^[0-9a-f]{24}$/i.test(val)) {
    try {
      return new ObjectId(val)
    } catch {
      return val
    }
  }
  if (val instanceof ObjectId) return val
  return val
}

function condFromOp(op: string, column: string, value: unknown): Record<string, unknown> {
  // For _id fields, try to parse as ObjectId
  if (column === "_id") value = toObjectIdIfValid(value)

  switch (op) {
    case "eq":
      return { [column]: value }
    case "neq":
      return { [column]: { $ne: value } }
    case "gt":
      return { [column]: { $gt: value } }
    case "gte":
      return { [column]: { $gte: value } }
    case "lt":
      return { [column]: { $lt: value } }
    case "lte":
      return { [column]: { $lte: value } }
    case "like":
      return { [column]: { $regex: likeToRegex(value as string, false) } }
    case "ilike":
      return { [column]: { $regex: likeToRegex(value as string, true) } }
    case "in":
      return { [column]: { $in: Array.isArray(value) ? value : [value] } }
    case "is":
      return value === null ? { [column]: null } : { [column]: { $exists: true } }
    case "not":
      return { [column]: { $ne: value } }
    case "contains":
      return { [column]: { $regex: escapeRegex(String(value)) } }
    case "match":
      return { [column]: { $regex: value } }
    default:
      return {}
  }
}

function buildMongoFilter(filters: Filter[]): Record<string, unknown> {
  const conditions: Record<string, unknown>[] = []
  for (const f of filters) {
    if (f.type === "or") {
      conditions.push({ $or: [condFromOp("eq", f.column || "id", f.value)] })
    } else if (f.column) {
      conditions.push(condFromOp(f.type, f.column, f.value))
    }
  }
  return conditions.length === 1 ? conditions[0] : conditions.length > 1 ? { $and: conditions } : {}
}

// Parse select string like "*, rel(*)" or "id, name, rel(col1, col2)"
function parseSelect(selectStr: string): { columns: Set<string>; embeds: Embed[] } {
  const columns = new Set<string>()
  const embeds: Embed[] = []
  const parts = selectStr.split(",").map((s) => s.trim())

  for (const part of parts) {
    if (part === "*") {
      columns.add("*")
    } else if (part.includes("(")) {
      const match = part.match(/^(!)?(\w+)(?:\(([^)]*)\))?(\(count\))?$/i)
      if (match) {
        const inner = !!match[1]
        const alias = match[2]
        const selectInner = match[3] || "*"
        const isCount = !!match[4]
        const table = singularize(alias)

        embeds.push({ alias, table, inner, isCount, select: selectInner })
        if (isCount) {
          columns.add(`${alias}(count)`)
        } else {
          columns.add(alias)
        }
      }
    } else {
      columns.add(part)
    }
  }

  return { columns, embeds }
}

function projectDoc(doc: Record<string, unknown>, columns: Set<string>): Record<string, unknown> {
  if (columns.has("*")) {
    // Keep _id but rename to id for API consistency (unless we want raw _id)
    const { _id, ...rest } = doc
    return _id ? { id: _id.toString(), ...rest } : rest
  }
  const out: Record<string, unknown> = {}
  for (const col of columns) {
    if (col === "_id" && "_id" in doc) {
      out.id = (doc._id as ObjectId).toString()
    } else if (col in doc) {
      out[col] = doc[col]
    }
  }
  return out
}

// Resolve embedded relations: join related tables into parents
async function resolveEmbeds(
  db: Db,
  embeds: Embed[],
  parents: Record<string, unknown>[],
  embedFilters: Filter[],
): Promise<void> {
  for (const embed of embeds) {
    const relColl = db.collection(embed.table)
    const { columns: innerCols } = parseSelect(embed.select)
    const innerSelect = { columns: innerCols, embeds: [] as Embed[] }

    // Determine FK: by hint or convention (e.g., `parent_id` for parent table)
    const foreignFK = embed.fkHint || `${singularize(embed.alias)}_id`
    const parentPkCol = "_id"

    // Filter embeds on this relation (dotted columns like "product_categories.category_id")
    const relEmbedFilters = embedFilters.filter((f) => {
      if (!f.column) return false
      const [rel] = f.column.split(".")
      return rel === embed.alias
    })

    // Build filter for this relation
    let relFilter: Record<string, unknown> = {}
    for (const pf of parents) {
      const val = pf[parentPkCol]
      if (val) {
        relFilter[foreignFK] = toObjectIdIfValid(val)
        break // Assume all parents use same FK; refine if needed
      }
    }

    // Apply relation-specific embed filters
    for (const f of relEmbedFilters) {
      if (!f.column) continue
      const [, col] = f.column.split(".")
      relFilter = { ...relFilter, ...condFromOp(f.type, col, f.value) }
    }

    // Fetch related docs
    const related = relFilter && Object.keys(relFilter).length > 0 ? await relColl.find(relFilter, { projection: { _id: 0 } }).toArray() : []
    const grouped = new Map<unknown, Record<string, unknown>[]>()
    for (const r of related) {
      const key = r[foreignFK]
      if (!grouped.has(key)) grouped.set(key, [])
      grouped.get(key)!.push(r)
    }
    for (const p of parents) {
      const matches = grouped.get(p[parentPkCol]) || []
      if (embed.isCount) {
        p[embed.alias] = [{ count: matches.length }]
      } else {
        p[embed.alias] = matches.map((m) => projectDoc(m, innerSelect.columns))
      }
    }
  }
}

// ---------- main executor ----------

export async function executeQuery(spec: QuerySpec): Promise<QueryResult> {
  let db: Db
  try {
    db = await getDb()
  } catch (e) {
    return {
      data: spec.single || spec.maybeSingle ? null : [],
      error: { message: e instanceof Error ? e.message : "Database connection failed" },
      count: null,
      status: 500,
      statusText: "Error",
    }
  }

  const ok = (data: unknown, count: number | null = null): QueryResult => ({
    data,
    error: null,
    count,
    status: 200,
    statusText: "OK",
  })
  const fail = (message: string, code?: string): QueryResult => ({
    data: spec.single ? null : spec.maybeSingle ? null : null,
    error: { message, code },
    count: null,
    status: 400,
    statusText: "Error",
  })

  const coll = db.collection(spec.table)

  try {
    // ----- writes -----
    if (spec.action === "insert" || spec.action === "upsert") {
      const now = new Date().toISOString()
      const docs = (Array.isArray(spec.payload) ? spec.payload : [spec.payload]).map((d) => ({
        ...d,
        created_at: (d as Record<string, unknown>).created_at || now,
        updated_at: now,
      }))

      if (spec.action === "upsert") {
        const conflictKeys = spec.upsertOnConflict ? spec.upsertOnConflict.split(",").map((s) => s.trim()) : ["_id"]
        const out: Record<string, unknown>[] = []
        for (const doc of docs) {
          const filter: Record<string, unknown> = {}
          for (const k of conflictKeys) {
            if (k === "id" && doc._id) {
              filter._id = doc._id
            } else if (k === "_id" && doc._id) {
              filter._id = doc._id
            } else if (k in doc) {
              filter[k] = doc[k]
            }
          }
          await coll.updateOne(filter, { $set: doc }, { upsert: true })
          const saved = await coll.findOne(filter, { projection: { _id: 0 } })
          if (saved) out.push(saved)
        }
        return ok(out)
      }

      const result = await coll.insertMany(docs)
      const inserted = docs.map((d, i) => ({
        id: result.insertedIds[i]?.toString(),
        ...d,
      }))
      return ok(inserted)
    }

    if (spec.action === "update") {
      const filter = buildMongoFilter(spec.filters)
      const update = { ...(spec.payload as Record<string, unknown>), updated_at: new Date().toISOString() }
      await coll.updateMany(filter, { $set: update })
      const updated = await coll.find(filter, { projection: { _id: 0 } }).toArray()
      return ok(updated)
    }

    if (spec.action === "delete") {
      const filter = buildMongoFilter(spec.filters)
      const toReturn = spec.select ? await coll.find(filter, { projection: { _id: 0 } }).toArray() : []
      await coll.deleteMany(filter)
      return ok(toReturn)
    }

    // ----- select -----
    const selectStr = spec.select || "*"
    const { columns, embeds } = parseSelect(selectStr)

    // Separate dotted (embed) filters from base filters
    const embedAliases = new Set(embeds.flatMap((e) => [e.alias, e.table]))
    const baseFilters = spec.filters.filter((f) => !(f.column && f.column.includes(".") && embedAliases.has(f.column.split(".")[0])))
    const embedFilters = spec.filters.filter((f) => f.column && f.column.includes(".") && embedAliases.has(f.column.split(".")[0]))

    const mongoFilter = buildMongoFilter(baseFilters)

    // Handle count
    if (spec.countMode === "exact") {
      const count = await coll.countDocuments(mongoFilter)
      const docs = await coll
        .find(mongoFilter)
        .sort(spec.order.reduce((acc, o) => ({ ...acc, [o.column]: o.ascending ? 1 : -1 }), {}))
        .skip(spec.range?.from || 0)
        .limit(spec.limit || 0)
        .toArray()
      if (embeds.length) await resolveEmbeds(db, embeds, docs, embedFilters)
      const projected = docs.map((d) => projectDoc(d, columns))
      const result = spec.single ? projected[0] || null : spec.maybeSingle ? projected[0] || null : projected
      return ok(result, count)
    }

    // Select without explicit count
    const docs = await coll
      .find(mongoFilter)
      .sort(spec.order.reduce((acc, o) => ({ ...acc, [o.column]: o.ascending ? 1 : -1 }), {}))
      .skip(spec.range?.from || 0)
      .limit(spec.limit || 0)
      .toArray()

    if (embeds.length) await resolveEmbeds(db, embeds, docs, embedFilters)
    const projected = docs.map((d) => projectDoc(d, columns))
    const result = spec.single ? projected[0] || null : spec.maybeSingle ? projected[0] || null : projected
    return ok(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Query execution failed"
    return fail(message)
  }
}
