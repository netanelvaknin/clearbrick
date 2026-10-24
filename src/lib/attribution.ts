const KEY = "cb_attribution"
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "ttclid"]

// Campaign params from the landing URL, kept for the whole session so events on later pages still carry them.
export function getAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {}
  const stored = JSON.parse(sessionStorage.getItem(KEY) ?? "{}") as Record<string, string>
  const url = new URLSearchParams(window.location.search)
  const fresh = Object.fromEntries(PARAMS.filter((p) => url.has(p)).map((p) => [p, url.get(p)!]))
  const merged = { ...stored, ...fresh }
  sessionStorage.setItem(KEY, JSON.stringify(merged))
  return merged
}
