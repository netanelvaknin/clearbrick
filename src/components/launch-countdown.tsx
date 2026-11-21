"use client"

import { useSyncExternalStore } from "react"
import { TimerIcon } from "lucide-react"
import type { Product } from "@/lib/products"

// Black Friday strip: counts down to the end of Cyber Monday (midnight New York time) and hides once it's over.
export const SALE_END = Date.parse("2026-12-01T00:00:00-05:00")

function secondsLeft() {
  return Math.max(0, Math.floor((SALE_END - Date.now()) / 1000))
}

// One shared 1s ticker; the server renders placeholders (no time on the server, so no hydration mismatch).
function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000)
  return () => clearInterval(id)
}
const useSecondsLeft = () => useSyncExternalStore(subscribe, secondsLeft, () => null)

const pad = (n: number) => String(n).padStart(2, "0")

export function LaunchCountdown({ product }: { product: Product }) {
  const left = useSecondsLeft()
  if (!product.compareAt || left === 0) return null
  const off = Math.round((1 - product.price / product.compareAt) * 100)
  // Days / hours / minutes / seconds; the days slot drops away in the last 24 hours.
  const days = left === null || left >= 86400
  const labels = ["days", "hrs", "min", "sec"].slice(days ? 0 : 1)
  const units =
    left === null
      ? labels.map(() => "--")
      : [Math.floor(left / 86400), Math.floor((left % 86400) / 3600), Math.floor((left % 3600) / 60), left % 60]
          .slice(days ? 0 : 1)
          .map(pad)

  return (
    <div className="flex items-center justify-between gap-4 rounded-[1.75rem] bg-foreground bg-linear-to-r from-white/10 to-white/0 px-5 py-4 text-background shadow-[inset_0_1px_0_rgb(255_255_255/0.15)] md:px-7">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="flex items-center gap-1.5 text-sm font-bold text-[#f5c26b]">
          <TimerIcon className="size-4" /> Black Friday sale
        </span>
        <p className="text-lg leading-tight font-extrabold md:text-xl">{off}% off the {product.shortName}</p>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <div dir="ltr" role="timer" aria-label="Time left in the sale" className="flex items-start gap-1 rounded-2xl border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
          {units.map((v, i) => (
            <span key={i} className="flex items-start gap-1">
              {i > 0 && <span className="pt-0.5 text-lg font-bold text-white/50">:</span>}
              <span className="flex w-7 flex-col items-center md:w-8">
                <span className="text-xl leading-tight font-black tabular-nums">{v}</span>
                <span className="text-[10px] font-semibold text-white/60">{labels[i]}</span>
              </span>
            </span>
          ))}
        </div>
        <span className="text-xs text-white/70">Sale ends in</span>
      </div>
    </div>
  )
}
