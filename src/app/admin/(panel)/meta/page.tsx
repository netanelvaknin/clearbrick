import { Suspense } from "react"
import { connection } from "next/server"
import { Bars, Card, Kpi, RangePicker } from "../ui"
import { resolveRange } from "@/lib/vercel-analytics"
import { metaInsights, type Insight, type MetaResult } from "@/lib/meta-ads"

export const metadata = { title: "Meta | clearbrick admin" }

export default function MetaPage({ searchParams }: PageProps<"/admin/meta">) {
  return (
    <div className="container-site flex flex-col gap-6 py-6 md:gap-10 md:py-10">
      <Suspense fallback={<p className="text-muted-foreground">טוען נתונים…</p>}>
        <MetaDashboard searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

async function MetaDashboard({ searchParams }: Pick<PageProps<"/admin/meta">, "searchParams">) {
  await connection()
  const sp = await searchParams
  const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined)
  const range = resolveRange({ range: str(sp.range), from: str(sp.from), to: str(sp.to) })
  const span = { from: range.from, to: range.to }

  const [total, daily, campaigns, ads] = await Promise.all([
    metaInsights({ level: "account", ...span }),
    metaInsights({ level: "account", ...span, daily: true }),
    metaInsights({ level: "campaign", ...span }),
    metaInsights({ level: "ad", ...span }),
  ])
  const t = total.ok ? total.rows[0] : undefined

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-display-sm">Meta</h1>
          <p className="text-sm text-muted-foreground">ימים מלאים לפי אזור הזמן של חשבון המודעות. מתעדכן כל 15 דקות.</p>
        </div>
        <RangePicker range={range} path="/admin/meta" />
      </div>

      {!total.ok && <p className="rounded-2xl bg-card p-4 text-muted-foreground">{total.error}</p>}

      <section className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
        <Kpi label="הוצאה" value={usd(t?.spend)} />
        <Kpi label="צפיות בדף נחיתה" value={t?.landingViews ?? 0} />
        <Kpi label="הוספות לסל (פיקסל)" value={t?.addToCart ?? 0} />
        <Kpi label="הגיעו לקופה (פיקסל)" value={t?.checkout ?? 0} />
        <Kpi label="עלות לביקור" value={per(t?.spend, t?.landingViews)} />
        <Kpi label="עלות להוספה לסל" value={per(t?.spend, t?.addToCart)} />
        <Kpi label="CTR קישור" value={t ? `${t.ctr.toFixed(2)}%` : "–"} />
        <Kpi label="CPM" value={usd(t?.cpm)} />
      </section>

      <Card title="הוצאה יומית ($)">
        <Bars
          rows={daily.ok ? daily.rows.map((r) => ({ key: r.date ? `${Number(r.date.slice(8, 10))}.${Number(r.date.slice(5, 7))}` : r.name, pageviews: Math.round(r.spend), visitors: 0 })) : []}
          field="pageviews"
        />
      </Card>

      <Card title="קמפיינים">
        <Table r={campaigns} />
      </Card>
      <Card title="מודעות">
        <Table r={ads} />
      </Card>
    </>
  )
}

const usd = (v?: number) => (v == null ? "–" : `$${v.toLocaleString("en-US", { maximumFractionDigits: 2 })}`)
const per = (spend?: number, n?: number) => (spend && n ? usd(spend / n) : "–")

// Scrolls sideways on phones; the name column stays readable.
function Table({ r }: { r: MetaResult }) {
  if (!r.ok) return <p className="text-sm text-muted-foreground">{r.error}</p>
  const rows = [...r.rows].sort((a, b) => b.spend - a.spend)
  if (!rows.length) return <p className="text-sm text-muted-foreground">אין נתונים בטווח הזה</p>
  const cols: [string, (x: Insight) => string | number][] = [
    ["הוצאה", (x) => usd(x.spend)],
    ["ביקורים", (x) => x.landingViews],
    ["הוספות לסל", (x) => x.addToCart],
    ["קופה", (x) => x.checkout],
    ["עלות לביקור", (x) => per(x.spend, x.landingViews)],
    ["עלות לסל", (x) => per(x.spend, x.addToCart)],
    ["CTR", (x) => `${x.ctr.toFixed(2)}%`],
  ]
  return (
    <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="py-2 pe-3 text-start font-medium">שם</th>
            {cols.map(([h]) => (
              <th key={h} className="px-2 py-2 text-start font-medium whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((x) => (
            <tr key={x.name} className="border-b border-border last:border-none">
              <td className="max-w-56 truncate py-2 pe-3 font-medium" dir="auto" title={x.name}>{x.name}</td>
              {cols.map(([h, f]) => (
                <td key={h} className="px-2 py-2 tabular-nums whitespace-nowrap">{f(x)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
