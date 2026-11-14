import Link from "next/link"
import { DateRangePicker } from "./date-range-picker"
import { earliestDate, israelDate, PRESETS, type Grain, type Range, type Result, type Row } from "@/lib/vercel-analytics"

// Building blocks shared by the admin pages.

export function bucketLabel(ts: string, grain: Grain) {
  const t = new Date(ts)
  if (Number.isNaN(t.getTime())) return ts
  const opts: Intl.DateTimeFormatOptions =
    grain === "hour" ? { timeZone: "Asia/Jerusalem", hour: "2-digit", minute: "2-digit" } : grain === "day" ? { timeZone: "UTC", day: "numeric", month: "numeric" } : { timeZone: "UTC", month: "numeric", year: "2-digit" }
  return new Intl.DateTimeFormat("he-IL", opts).format(t)
}

// Presets match Vercel's dashboard. On phones all five share one even row and the custom range button goes full width.
export function RangePicker({ range, path = "/admin" }: { range: Range; path?: string }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <div className="grid grid-cols-5 rounded-full border border-border p-1 text-xs sm:flex sm:text-sm">
        {PRESETS.map((p) => (
          <Link key={p.id} href={`${path}?range=${p.id}`} className={`flex h-8 items-center justify-center rounded-full px-1 whitespace-nowrap sm:px-3.5 ${p.id === range.preset ? "bg-foreground text-background" : ""}`}>
            {p.label}
          </Link>
        ))}
      </div>
      <DateRangePicker path={path} from={range.from} to={range.to} min={earliestDate()} max={israelDate(new Date())} active={!range.preset} />
    </div>
  )
}

export function Kpi({ label, value, wide }: { label: string; value: number | string; wide?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 rounded-2xl border border-border bg-card p-4 md:p-5 ${wide ? "col-span-2 md:col-span-1" : ""}`}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-2xl font-black tabular-nums md:text-3xl">{typeof value === "number" ? value.toLocaleString("he-IL") : value}</span>
    </div>
  )
}

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-border bg-card p-4 md:gap-4 md:p-5">
      <h2 className="text-base font-bold md:text-lg">{title}</h2>
      {children}
    </div>
  )
}

export function ResultList({ r }: { r: Result }) {
  return <List rows={r.ok ? r.rows : []} error={r.ok ? undefined : r.error} />
}

// Horizontal bar list: label, bar sized to the top value, count.
export function List({ rows, error }: { rows: Row[]; error?: string }) {
  if (error) return <p className="text-sm text-muted-foreground">{error}</p>
  if (!rows.length) return <p className="text-sm text-muted-foreground">אין נתונים בטווח הזה</p>
  const max = Math.max(...rows.map((r) => r.pageviews), 1)
  // Biggest first; Vercel's catch-all "Others" bucket always last.
  const sorted = [...rows].sort((x, y) => Number(x.key === "Others") - Number(y.key === "Others") || y.pageviews - x.pageviews)
  return (
    <ul className="flex flex-col gap-2 text-sm">
      {sorted.map((r) => (
        <li key={r.key} className="relative flex justify-between gap-3 overflow-hidden rounded-lg px-3 py-1.5">
          <span className="absolute inset-y-0 start-0 -z-0 rounded-lg bg-muted" style={{ width: `${(r.pageviews / max) * 100}%` }} />
          <span className="relative truncate" dir="auto">{r.key}</span>
          <span className="relative font-bold tabular-nums">{r.pageviews.toLocaleString("he-IL")}</span>
        </li>
      ))}
    </ul>
  )
}

// Many bars on a phone: hide the per-bar numbers and show only every few date labels so nothing overlaps.
export function Bars({ rows, field }: { rows: Row[]; field: "pageviews" | "visitors" }) {
  if (!rows.length) return <p className="text-sm text-muted-foreground">אין נתונים בטווח הזה</p>
  const max = Math.max(...rows.map((r) => r[field]), 1)
  const step = Math.ceil(rows.length / 6) // phone: ~6 labels
  const crowded = rows.length > 12
  return (
    <div dir="ltr" className="flex h-36 items-end gap-0.5 md:h-40 md:gap-1">
      {rows.map((r, i) => (
        <div key={r.key} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1" title={`${r.key}: ${r[field]}`}>
          <span className={`text-[10px] tabular-nums text-muted-foreground ${crowded ? "max-md:hidden" : ""}`}>{r[field]}</span>
          <div className="w-full rounded-t bg-foreground" style={{ height: `${(r[field] / max) * 100}%` }} />
          <span className={`text-[10px] whitespace-nowrap text-muted-foreground ${i % step ? "max-md:invisible" : ""} ${crowded && i % 2 ? "md:max-lg:invisible" : ""}`}>{r.key}</span>
        </div>
      ))}
    </div>
  )
}
