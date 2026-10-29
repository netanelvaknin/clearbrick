"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { sendGTMEvent } from "@next/third-parties/google"
import { LockIcon, RotateCcwIcon, ShoppingBagIcon, Trash2Icon, TruckIcon } from "lucide-react"
import { track, type FunnelEvent } from "@/app/actions"
import { getAttribution } from "@/lib/attribution"
import { formatPrice, getProduct } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { PaymentMethods } from "@/components/trust-badges"

type Item = { slug: string; colorId: string }
type Cart = { item?: Item; add: (item: Item) => void; show: () => void }

const KEY = "cb_cart"
const CartContext = createContext<Cart | null>(null)

export function useCart() {
  const cart = useContext(CartContext)
  if (!cart) throw new Error("useCart must be used inside CartProvider")
  return cart
}

// One-item cart for the demand test: adding replaces the item. Kept in sessionStorage so it survives page loads.
export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [item, setItem] = useState<Item>()
  const [open, setOpen] = useState(false)
  const leaving = useRef(false) // true while heading to checkout, so that close isn't logged as abandonment

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(KEY)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring client-only storage after hydration
      if (saved) setItem(JSON.parse(saved))
    } catch {}
  }, [])

  const product = item && getProduct(item.slug)
  const color = product?.colors.find((c) => c.id === item?.colorId) ?? product?.colors[0]
  const ctx = product ? { product: product.name, color: color?.name, price: product.price } : {}
  const log = (event: FunnelEvent) => track({ event, ...ctx, page: location.pathname, attribution: getAttribution() })

  function save(next?: Item) {
    setItem(next)
    try {
      if (next) sessionStorage.setItem(KEY, JSON.stringify(next))
      else sessionStorage.removeItem(KEY)
    } catch {}
  }

  function openWith(source: "add" | "header", forItem?: Item) {
    const p = forItem ? getProduct(forItem.slug) : product
    const c = p?.colors.find((x) => x.id === forItem?.colorId) ?? color
    track({ event: "cart_open", source, product: p?.name, color: c?.name, price: p?.price, page: location.pathname, attribution: getAttribution() })
    sendGTMEvent({ event: "view_cart", source, product: p?.name, value: p?.price, currency: "ILS" })
    leaving.current = false
    setOpen(true)
  }

  function onOpenChange(next: boolean) {
    if (!next && !leaving.current) log("cart_close")
    setOpen(next)
  }

  function remove() {
    log("cart_remove")
    sendGTMEvent({ event: "remove_from_cart", product: product?.name, value: product?.price, currency: "ILS" })
    save(undefined)
  }

  function checkout() {
    if (!item || !product) return
    log("cart_checkout")
    sendGTMEvent({ event: "begin_checkout", product: product.name, color: color?.name, value: product.price, currency: "ILS" })
    leaving.current = true
    setOpen(false)
    router.push(`/checkout?product=${item.slug}&color=${item.colorId}`)
  }

  const cart: Cart = {
    item,
    add: (next) => {
      save(next)
      openWith("add", next)
    },
    show: () => openWith("header"),
  }

  const saved = product?.compareAt ? product.compareAt - product.price : 0

  return (
    <CartContext.Provider value={cart}>
      {children}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="gap-0 overflow-x-hidden bg-background p-0 data-[side=left]:w-full data-[side=left]:sm:max-w-md">
          <div className="flex items-center gap-3 border-b border-border px-6 py-5">
            <ShoppingBagIcon className="size-5" />
            <SheetTitle className="text-xl font-bold">הסל שלך {item ? "(1)" : ""}</SheetTitle>
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

          {product && color ? (
            <>
              <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
                <div className="flex gap-4">
                  <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl bg-muted">
                    <Image src={product.images[color.image].src} alt={product.images[color.image].alt} fill sizes="112px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-lg font-bold">{product.name}</span>
                    <span className="text-muted-foreground">צבע: {color.name}</span>
                    <span className="mt-auto flex items-baseline gap-2">
                      <span className="text-xl font-black">{formatPrice(product.price)}</span>
                      {product.compareAt && <span className="text-muted-foreground line-through">{formatPrice(product.compareAt)}</span>}
                    </span>
                  </div>
                  <button onClick={remove} aria-label="הסרה מהסל" className="grid size-9 shrink-0 place-items-center self-start rounded-full transition-colors hover:bg-muted">
                    <Trash2Icon className="size-4" />
                  </button>
                </div>

                <dl className="flex flex-col gap-3 border-t border-border pt-5 text-base">
                  {product.compareAt && (
                    <>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">מחיר מקורי</dt>
                        <dd className="text-muted-foreground line-through">{formatPrice(product.compareAt)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>הנחת השקה</dt>
                        <dd dir="ltr" className="font-bold">-{formatPrice(saved)}</dd>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <dt>משלוח</dt>
                    <dd className="font-bold">חינם</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3 text-xl">
                    <dt className="font-bold">סה״כ</dt>
                    <dd className="font-black">{formatPrice(product.price)}</dd>
                  </div>
                  {saved > 0 && <p className="rounded-xl bg-muted px-4 py-2 text-center font-bold">חסכתם {formatPrice(saved)} בהזמנה הזו</p>}
                </dl>
              </div>

              <div className="flex flex-col gap-3 border-t border-border px-6 py-5">
                <Button size="lg" className="w-full" onClick={checkout}>
                  <LockIcon /> למעבר לתשלום
                </Button>
                <Button size="lg" variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
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
                  onOpenChange(false)
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

// Header bag icon: shows the item count and opens the drawer.
export function CartButton() {
  const { item, show } = useCart()
  return (
    <button onClick={show} aria-label="סל קניות" className="relative grid size-11 place-items-center rounded-full transition-colors hover:bg-muted">
      <ShoppingBagIcon className="size-5" />
      <span className="absolute -top-0.5 -end-0.5 grid size-5 place-items-center rounded-full bg-foreground text-xs font-bold text-background">
        {item ? 1 : 0}
      </span>
    </button>
  )
}
