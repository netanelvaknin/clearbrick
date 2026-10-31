"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { sendGTMEvent } from "@next/third-parties/google"
import { LockIcon, MinusIcon, PlusIcon, RotateCcwIcon, ShoppingBagIcon, Trash2Icon, TruckIcon } from "lucide-react"
import { track, type FunnelEvent, type TrackPayload } from "@/app/actions"
import { getAttribution } from "@/lib/attribution"
import { formatPrice, getProduct, type Product, type ProductColor } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { PaymentMethods } from "@/components/trust-badges"

type Item = { slug: string; colorId: string }
export type Line = Item & { qty: number }
export type CartLine = { line: Line; product: Product; color: ProductColor }
type Cart = { lines: Line[]; ready: boolean; add: (item: Item) => void; show: () => void }

const KEY = "cb_cart"
const MAX_QTY = 10
const CartContext = createContext<Cart | null>(null)

export function useCart() {
  const cart = useContext(CartContext)
  if (!cart) throw new Error("useCart must be used inside CartProvider")
  return cart
}

// Lines joined with their product and color; unknown products (renamed slugs) are dropped.
export function resolveLines(lines: Line[]): CartLine[] {
  return lines.flatMap((line) => {
    const product = getProduct(line.slug)
    const color = product?.colors.find((c) => c.id === line.colorId) ?? product?.colors[0]
    return product && color ? [{ line, product, color }] : []
  })
}

export function cartTotals(items: CartLine[]) {
  const count = items.reduce((n, i) => n + i.line.qty, 0)
  const total = items.reduce((n, i) => n + i.product.price * i.line.qty, 0)
  const original = items.reduce((n, i) => n + (i.product.compareAt ?? i.product.price) * i.line.qty, 0)
  return { count, total, original, saved: original - total }
}

// One summary for events about the whole cart, e.g. "ספריית לונה (אפור מעושן) ×2 + שידת הלילה (ענבר)".
export function cartSummary(items: CartLine[]) {
  const { count, total } = cartTotals(items)
  const product = items.map((i) => `${i.product.name} (${i.color.name})${i.line.qty > 1 ? ` ×${i.line.qty}` : ""}`).join(" + ")
  return { product, price: total, quantity: count }
}

// Saved in sessionStorage so the cart survives page loads. Older one-item carts are migrated.
function load(): Line[] {
  const saved = JSON.parse(sessionStorage.getItem(KEY) ?? "[]") as Line[] | Item
  return Array.isArray(saved) ? saved : [{ ...saved, qty: 1 }]
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [lines, setLines] = useState<Line[]>([])
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)
  const leaving = useRef(false) // true while heading to checkout, so that close isn't logged as abandonment

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring client-only storage after hydration
      setLines(load())
    } catch {}
    setReady(true)
  }, [])

  const items = resolveLines(lines)
  const totals = cartTotals(items)

  function save(next: Line[]) {
    setLines(next)
    try {
      sessionStorage.setItem(KEY, JSON.stringify(next))
    } catch {}
  }

  const log = (event: FunnelEvent, extra: Partial<TrackPayload>) =>
    track({ event, ...extra, page: location.pathname, attribution: getAttribution() })
  const lineCtx = ({ product, color, line }: CartLine) => ({ product: product.name, color: color.name, price: product.price, quantity: line.qty })

  function openWith(source: "add" | "header", ctx: Partial<TrackPayload>) {
    log("cart_open", { ...ctx, source })
    sendGTMEvent({ event: "view_cart", source, product: ctx.product, value: ctx.price, currency: "ILS" })
    leaving.current = false
    setOpen(true)
  }

  // `source` says how the cart was closed: the "continue shopping" button, the X, a tap outside, or Escape.
  const CLOSE_SOURCE: Record<string, string> = { "close-press": "x", "outside-press": "outside", "escape-key": "escape" }
  function onOpenChange(next: boolean, details?: { reason?: string } | string) {
    const source = typeof details === "string" ? details : CLOSE_SOURCE[details?.reason ?? ""] ?? details?.reason
    if (!next && !leaving.current) log("cart_close", { ...cartSummary(items), source })
    setOpen(next)
  }

  const same = (a: Item, b: Item) => a.slug === b.slug && a.colorId === b.colorId

  function setQty(item: CartLine, qty: number) {
    const next = Math.min(MAX_QTY, Math.max(1, qty))
    if (next === item.line.qty) return
    log("cart_update", { ...lineCtx(item), quantity: next })
    save(lines.map((l) => (same(l, item.line) ? { ...l, qty: next } : l)))
  }

  function remove(item: CartLine) {
    log("cart_remove", lineCtx(item))
    sendGTMEvent({ event: "remove_from_cart", product: item.product.name, value: item.product.price * item.line.qty, currency: "ILS" })
    save(lines.filter((l) => !same(l, item.line)))
  }

  function checkout() {
    if (!items.length) return
    const summary = cartSummary(items)
    log("cart_checkout", summary)
    sendGTMEvent({ event: "begin_checkout", product: summary.product, value: summary.price, quantity: summary.quantity, currency: "ILS" })
    leaving.current = true
    setOpen(false)
    router.push("/checkout")
  }

  const cart: Cart = {
    lines,
    ready,
    // Adding the same product and color again raises its quantity instead of adding a new line.
    add: (item) => {
      const existing = lines.find((l) => same(l, item))
      const next = existing ? lines.map((l) => (l === existing ? { ...l, qty: Math.min(MAX_QTY, l.qty + 1) } : l)) : [...lines, { ...item, qty: 1 }]
      save(next)
      const added = resolveLines(next.filter((l) => same(l, item)))[0]
      openWith("add", added ? lineCtx(added) : {})
    },
    show: () => openWith("header", cartSummary(items)),
  }

  return (
    <CartContext.Provider value={cart}>
      {children}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="gap-0 overflow-x-hidden bg-background p-0 data-[side=left]:w-full data-[side=left]:sm:max-w-md">
          <div className="flex items-center gap-3 border-b border-border px-6 py-5">
            <ShoppingBagIcon className="size-5" />
            <SheetTitle className="text-xl font-bold">הסל שלך {totals.count ? `(${totals.count})` : ""}</SheetTitle>
          </div>

          {/* Free shipping strip: already unlocked, so the bar is full */}
          <div className="flex flex-col gap-2 bg-muted px-6 py-4">
            <span className="flex items-center gap-2 text-base font-bold">
              <TruckIcon className="size-5" /> המשלוח עלינו! משלוח חינם עד הבית
            </span>
            <span className="h-2 overflow-hidden rounded-full bg-background">
              <span className="block h-full w-full rounded-full bg-foreground" />
            </span>
          </div>

          {items.length ? (
            <>
              <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
                <ul className="flex flex-col gap-5">
                  {items.map((item) => {
                    const { line, product, color } = item
                    const img = product.images[color.image]
                    return (
                      <li key={`${line.slug}-${line.colorId}`} className="flex gap-4">
                        <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-muted">
                          <Image src={img.src} alt={img.alt} fill sizes="96px" className="object-cover" />
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                          <span className="text-lg leading-tight font-bold">{product.name}</span>
                          <span className="text-muted-foreground">צבע: {color.name}</span>
                          <div className="mt-auto flex items-center justify-between gap-2">
                            <div className="flex items-center rounded-full border border-border">
                              <button onClick={() => setQty(item, line.qty + 1)} disabled={line.qty >= MAX_QTY} aria-label="הוספת יחידה" className="grid size-9 place-items-center rounded-full disabled:opacity-30">
                                <PlusIcon className="size-4" />
                              </button>
                              <span className="w-6 text-center font-bold" aria-live="polite">{line.qty}</span>
                              <button onClick={() => setQty(item, line.qty - 1)} disabled={line.qty <= 1} aria-label="הורדת יחידה" className="grid size-9 place-items-center rounded-full disabled:opacity-30">
                                <MinusIcon className="size-4" />
                              </button>
                            </div>
                            <span className="text-lg font-black">{formatPrice(product.price * line.qty)}</span>
                          </div>
                        </div>
                        <button onClick={() => remove(item)} aria-label={`הסרת ${product.name} מהסל`} className="grid size-9 shrink-0 place-items-center self-start rounded-full transition-colors hover:bg-muted">
                          <Trash2Icon className="size-4" />
                        </button>
                      </li>
                    )
                  })}
                </ul>

                <dl className="flex flex-col gap-3 border-t border-border pt-5 text-base">
                  {totals.saved > 0 && (
                    <>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">מחיר מקורי</dt>
                        <dd className="text-muted-foreground line-through">{formatPrice(totals.original)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>הנחת השקה</dt>
                        <dd dir="ltr" className="font-bold">-{formatPrice(totals.saved)}</dd>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <dt>משלוח</dt>
                    <dd className="font-bold">חינם</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3 text-xl">
                    <dt className="font-bold">סה״כ</dt>
                    <dd className="font-black">{formatPrice(totals.total)}</dd>
                  </div>
                  {totals.saved > 0 && <p className="rounded-xl bg-muted px-4 py-2 text-center font-bold">חסכתם {formatPrice(totals.saved)} בהזמנה הזו</p>}
                </dl>
              </div>

              <div className="flex flex-col gap-3 border-t border-border px-6 py-5">
                <Button size="lg" className="w-full" onClick={checkout}>
                  <LockIcon /> למעבר לתשלום
                </Button>
                <Button size="lg" variant="outline" className="w-full" onClick={() => onOpenChange(false, "continue")}>
                  להמשיך בקניות
                </Button>
                <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <RotateCcwIcon className="size-4" /> החזרה תוך 14 יום · תשלום מאובטח
                </p>
                <PaymentMethods className="[&>span]:hidden" />
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
              <ShoppingBagIcon className="size-10 text-muted-foreground" />
              <p className="text-lg font-bold">הסל שלכם ריק</p>
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false, "collection")
                  router.push("/#collection")
                }}
              >
                לקולקציה
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </CartContext.Provider>
  )
}

// Header bag icon: shows the number of units and opens the drawer.
export function CartButton() {
  const { lines, show } = useCart()
  const count = lines.reduce((n, l) => n + l.qty, 0)
  return (
    <button onClick={show} aria-label="סל קניות" className="relative grid size-11 place-items-center rounded-full transition-colors hover:bg-muted">
      <ShoppingBagIcon className="size-5" />
      <span className="absolute -top-0.5 -end-0.5 grid size-5 place-items-center rounded-full bg-foreground text-xs font-bold text-background">
        {count}
      </span>
    </button>
  )
}
