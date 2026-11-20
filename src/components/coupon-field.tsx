"use client"

import { useState } from "react"
import { TagIcon, XIcon } from "lucide-react"
import { AUTO_COUPON, couponLabel, isCoupon, setCoupon, useCoupon } from "@/lib/coupon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Applied coupon with a Remove link, or a code field. `onEvent` lets the page log coupon actions with its own context.
export function CouponField({ onEvent }: { onEvent?: (event: "coupon_applied" | "coupon_invalid" | "coupon_removed", code: string) => void }) {
  const applied = useCoupon()
  const [code, setCode] = useState("")
  const [error, setError] = useState(false)

  if (applied)
    return (
      <div className="flex items-center justify-between gap-3">
        <CouponTag code={applied} onRemove={() => (setCoupon(null), onEvent?.("coupon_removed", applied))} />
        <span className="text-sm font-semibold text-emerald-700">{couponLabel(applied)}</span>
      </div>
    )

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const clean = code.trim().toUpperCase()
        if (!clean) return
        const valid = isCoupon(clean)
        onEvent?.(valid ? "coupon_applied" : "coupon_invalid", clean)
        setError(!valid)
        if (valid) {
          setCoupon(clean)
          setCode("")
        }
      }}
      className="flex flex-col gap-2"
    >
      <Label htmlFor="co-coupon" className="sr-only">Coupon code</Label>
      <div className="flex gap-2">
        <Input id="co-coupon" value={code} onChange={(e) => (setCode(e.target.value), setError(false))} autoComplete="off" placeholder="Coupon code" aria-invalid={error} />
        <Button type="submit" variant="outline" size="lg" className="shrink-0">Apply</Button>
      </div>
      {error ? (
        <p className="text-sm text-destructive">Invalid code</p>
      ) : (
        <p className="text-sm text-muted-foreground">Black Friday code: {AUTO_COUPON}</p>
      )}
    </form>
  )
}

// The applied code as a "tag" chip (dashed edge, tag icon, code in caps), with an optional remove button.
export function CouponTag({ code, onRemove, small }: { code: string; onRemove?: () => void; small?: boolean }) {
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-lg border border-dashed border-emerald-600/60 bg-emerald-50 font-mono font-bold tracking-wider text-emerald-800 uppercase " +
        (small ? "px-2 py-0.5 text-xs" : "py-1.5 ps-2.5 pe-1.5 text-sm")
      }
    >
      <TagIcon className={small ? "size-3" : "size-4"} />
      {code}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove coupon ${code}`}
          className="grid size-6 place-items-center rounded-md text-emerald-800/70 transition-colors hover:bg-emerald-100 hover:text-emerald-900"
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </span>
  )
}
