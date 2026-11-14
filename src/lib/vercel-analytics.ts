import { cacheLife } from "next/cache"

// Reads Vercel Web Analytics for the admin panel. Needs VERCEL_ANALYTICS_TOKEN (read access to the team).
const PROJECT_ID = "prj_SCjFTQxnsfbffNgaw6iDmTfhvkjt"
const TEAM_ID = "team_tpDllEjD5sxpy3QIVmyo48jT"

export type Row = { key: string; pageviews: number; visitors: number }
export type Result = { ok: true; rows: Row[] } | { ok: false; error: string }

export type Window = { since: Date; until: Date }
type Query = Window & { by: string[]; filter?: string; limit?: number }

const HOUR = 3_600_000
const DAY = 24 * HOUR
const TZ = "Asia/Jerusalem"

export const PRESETS = [
  { id: "24h", label: "24 שעות" },
  { id: "7d", label: "7 ימים" },
  { id: "30d", label: "30 ימים" },
  { id: "3m", label: "3 חודשים" },
  { id: "12m", label: "12 חודשים" },
] as const
export type Grain = "hour" | "day" | "month"
export type Range = Window & { preset?: string; from: string; to: string; grain: Grain }

// YYYY-MM-DD of an instant, in Israel time.
export const israelDate = (t: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(t)

// Midnight Israel time of a YYYY-MM-DD date, as an instant (handles summer/winter time).
function israelMidnight(ymd: string) {
  const guess = new Date(`${ymd}T00:00:00Z`)
  const offset = new Date(guess.toLocaleString("en-US", { timeZone: TZ })).getTime() - new Date(guess.toLocaleString("en-US", { timeZone: "UTC" })).getTime()
  return new Date(guess.getTime() - offset)
}

const addDays = (ymd: string, n: number) => new Date(Date.parse(`${ymd}T00:00:00Z`) + n * DAY).toISOString().slice(0, 10)
const addMonths = (ymd: string, n: number) => {
  const d = new Date(`${ymd}T00:00:00Z`)
  d.setUTCMonth(d.getUTCMonth() + n)
  return d.toISOString().slice(0, 10)
}

// Pro keeps 12 months of analytics; the API rejects older ranges.
export const earliestDate = () => addDays(addMonths(israelDate(new Date()), -12), 1)

// Windows match Vercel's dashboard (24h and 7d checked against it):
// - "24h" = the last 24 hourly buckets, current hour included.
// - "7d" / "30d" = from midnight Israel time N days ago until now (N full days + today). "3m" / "12m" use calendar months the same way.
// - Custom from/to = midnight Israel on `from` until the end of `to` (or now, if `to` is today).
export function resolveRange(params: { range?: string; from?: string; to?: string }): Range {
  const now = new Date()
  const today = israelDate(now)
  const min = earliestDate()
  const isDate = (v?: string): v is string => !!v && /^\d{4}-\d{2}-\d{2}$/.test(v)

  if (isDate(params.from) && isDate(params.to)) {
    const from = params.from < min ? min : params.from > today ? today : params.from
    const to = params.to > today ? today : params.to < from ? from : params.to
    const end = israelMidnight(addDays(to, 1))
    const since = israelMidnight(from)
    const until = end > now ? now : end
    return { since, until, from, to, grain: grainFor(until.getTime() - since.getTime()) }
  }

  const preset = PRESETS.some((p) => p.id === params.range) ? params.range! : "7d"
  if (preset === "24h") {
    const since = new Date(Math.floor(now.getTime() / HOUR) * HOUR - 23 * HOUR)
    return { preset, since, until: now, from: israelDate(since), to: today, grain: "hour" }
  }
  const start = { "7d": addDays(today, -7), "30d": addDays(today, -30), "3m": addMonths(today, -3), "12m": addMonths(today, -12) }[preset]!
  const from = start < min ? min : start
  const since = israelMidnight(from)
  return { preset, since, until: now, from, to: today, grain: grainFor(now.getTime() - since.getTime()) }
}

// API limits: hourly up to 168 hours, daily up to 62 days. Keep a margin, since day charts start at UTC midnight.
const grainFor = (ms: number): Grain => (ms <= 2 * DAY ? "hour" : ms <= 60 * DAY ? "day" : "month")

async function query(kind: "visits" | "events", { by, since, until, filter, limit = 10 }: Query): Promise<Result> {
  const token = process.env.VERCEL_ANALYTICS_TOKEN
  if (!token) return { ok: false, error: "חסר VERCEL_ANALYTICS_TOKEN" }

  const roundedUntil = new Date(Math.floor(until.getTime() / 300_000) * 300_000) // 5-minute steps, so reloads hit the cache
  const params = new URLSearchParams({ projectId: PROJECT_ID, teamId: TEAM_ID, since: since.toISOString(), until: roundedUntil.toISOString(), limit: String(limit) })
  by.forEach((b) => params.append("by", b))
  if (filter) params.set("filter", filter)

  const res = await fetchAggregate(kind, params.toString())
  if ("status" in res) {
    if (res.status === 404) return { ok: false, error: "עדיין אין נתונים" }
    if (res.status === 429) return { ok: false, error: "חרגנו ממכסת הבקשות של Vercel (400 בשעה). נסו שוב בעוד כמה דקות." }
    return { ok: false, error: `שגיאה ${res.status}` }
  }
  const dim = by[0]
  return { ok: true, rows: res.data.map((d) => toRow(d, dim)) }
}

// Cached 5 minutes per exact query: Vercel allows 400 analytics requests an hour and each dashboard load makes ~10.
// Errors are cached too (also 5 minutes), which is fine: a rate limit or "no data yet" won't clear sooner anyway.
async function fetchAggregate(kind: "visits" | "events", qs: string): Promise<{ data: Record<string, unknown>[] } | { status: number }> {
  "use cache"
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 })
  const res = await fetch(`https://api.vercel.com/v1/query/web-analytics/${kind}/aggregate?${qs}`, {
    headers: { Authorization: `Bearer ${process.env.VERCEL_ANALYTICS_TOKEN}` },
  })
  if (!res.ok) return { status: res.status }
  return { data: ((await res.json()) as { data: Record<string, unknown>[] }).data }
}

// The API returns the dimension value plus number fields; the count field names aren't documented, so read them loosely.
function toRow(d: Record<string, unknown>, dim: string): Row {
  const nums = Object.entries(d).filter(([, v]) => typeof v === "number") as [string, number][]
  const get = (...names: string[]) => nums.find(([k]) => names.includes(k))?.[1]
  const first = nums[0]?.[1] ?? 0
  const rawKey = dim === "day" || dim === "hour" || dim === "month" ? d.timestamp : d[dim] ?? d[dim.replace(/^eventData\//, "")]
  return {
    key: rawKey == null || rawKey === "" ? "(ללא)" : String(rawKey),
    pageviews: get("pageviews", "pageViews", "total", "count", "events") ?? first,
    visitors: get("visitors", "devices", "uniqueVisitors") ?? 0,
  }
}

export const visits = (q: Query) => query("visits", q)
export const events = (q: Query) => query("events", q)
