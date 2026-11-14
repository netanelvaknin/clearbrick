import { cacheLife } from "next/cache"

// Reads Meta (Facebook/Instagram) ad results for the admin panel via the Marketing API Insights endpoint.
// Needs META_ADS_TOKEN: a System User token with only `ads_read` on the ad account. Read-only, can't change or spend.
const ACCOUNT = "act_220042144867636"
const VERSION = process.env.META_API_VERSION ?? "v23.0"

export type Insight = {
  name: string
  spend: number
  impressions: number
  clicks: number // link clicks
  ctr: number // link CTR, %
  cpm: number
  landingViews: number
  addToCart: number
  checkout: number
  date?: string
}
export type MetaResult = { ok: true; rows: Insight[] } | { ok: false; error: string }

type Level = "account" | "campaign" | "ad"

// Dates are whole days in the ad account's time zone (Meta has no hourly window here).
export async function metaInsights({ level, from, to, daily = false }: { level: Level; from: string; to: string; daily?: boolean }): Promise<MetaResult> {
  if (!process.env.META_ADS_TOKEN) return { ok: false, error: "חסר META_ADS_TOKEN" }
  const params = new URLSearchParams({
    level,
    time_range: JSON.stringify({ since: from, until: to }),
    fields: ["campaign_name", "ad_name", "spend", "impressions", "inline_link_clicks", "inline_link_click_ctr", "cpm", "actions"].join(","),
    limit: "100",
  })
  if (daily) params.set("time_increment", "1")
  const res = await fetchInsights(params.toString())
  if ("error" in res) return { ok: false, error: res.error }
  return {
    ok: true,
    rows: res.data.map((d) => ({
      name: String(level === "ad" ? d.ad_name : level === "campaign" ? d.campaign_name : "סה״כ"),
      spend: num(d.spend),
      impressions: num(d.impressions),
      clicks: num(d.inline_link_clicks),
      ctr: num(d.inline_link_click_ctr),
      cpm: num(d.cpm),
      landingViews: action(d.actions, "landing_page_view"),
      addToCart: action(d.actions, "offsite_conversion.fb_pixel_add_to_cart", "omni_add_to_cart", "add_to_cart"),
      checkout: action(d.actions, "offsite_conversion.fb_pixel_initiate_checkout", "omni_initiated_checkout", "initiate_checkout"),
      date: typeof d.date_start === "string" ? d.date_start : undefined,
    })),
  }
}

type Raw = Record<string, unknown> & { actions?: { action_type: string; value: string }[] }

// Cached 15 minutes per exact query. Meta's own numbers keep settling for a while anyway.
async function fetchInsights(qs: string): Promise<{ data: Raw[] } | { error: string }> {
  "use cache"
  cacheLife({ stale: 900, revalidate: 900, expire: 3600 })
  const res = await fetch(`https://graph.facebook.com/${VERSION}/${ACCOUNT}/insights?${qs}`, {
    headers: { Authorization: `Bearer ${process.env.META_ADS_TOKEN}` },
  })
  const body = (await res.json().catch(() => ({}))) as { data?: Raw[]; error?: { message?: string } }
  if (!res.ok || !body.data) return { error: `Meta: ${body.error?.message ?? `שגיאה ${res.status}`}` }
  return { data: body.data }
}

const num = (v: unknown) => (v == null ? 0 : Number(v) || 0)
// First matching action type wins (Meta reports the same thing under several names).
function action(actions: Raw["actions"], ...types: string[]) {
  for (const t of types) {
    const hit = actions?.find((a) => a.action_type === t)
    if (hit) return num(hit.value)
  }
  return 0
}
