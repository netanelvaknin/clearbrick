import { Suspense } from "react"
import { connection } from "next/server"
import { Bars, bucketLabel, Card, Kpi, List, RangePicker, ResultList } from "./ui"
import { events, resolveRange, visits, type Result, type Row } from "@/lib/vercel-analytics"

const FUNNEL = [
  { event: "add_to_cart", label: "הוסיפו לסל" },
  { event: "cart_checkout", label: "לחצו לקופה מהסל" },
  { event: "checkout_view", label: "צפו בקופה" },
  { event: "checkout_details", label: "מילאו פרטים" },
  { event: "notify_me", label: "השאירו מייל" },
]

export default function AdminHome({ searchParams }: PageProps<"/admin">) {
  return (
    <div className="container-site flex flex-col gap-6 py-6 md:gap-10 md:py-10">
      <Suspense fallback={<p className="text-muted-foreground">טוען נתונים…</p>}>
        <Dashboard searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

async function Dashboard({ searchParams }: Pick<PageProps<"/admin">, "searchParams">) {
  await connection() // live numbers and "today": always render per request
  const sp = await searchParams
  const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined)
  const range = resolveRange({ range: str(sp.range), from: str(sp.from), to: str(sp.to) })
  const w = { since: range.since, until: range.until }
  // Vercel floors day/month buckets to UTC midnight, so start the chart on the chosen date in UTC; otherwise an extra day shows up first.
  const chart = range.grain === "hour" ? w : { since: new Date(`${range.from}T00:00:00Z`), until: range.until }

  const [totals, daily, byEvent, referrers, utm, devices, countries, pages, products, traffic] = await Promise.all([
    // Totals come from one query over the whole window: summing daily rows would count a returning visitor once per day.
    visits({ ...w, by: ["environment"] }),
    visits({ ...chart, by: [range.grain], limit: 100 }),
    events({ ...w, by: ["eventName"], limit: 30 }),
    visits({ ...w, by: ["referrerHostname"] }),
    visits({ ...w, by: ["utmSource"] }),
    visits({ ...w, by: ["deviceType"] }),
    visits({ ...w, by: ["country"] }),
    visits({ ...w, by: ["requestPath"] }),
    events({ ...w, by: ["eventData/product"], filter: "eventName eq 'add_to_cart'" }),
    events({ ...w, by: ["eventData/traffic"], filter: "eventName eq 'add_to_cart'" }),
  ])

  const sum = (r: Result, f: keyof Omit<Row, "key">) => (r.ok ? r.rows.reduce((a, x) => a + x[f], 0) : 0)
  const count = (name: string) => (byEvent.ok ? byEvent.rows.find((r) => r.key === name)?.pageviews ?? 0 : 0)
  const pageviews = sum(totals, "pageviews")
  const visitors = sum(totals, "visitors")
  const atc = count("add_to_cart")

  return (
    <>
      <div id="overview" className="flex scroll-mt-20 flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h1 className="text-display-sm">סקירה</h1>
        <RangePicker range={range} />
      </div>

      {!daily.ok && <p className="rounded-2xl bg-card p-4 text-muted-foreground">Vercel Analytics: {daily.error}</p>}

      <section className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-5">
        <Kpi label="צפיות בדפים" value={pageviews} />
        <Kpi label="מבקרים" value={visitors} />
        <Kpi label="הוספות לסל" value={atc} />
        <Kpi label="השאירו מייל" value={count("notify_me")} />
        <Kpi wide label="מבקרים → סל" value={visitors ? `${((atc / visitors) * 100).toFixed(1)}%` : "–"} />
      </section>

      {/* Hourly buckets are shown in Israel time. Vercel's daily/monthly buckets are UTC, so they're labeled as such. */}
      <Card title={{ hour: "מבקרים לפי שעה (שעון ישראל)", day: "מבקרים לפי יום (UTC)", month: "מבקרים לפי חודש" }[range.grain]}>
        <Bars rows={daily.ok ? daily.rows.map((r) => ({ ...r, key: bucketLabel(r.key, range.grain) })) : []} field={daily.ok && daily.rows.some((r) => r.visitors) ? "visitors" : "pageviews"} />
      </Card>

      <section id="funnel" className="grid scroll-mt-20 gap-3 md:grid-cols-2 md:gap-4">
        <Card title="משפך">
          <List rows={FUNNEL.map((f) => ({ key: f.label, pageviews: count(f.event), visitors: 0 }))} />
        </Card>
        <Card title="כל האירועים">
          <List rows={byEvent.ok ? byEvent.rows : []} error={byEvent.ok ? undefined : byEvent.error} />
        </Card>
      </section>

      <section id="traffic" className="grid scroll-mt-20 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        <Card title="מקורות הפניה"><ResultList r={referrers} /></Card>
        <Card title="קמפיינים (utm_source)"><ResultList r={utm} /></Card>
        <Card title="הוספות לסל לפי מקור"><ResultList r={traffic} /></Card>
        <Card title="מכשירים"><ResultList r={devices} /></Card>
        <Card title="מדינות"><ResultList r={countries} /></Card>
        <Card title="דפים מובילים"><ResultList r={pages} /></Card>
      </section>

      <section id="products" className="grid scroll-mt-20 gap-3 md:grid-cols-2 md:gap-4">
        <Card title="הוספות לסל לפי מוצר"><ResultList r={products} /></Card>
      </section>
    </>
  )
}
