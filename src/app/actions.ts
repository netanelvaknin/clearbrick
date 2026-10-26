"use server"

import { headers } from "next/headers"

const EVENTS = ["add_to_cart", "checkout_initiated", "notify_me", "contact", "whatsapp"] as const
export type FunnelEvent = (typeof EVENTS)[number]

export type TrackPayload = {
  event: FunnelEvent
  product?: string
  color?: string
  price?: number
  email?: string
  name?: string
  phone?: string
  message?: string
  marketingOptIn?: boolean
  page?: string
  attribution?: Record<string, string>
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Forwards a funnel event to the Make.com webhook. The URL never leaves the server.
export async function track(payload: TrackPayload): Promise<{ ok: boolean }> {
  if (!EVENTS.includes(payload.event)) return { ok: false }
  if (payload.email !== undefined && !EMAIL.test(payload.email)) return { ok: false }

  const url = process.env.MAKE_WEBHOOK_URL
  if (!url) {
    console.warn("[track] MAKE_WEBHOOK_URL is not set, event dropped:", payload.event)
    return { ok: true }
  }

  const h = await headers()
  const body = {
    ...payload,
    message: payload.message?.slice(0, 2000),
    timestamp: new Date().toISOString(),
    userAgent: h.get("user-agent") ?? undefined,
    referer: h.get("referer") ?? undefined,
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    })
    return { ok: res.ok }
  } catch (err) {
    console.error("[track] webhook failed", err)
    return { ok: false }
  }
}
