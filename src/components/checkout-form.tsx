"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { sendGTMEvent } from "@next/third-parties/google"
import { LockIcon } from "lucide-react"
import { track } from "@/app/actions"
import { getAttribution } from "@/lib/attribution"
import { pixel } from "@/lib/pixel"
import { getProduct, products } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Price } from "@/components/price"
import { OutOfStockDialog } from "@/components/notify-dialog"
import { PaymentMethods } from "@/components/trust-badges"

// Fake-door checkout: email comes first. Once the visitor enters a valid email (or skips ahead to another
// field / submits), we log it as proof of real buying intent, lock the rest and show the out-of-stock dialog.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function CheckoutForm() {
  const params = useSearchParams()
  const product = getProduct(params.get("product") ?? "") ?? products[0]
  const color = product.colors.find((c) => c.id === params.get("color")) ?? product.colors[0]
  const image = product.images[color.image]
  const ctx = { product: product.name, color: color.name, price: product.price }

  const [locked, setLocked] = useState(false)
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState<string>()
  // A ref, not state: email blur and the next field's focus fire in the same tick, before `locked` re-renders.
  const logged = useRef(false)

  // Funnel step between the buy click and the email: did they actually land on checkout?
  const viewed = useRef(false)
  useEffect(() => {
    if (viewed.current) return
    viewed.current = true
    track({ event: "checkout_view", ...ctx, page: location.pathname, attribution: getAttribution() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Logged once; later calls just reopen the dialog.
  function reveal(typed?: string) {
    if (!logged.current) {
      logged.current = true
      const valid = typed && EMAIL.test(typed) ? typed : undefined
      track({ event: "checkout_details", ...ctx, email: valid, page: location.pathname, attribution: getAttribution() })
      pixel("track", "AddPaymentInfo", { content_name: product.name, value: product.price, currency: "ILS" })
      sendGTMEvent({ event: "add_shipping_info", product: product.name, color: color.name, value: product.price, currency: "ILS" })
      setEmail(valid)
      setLocked(true)
    }
    setOpen(true)
  }

  const later = { disabled: locked, onFocus: () => reveal() }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          reveal(String(new FormData(e.currentTarget).get("email") ?? "").trim())
        }}
        className="flex flex-col gap-6 rounded-[2rem] border border-border bg-card p-6 md:p-10"
      >
        <h2 className="text-2xl font-bold">פרטים למשלוח</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="co-email">אימייל</Label>
            <Input
              id="co-email"
              name="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              placeholder="you@example.com"
              className="text-start"
              disabled={locked}
              onBlur={(e) => EMAIL.test(e.target.value.trim()) && reveal(e.target.value.trim())}
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="co-name">שם מלא</Label>
            <Input id="co-name" name="name" autoComplete="name" {...later} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="co-phone">טלפון</Label>
            <Input id="co-phone" name="phone" type="tel" inputMode="tel" dir="ltr" autoComplete="tel" placeholder="050-0000000" className="text-start" {...later} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="co-city">עיר</Label>
            <Input id="co-city" name="city" autoComplete="address-level2" {...later} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="co-street">רחוב ומספר בית</Label>
            <Input id="co-street" name="street" autoComplete="address-line1" {...later} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="co-apt">דירה / קומה</Label>
            <Input id="co-apt" name="apt" autoComplete="address-line2" {...later} />
          </div>
        </div>
        <Button type="submit" size="lg">
          <LockIcon /> להמשך לתשלום
        </Button>
        <PaymentMethods />
      </form>

      <aside className="order-first flex flex-col gap-6 self-start lg:order-none rounded-[2rem] border border-border bg-card p-6 md:p-8 lg:sticky lg:top-32">
        <h2 className="text-2xl font-bold">סיכום הזמנה</h2>
        <div className="flex items-center gap-4">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-muted">
            <Image src={image.src} alt={image.alt} fill sizes="96px" className="object-cover" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-bold">{product.name}</span>
            <span className="text-muted-foreground">צבע: {color.name}</span>
          </div>
        </div>
        <dl className="flex flex-col gap-3 border-t border-border pt-5 text-lg">
          <div className="flex justify-between">
            <dt>משלוח</dt>
            <dd className="font-bold">חינם</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="font-bold">סה״כ</dt>
            <dd>
              <Price price={product.price} compareAt={product.compareAt} />
            </dd>
          </div>
        </dl>
      </aside>

      <OutOfStockDialog key={email} ctx={ctx} defaultEmail={email} open={open} onOpenChange={setOpen} />
    </div>
  )
}
