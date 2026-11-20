"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { sendGTMEvent } from "@next/third-parties/google"
import { ChevronRightIcon, LockIcon } from "lucide-react"
import { track } from "@/lib/track"
import { getAttribution } from "@/lib/attribution"
import { pixel } from "@/lib/pixel"
import { formatPrice } from "@/lib/products"
import { cartSummary, cartTotals, resolveLines, useCart } from "@/components/cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Price } from "@/components/price"
import { OutOfStockDialog } from "@/components/notify-dialog"
import { PaymentMethods } from "@/components/trust-badges"
import { PHONE, WhatsAppGlyph } from "@/components/whatsapp-button"

// Fake-door checkout: the visitor fills in every shipping field and clicks "Continue to payment". That valid submit
// is logged as proof of real buying intent (with the email) and opens the out-of-stock dialog.

// Cache Components keeps page state across navigations, so a returning buyer would land on the old,
// already-submitted checkout. Keying on bfcacheId starts fresh on every buy click but still restores on browser back.
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
      <p className="text-xl font-bold">Your cart is empty</p>
      <Button variant="outline" nativeButton={false} render={<Link href="/#collection" />}>
        Shop the collection
      </Button>
    </div>
  )
}

function CheckoutBody({ items }: { items: ReturnType<typeof resolveLines> }) {
  const totals = cartTotals(items)
  // Only one coupon exists: CB2026, 10% off the order total.
  const [coupon, setCoupon] = useState<string>()
  const discount = coupon ? Math.round(totals.total * COUPON_OFF) : 0
  const pay = totals.total - discount
  // One item keeps its own color in events; several items are summarized into one line.
  const ctx = items.length === 1 && items[0].line.qty === 1 ? { product: items[0].product.name, color: items[0].color.name, price: items[0].product.price } : cartSummary(items)

  const [open, setOpen] = useState(false)
  const logged = useRef(false)

  // Funnel step between the buy click and the form: did they actually land on checkout?
  const viewed = useRef(false)
  useEffect(() => {
    if (viewed.current) return
    viewed.current = true
    track({ event: "checkout_view", ...ctx, page: location.pathname, attribution: getAttribution() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Runs only on a valid submit: the browser blocks "Continue to payment" until every required field is filled.
  // Logged once; submitting again just reopens the dialog.
  function reveal(form: HTMLFormElement) {
    const typed = String(new FormData(form).get("email") ?? "").trim()
    if (!logged.current) {
      logged.current = true
      track({ event: "checkout_details", ...ctx, email: typed, page: location.pathname, attribution: getAttribution() })
      pixel("track", "AddPaymentInfo", { content_name: ctx.product, value: pay, num_items: totals.count, currency: "USD" })
      sendGTMEvent({ event: "add_shipping_info", product: ctx.product, value: pay, quantity: totals.count, currency: "USD" })
    }
    setOpen(true)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          reveal(e.currentTarget)
        }}
        className="flex flex-col gap-6 rounded-[2rem] border border-border bg-card p-6 md:p-10"
      >
        <h2 className="text-2xl font-bold">Shipping details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="co-email">Email</Label>
            <Input id="co-email" name="email" type="email" autoComplete="email" required pattern="[^\s@]+@[^\s@]+\.[^\s@]+" />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="co-name">Full name</Label>
            <Input id="co-name" name="name" autoComplete="shipping name" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="co-phone">Phone</Label>
            <Input id="co-phone" name="phone" type="tel" inputMode="tel" autoComplete="shipping tel" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="co-street">Street address</Label>
            <Input id="co-street" name="street" autoComplete="shipping address-line1" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="co-apt">
              Apt, suite <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input id="co-apt" name="apt" autoComplete="shipping address-line2" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="co-city">City</Label>
            <Input id="co-city" name="city" autoComplete="shipping address-level2" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="co-state">State</Label>
              <Input id="co-state" name="state" autoComplete="shipping address-level1" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="co-zip">ZIP code</Label>
              <Input id="co-zip" name="zip" inputMode="numeric" maxLength={10} autoComplete="shipping postal-code" required />
            </div>
          </div>
        </div>
        <Button type="submit" size="lg">
          <LockIcon /> Continue to payment
        </Button>
        <PaymentMethods />
        <a
          href={`https://wa.me/${PHONE}?text=${encodeURIComponent("Hi, I have a question before I order 🙂")}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track({ event: "whatsapp", ...ctx, source: "checkout", page: location.pathname, attribution: getAttribution() })}
          className="group flex items-center gap-3 rounded-full border border-[#25D366]/40 bg-[#25D366]/12 bg-linear-to-b from-white/60 to-white/0 p-2 pe-5 text-base font-bold shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_10px_24px_-14px_rgb(18_140_75/0.6)] backdrop-blur-md transition hover:border-[#25D366]/70 hover:bg-[#25D366]/20 active:scale-[0.98]"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#25D366] text-white shadow-sm">
            <WhatsAppGlyph className="size-6" />
          </span>
          <span className="flex flex-1 flex-col leading-tight">
            Questions before you order?
            <span className="text-sm font-semibold text-[#128C4B]">Chat with us on WhatsApp</span>
          </span>
          <ChevronRightIcon className="size-5 text-[#128C4B] transition-transform group-hover:translate-x-1" />
        </a>
      </form>

      <aside className="order-first flex flex-col gap-6 self-start lg:order-none rounded-[2rem] border border-border bg-card p-6 md:p-8 lg:sticky lg:top-32">
        <h2 className="text-2xl font-bold">Order summary</h2>
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
                  Color: {color.name}
                  {line.qty > 1 && ` · Qty: ${line.qty}`}
                </span>
              </div>
              <span className="font-bold">{formatPrice(product.price * line.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="flex flex-col gap-3 border-t border-border pt-5 text-lg">
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd className="font-bold">Free</dd>
          </div>
          {coupon && (
            <div className="flex justify-between">
              <dt>Coupon {coupon}</dt>
              <dd dir="ltr" className="font-bold">-{formatPrice(discount)}</dd>
            </div>
          )}
          <div className="flex items-center justify-between">
            <dt className="font-bold">Total</dt>
            <dd>
              <Price price={pay} compareAt={pay < totals.original ? totals.original : undefined} />
            </dd>
          </div>
        </dl>
        <CouponField
          applied={coupon}
          onApply={(code) => {
            const valid = code === COUPON
            track({ event: valid ? "coupon_applied" : "coupon_invalid", ...ctx, offer: code, page: location.pathname, attribution: getAttribution() })
            if (valid) setCoupon(code)
            return valid
          }}
          onRemove={() => setCoupon(undefined)}
        />
      </aside>

      <OutOfStockDialog ctx={ctx} open={open} onOpenChange={setOpen} />
    </div>
  )
}

const COUPON = "CB2026"
const COUPON_OFF = 0.1

function CouponField({ applied, onApply, onRemove }: { applied?: string; onApply: (code: string) => boolean; onRemove: () => void }) {
  const [code, setCode] = useState("")
  const [error, setError] = useState(false)

  if (applied)
    return (
      <p className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3 text-base">
        <span className="font-bold">✓ Coupon {applied} applied · 10% off</span>
        <button type="button" onClick={onRemove} className="text-muted-foreground underline">Remove</button>
      </p>
    )

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const clean = code.trim().toUpperCase()
        if (clean) setError(!onApply(clean))
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
