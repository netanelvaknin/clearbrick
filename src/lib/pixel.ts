"use client"

import { useEffect, useRef } from "react"

type Fbq = (type: "track" | "trackCustom", name: string, params?: Record<string, unknown>) => void

// The Meta pixel is loaded by GTM after hydration, so retry for a few seconds before giving up.
export function pixel(type: "track" | "trackCustom", name: string, params?: Record<string, unknown>, tries = 20) {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq
  if (typeof fbq === "function") return fbq(type, name, params)
  if (tries > 0) setTimeout(() => pixel(type, name, params, tries - 1), 250)
}

// Product-page engagement: ViewContent, 15s engaged visit, 50/75% scroll, first color/gallery interaction.
export function useProductEngagement(p: { name: string; price: number }) {
  const sent = useRef(new Set<string>())
  const once = (key: string, fn: () => void) => {
    if (sent.current.has(key)) return
    sent.current.add(key)
    fn()
  }

  useEffect(() => {
    const base = { content_name: p.name, content_type: "product", value: p.price, currency: "ILS" }
    once("view", () => pixel("track", "ViewContent", base))

    const timer = setTimeout(() => once("engaged", () => pixel("trackCustom", "EngagedVisit", { ...base, seconds: 15 })), 15_000)

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const pct = max > 0 ? (window.scrollY / max) * 100 : 100
      for (const depth of [50, 75]) {
        if (pct >= depth) once(`scroll${depth}`, () => pixel("trackCustom", "ScrollDepth", { ...base, percent: depth }))
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.name])

  return (kind: "color" | "gallery", detail: string) =>
    once(`interact-${kind}`, () => pixel("trackCustom", "ProductInteract", { content_name: p.name, kind, detail }))
}
