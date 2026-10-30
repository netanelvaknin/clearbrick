"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { sendGTMEvent } from "@next/third-parties/google"
import { CheckIcon, ShoppingBagIcon, TicketPercentIcon, ZapIcon } from "lucide-react"
import { track, type FunnelEvent } from "@/app/actions"
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
    sendGTMEvent({ event: event === "add_to_cart" ? "add_to_cart" : "begin_checkout", product: ctx.product, color: ctx.color, value: ctx.price, currency: "ILS" })
    if (event === "add_to_cart") cart.add({ slug, colorId })
    else router.push(`/checkout?product=${slug}&color=${colorId}`)
  }
}

export function BuyButtons({ ctx, slug, colorId, className }: { ctx: Ctx; slug: string; colorId: string; className?: string }) {
  const start = useBuy({ ctx, slug, colorId })

  return (
    <div className={className}>
      <Button size="lg" className="w-full" onClick={() => start("add_to_cart")}>
        <ShoppingBagIcon /> הוספה לסל
      </Button>
      <Button size="lg" variant="outline" className="w-full" onClick={() => start("checkout_initiated")}>
        <ZapIcon /> לקנייה מהירה
      </Button>
    </div>
  )
}

export function OutOfStockDialog({ ctx, defaultEmail, open, onOpenChange }: { ctx: Ctx; defaultEmail?: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [sent, setSent] = useState(false)
  const [failed, setFailed] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>({ defaultValues: { email: defaultEmail ?? "" } })

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
        <DialogContent className="gap-6 rounded-3xl p-8 sm:max-w-lg">
          {sent ? (
            <div className="flex flex-col items-center gap-5 py-4 text-center">
              <span className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground">
                <CheckIcon className="size-8" />
              </span>
              <DialogTitle className="text-display-sm font-extrabold">הקופון שמור לכם!</DialogTitle>
              <DialogDescription className="text-lg">
                ברגע שהמוצר חוזר למלאי נשלח לכם למייל קופון של 10% הנחה.
              </DialogDescription>
              <Button className="w-full" onClick={() => setOpen(false)}>
                סגירה
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 text-start">
                <span className="text-eyebrow w-fit rounded-full bg-muted px-3 py-1">אזל מהמלאי</span>
                <DialogTitle className="text-display-sm font-extrabold">אופס, נחטף מהר מדי</DialogTitle>
                <DialogDescription className="text-lg leading-relaxed">
                  המוצר הזה אזל כרגע מהמלאי. השאירו מייל ונשלח לכם קופון הנחה ברגע שהוא חוזר.
                </DialogDescription>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-foreground/20 bg-muted p-4">
                <TicketPercentIcon className="size-10 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-2xl font-black">10% הנחה</span>
                  <span className="text-muted-foreground">על ההזמנה, למי שנרשם עכשיו</span>
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="notify-email">אימייל</Label>
                  <Input
                    id="notify-email"
                    type="email"
                    dir="ltr"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="text-start"
                    aria-invalid={!!errors.email}
                    {...register("email", {
                      required: "צריך מייל כדי שנוכל לשלוח את הקופון",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "המייל לא נראה תקין" },
                    })}
                  />
                  <FieldError message={errors.email?.message} />
                </div>
                {failed && <FieldError message="משהו השתבש. נסו שוב בעוד רגע." />}
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "שולחים..." : "שלחו לי את הקופון"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  בהרשמה אתם מסכימים ל
                  <Link href="/terms#privacy" className="underline underline-offset-4" onClick={() => setOpen(false)}>
                    תנאי השימוש והפרטיות
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
