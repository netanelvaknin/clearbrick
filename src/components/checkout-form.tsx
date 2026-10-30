"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { sendGTMEvent } from "@next/third-parties/google"
import { LockIcon } from "lucide-react"
import { track } from "@/app/actions"
import { getAttribution } from "@/lib/attribution"
import { pixel } from "@/lib/pixel"
import { formatPrice } from "@/lib/products"
import { cn } from "@/lib/utils"
import { cartSummary, cartTotals, resolveLines, useCart } from "@/components/cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Price } from "@/components/price"
import { OutOfStockDialog } from "@/components/notify-dialog"
import { PaymentMethods } from "@/components/trust-badges"

// Fake-door checkout: email comes first. Once the visitor enters a valid email (or skips ahead to another
// field / submits), we log it as proof of real buying intent, lock the rest and show the out-of-stock dialog.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Cache Components keeps page state across navigations, so a returning buyer would land on the old,
// locked checkout. Keying on bfcacheId starts fresh on every buy click but still restores on browser back.
export function CheckoutForm() {
  const { bfcacheId } = useRouter()
  return <Checkout key={bfcacheId} />
}

// Quick buy links here with ?product&color for a single item; the cart drawer links here bare, so we show the cart.
function Checkout() {
  const params = useSearchParams()
  const cart = useCart()
  const quick = params.get("product")
  const items = resolveLines(quick ? [{ slug: quick, colorId: params.get("color") ?? "", qty: 1 }] : cart.lines)
  if (!quick && !cart.ready) return null
  if (!items.length) return <EmptyCheckout />
  return <CheckoutBody items={items} />
}

function EmptyCheckout() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-border bg-card p-10 text-center">
      <p className="text-xl font-bold">הסל שלכם ריק</p>
      <Button variant="outline" nativeButton={false} render={<Link href="/#collection" />}>
        לקולקציה
      </Button>
    </div>
  )
}

function CheckoutBody({ items }: { items: ReturnType<typeof resolveLines> }) {
  const totals = cartTotals(items)
  // One item keeps its own color in events; several items are summarized into one line.
  const ctx = items.length === 1 && items[0].line.qty === 1 ? { product: items[0].product.name, color: items[0].color.name, price: items[0].product.price } : cartSummary(items)

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

  // Logged once; later calls just reopen the dialog (with a newly typed email, if any).
  function reveal(typed?: string) {
    const valid = typed && EMAIL.test(typed) ? typed : undefined
    if (valid) setEmail(valid)
    if (!logged.current) {
      logged.current = true
      track({ event: "checkout_details", ...ctx, email: valid, page: location.pathname, attribution: getAttribution() })
      pixel("track", "AddPaymentInfo", { content_name: ctx.product, value: totals.total, num_items: totals.count, currency: "ILS" })
      sendGTMEvent({ event: "add_shipping_info", product: ctx.product, value: totals.total, quantity: totals.count, currency: "ILS" })
      setLocked(true)
    }
    setOpen(true)
  }

  // Read-only, not disabled: a disabled field can't be tapped, so it could never reopen the dialog.
  // onClick, not onFocus: closing the dialog returns focus to the last field, which would reopen it at once.
  const lockedClass = locked ? "opacity-50" : undefined
  const later = { readOnly: locked, onClick: () => reveal(), className: lockedClass }

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
              onBlur={(e) => EMAIL.test(e.target.value.trim()) && reveal(e.target.value.trim())}
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="co-name">שם מלא</Label>
            <Input id="co-name" name="name" autoComplete="name" {...later} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="co-phone">טלפון</Label>
            <Input id="co-phone" name="phone" type="tel" inputMode="tel" dir="ltr" autoComplete="tel" placeholder="050-0000000" {...later} className={cn("text-start", lockedClass)} />
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
        <ul className="flex flex-col gap-4">
          {items.map(({ line, product, color }) => (
            <li key={`${line.slug}-${line.colorId}`} className="flex items-center gap-4">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
                <Image src={product.images[color.image].src} alt={product.images[color.image].alt} fill sizes="80px" className="object-cover" />
                {line.qty > 1 && <span className="absolute top-1 end-1 grid size-6 place-items-center rounded-full bg-foreground text-xs font-bold text-background">{line.qty}</span>}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-lg font-bold">{product.name}</span>
                <span className="text-muted-foreground">
                  צבע: {color.name}
                  {line.qty > 1 && ` · כמות: ${line.qty}`}
                </span>
              </div>
              <span className="font-bold">{formatPrice(product.price * line.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="flex flex-col gap-3 border-t border-border pt-5 text-lg">
          <div className="flex justify-between">
            <dt>משלוח</dt>
            <dd className="font-bold">חינם</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="font-bold">סה״כ</dt>
            <dd>
              <Price price={totals.total} compareAt={totals.saved > 0 ? totals.original : undefined} />
            </dd>
          </div>
        </dl>
      </aside>

      <OutOfStockDialog key={email} ctx={ctx} defaultEmail={email} open={open} onOpenChange={setOpen} />
    </div>
  )
}
