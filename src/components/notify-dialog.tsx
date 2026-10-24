"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { CheckIcon, ShoppingBagIcon, ZapIcon } from "lucide-react"
import { track, type FunnelEvent } from "@/app/actions"
import { getAttribution } from "@/lib/attribution"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { FieldError } from "@/components/field-error"

type Ctx = { product: string; color?: string; price?: number }

export function BuyButtons({ ctx, className }: { ctx: Ctx; className?: string }) {
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [failed, setFailed] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>()

  function start(event: FunnelEvent) {
    track({ event, ...ctx, page: location.pathname, attribution: getAttribution() })
    setSent(false)
    setOpen(true)
  }

  async function onSubmit({ email }: { email: string }) {
    setFailed(false)
    const res = await track({ event: "notify_me", email, ...ctx, page: location.pathname, attribution: getAttribution() })
    if (!res.ok) return setFailed(true)
    setSent(true)
  }

  return (
    <>
      <div className={className}>
        <Button size="lg" className="w-full" onClick={() => start("add_to_cart")}>
          <ShoppingBagIcon /> הוספה לסל
        </Button>
        <Button size="lg" variant="outline" className="w-full" onClick={() => start("checkout_initiated")}>
          <ZapIcon /> לקנייה מהירה
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-6 rounded-3xl p-8 sm:max-w-lg">
          {sent ? (
            <div className="flex flex-col items-center gap-5 py-4 text-center">
              <span className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground">
                <CheckIcon className="size-8" />
              </span>
              <DialogTitle className="text-display-sm font-extrabold">רשמנו אתכם!</DialogTitle>
              <DialogDescription className="text-lg">
                נשלח לכם מייל ברגע שה{ctx.product} חוזר למלאי, וזה יקרה ממש בקרוב.
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
                  ה{ctx.product} אזל כרגע מהמלאי. השאירו מייל ונעדכן אתכם ראשונים כשהוא חוזר, ממש בקרוב.
                </DialogDescription>
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
                      required: "צריך מייל כדי שנוכל לעדכן",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "המייל לא נראה תקין" },
                    })}
                  />
                  <FieldError message={errors.email?.message} />
                </div>
                {failed && <FieldError message="משהו השתבש. נסו שוב בעוד רגע." />}
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "שולחים..." : "עדכנו אותי"}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
