"use client"

import { useState } from "react"
import { TagIcon } from "lucide-react"
import { couponLabel, isCoupon, isSaleCoupon, setCoupon, useCoupon } from "@/lib/coupon"
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
      <p
        className={
          isSaleCoupon(applied)
            ? "flex items-center justify-between gap-3 rounded-2xl border border-[#ff5a1f]/30 bg-[#ff5a1f]/10 px-4 py-3 text-base text-[#c2410c]"
            : "flex items-center justify-between gap-3 rounded-2xl bg-muted px-4 py-3 text-base"
        }
      >
        <span className="flex items-center gap-2 font-bold">
          <TagIcon className="size-4 shrink-0" /> {applied} applied{isSaleCoupon(applied) ? "" : ` · ${couponLabel(applied)}`}
        </span>
        <button
          type="button"
          onClick={() => (setCoupon(null), onEvent?.("coupon_removed", applied))}
          className={isSaleCoupon(applied) ? "underline opacity-80" : "text-muted-foreground underline"}
        >
          Remove
        </button>
      </p>
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
      {error && <p className="text-sm text-destructive">Invalid code</p>}
    </form>
  )
}
