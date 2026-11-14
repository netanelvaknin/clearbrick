"use client"

import { Analytics } from "@vercel/analytics/next"
import { isInternal } from "@/lib/track"

// Vercel Web Analytics, minus internal browsers (?internal=1), same as GTM and the Make webhook.
export function VercelAnalytics() {
  return <Analytics beforeSend={(event) => (isInternal() ? null : event)} />
}
