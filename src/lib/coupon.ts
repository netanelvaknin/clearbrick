"use client"

import { useSyncExternalStore } from "react"

// Coupons. BLACKFRIDAY26 is auto-applied: it's what brings each product from its compareAt ("was") price down to the
// price shown on the product page. Removing it puts the higher price back until the code is entered again.
// The choice lives in sessionStorage so the cart drawer and checkout agree, and survives page loads in the visit.
export const AUTO_COUPON = "BLACKFRIDAY26"

type Totals = { original: number; total: number }
const COUPONS: Record<string, { label: string; discount: (t: Totals) => number }> = {
  BLACKFRIDAY26: { label: "Black Friday price", discount: (t) => t.original - t.total },
  CB2026: { label: "10% off", discount: (t) => Math.round(t.original * 0.1) }, // waitlist coupon promised in the out-of-stock dialog
}

export const isCoupon = (code: string) => code in COUPONS
export const couponLabel = (code: string) => COUPONS[code]?.label ?? ""
export const couponDiscount = (code: string | null, t: Totals) => (code && COUPONS[code] ? COUPONS[code].discount(t) : 0)

const KEY = "cb_coupon" // missing = auto coupon, "" = removed, otherwise the code
const listeners = new Set<() => void>()

function read(): string | null {
  try {
    const v = sessionStorage.getItem(KEY)
    return v === null ? AUTO_COUPON : v || null
  } catch {
    return AUTO_COUPON
  }
}

export function setCoupon(code: string | null) {
  try {
    sessionStorage.setItem(KEY, code ?? "")
  } catch {}
  listeners.forEach((l) => l())
}

export function useCoupon() {
  return useSyncExternalStore(
    (cb) => (listeners.add(cb), () => listeners.delete(cb)),
    read,
    () => AUTO_COUPON
  )
}
