"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { sendGTMEvent } from "@next/third-parties/google"
import { CheckIcon, ShoppingBagIcon, TicketPercentIcon, ZapIcon } from "lucide-react"
import type { FunnelEvent } from "@/app/actions"
import { track } from "@/lib/track"
import { getAttribution } from "@/lib/attribution"
import { useCart } from "@/components/cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { FieldError } from "@/components/field-error"

export type Ctx = { product: string; color?: string; price?: number }

// Add to cart opens the cart drawer; quick buy skips it and goes straight to checkout.
// `source` tells the buy box apart from the mobile sticky bar in Make.
export function useBuy({ ctx, slug, colorId }: { ctx: Ctx; slug: string; colorId: string }) {
  const router = useRouter()
  const cart = useCart()

  return (event: FunnelEvent, source?: string) => {
    track({ event, ...ctx, source, page: location.pathname, attribution: getAttribution() })
    // GA4-standard names so GTM tags (Meta/TikTok pixels) can trigger on them
    sendGTMEvent({ event: event === "add_to_cart" ? "add_to_cart" : "begin_checkout", product: ctx.product, color: ctx.color, value: ctx.price, currency: "USD" })
    if (event === "add_to_cart") cart.add({ slug, colorId })
    else router.push(`/checkout?product=${slug}&color=${colorId}`)
  }
}

export function BuyButtons({ ctx, slug, colorId, className }: { ctx: Ctx; slug: string; colorId: string; className?: string }) {
  const start = useBuy({ ctx, slug, colorId })

  return (
    <div className={className}>
      <Button size="lg" className="w-full" onClick={() => start("add_to_cart")}>
        <ShoppingBagIcon /> Add to cart
      </Button>
      <Button size="lg" variant="outline" className="w-full" onClick={() => start("checkout_initiated")}>
        <ZapIcon /> Buy now
      </Button>
    </div>
  )
}

export function OutOfStockDialog({ ctx, open, onOpenChange }: { ctx: Ctx; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [sent, setSent] = useState(false)
  const [failed, setFailed] = useState(false)
  const popup = useRef<HTMLDivElement>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>({ defaultValues: { email: "" } })

  async function onSubmit({ email }: { email: string }) {
    setFailed(false)
    const res = await track({ event: "notify_me", email, offer: "10%", ...ctx, page: location.pathname, attribution: getAttribution() })
    if (!res.ok) return setFailed(true)
    sendGTMEvent({ event: "generate_lead", lead_type: "waitlist", product: ctx.product })
    setSent(true)
  }

  // Closing without leaving an email is its own funnel signal.
  function setOpen(next: boolean) {
    if (!next && !sent) track({ event: "dialog_closed", ...ctx, page: location.pathname, attribution: getAttribution() })
    onOpenChange(next)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* Focus the dialog itself, not the email field: no keyboard popping up, the visitor reads first. */}
        <DialogContent ref={popup} initialFocus={popup} className="gap-6 rounded-3xl p-8 sm:max-w-lg">
          {sent ? (
            <div className="flex flex-col items-center gap-5 py-4 text-center">
              <span className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground">
                <CheckIcon className="size-8" />
              </span>
              <DialogTitle className="text-display-sm font-extrabold">Your coupon is saved!</DialogTitle>
              <DialogDescription className="text-lg">
                As soon as it’s back in stock, we’ll email you a 10% off coupon.
              </DialogDescription>
              <Button className="w-full" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 text-start">
                <span className="text-eyebrow w-fit rounded-full bg-muted px-3 py-1">Sold out</span>
                <DialogTitle className="text-display-sm font-extrabold">Oops, this one sold out fast</DialogTitle>
                <DialogDescription className="text-lg leading-relaxed">
                  This item is currently sold out. Leave your email and we’ll send you a discount coupon the moment it’s back.
                </DialogDescription>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-foreground/20 bg-muted p-4">
                <TicketPercentIcon className="size-10 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-2xl font-black">10% off</span>
                  <span className="text-muted-foreground">your order when you sign up now</span>
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="notify-email">Email</Label>
                  <Input
                    id="notify-email"
                    type="email"
                    dir="ltr"
                    autoComplete="email"
                    className="text-start"
                    aria-invalid={!!errors.email}
                    {...register("email", {
                      required: "We need your email to send the coupon",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "That email doesn't look right" },
                    })}
                  />
                  <FieldError message={errors.email?.message} />
                </div>
                {failed && <FieldError message="Something went wrong. Please try again in a moment." />}
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send me the coupon"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  By signing up you agree to the 
                  <Link href="/terms#privacy" className="underline underline-offset-4" onClick={() => setOpen(false)}>
                    terms & privacy policy
                  </Link>
                </p>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
