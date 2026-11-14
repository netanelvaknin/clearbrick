import { track as vercelTrack } from "@vercel/analytics"
import { track as serverTrack, type TrackPayload } from "@/app/actions"
import { INTERNAL } from "@/components/tags"

// Browsers marked internal with ?internal=1 (us, friends). See components/tags.tsx.
export const isInternal = () => typeof document !== "undefined" && document.cookie.split("; ").includes(`${INTERNAL}=1`)

// One call per funnel event, from client components:
// - Vercel Web Analytics custom event, sent from the browser as the docs recommend for UI interactions
//   (server-side track() posts to the protected *.vercel.app deployment URL and gets a silent 401).
//   Pro allows 2 properties; no personal data goes here.
// - The server action, which validates the event and forwards the full payload to the Make webhook.
export function track(payload: TrackPayload) {
  if (!isInternal()) {
    const a = payload.attribution ?? {}
    const traffic = a.utm_source ?? (a.fbclid ? "meta" : a.ttclid ? "tiktok" : "direct")
    vercelTrack(payload.event, { product: payload.product ?? null, traffic: traffic.slice(0, 255) })
  }
  return serverTrack(payload)
}
