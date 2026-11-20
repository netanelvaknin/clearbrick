"use client"

import { useSyncExternalStore } from "react"
import { TimerIcon } from "lucide-react"
import type { Product } from "@/lib/products"

// Launch-sale strip (Nectar-style). For now the window is static: it counts down to midnight US Eastern time
// and starts over every day. Swap `secondsLeft` for a real end date when there is one.
const DAY = 24 * 60 * 60
const clock = new Intl.DateTimeFormat("en-GB", { timeZone: "America/New_York", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" })

function secondsLeft() {
  const [h, m, s] = clock.format(new Date()).split(":").map(Number)
  return DAY - (h * 3600 + m * 60 + s)
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
  if (!product.compareAt) return null
  const off = Math.round((1 - product.price / product.compareAt) * 100)
  const units =
    left === null
      ? ["--", "--", "--"]
      : [pad(Math.floor(left / 3600)), pad(Math.floor((left % 3600) / 60)), pad(left % 60)]

  return (
    <div className="flex items-center justify-between gap-4 rounded-[1.75rem] bg-foreground bg-linear-to-r from-white/10 to-white/0 px-5 py-4 text-background shadow-[inset_0_1px_0_rgb(255_255_255/0.15)] md:px-7">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="flex items-center gap-1.5 text-sm font-bold text-[#f5c26b]">
          <TimerIcon className="size-4" /> Launch sale
        </span>
        <p className="text-lg leading-tight font-extrabold md:text-xl">{off}% off the {product.shortName}</p>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <div dir="ltr" role="timer" aria-label="Time left in the sale" className="flex items-start gap-1 rounded-2xl border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
          {units.map((v, i) => (
            <span key={i} className="flex items-start gap-1">
              {i > 0 && <span className="pt-0.5 text-lg font-bold text-white/50">:</span>}
              <span className="flex w-8 flex-col items-center">
                <span className="text-xl leading-tight font-black tabular-nums">{v}</span>
                <span className="text-[10px] font-semibold text-white/60">{["hrs", "min", "sec"][i]}</span>
              </span>
            </span>
          ))}
        </div>
        <span className="text-xs text-white/70">Sale ends in</span>
      </div>
    </div>
  )
}
