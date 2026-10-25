"use client"

import { useState } from "react"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { CheckIcon } from "lucide-react"
import { track } from "@/app/actions"
import { getAttribution } from "@/lib/attribution"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldError } from "@/components/field-error"

type Values = { name: string; email: string; phone: string; message: string; marketingOptIn: boolean }

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [failed, setFailed] = useState(false)
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ defaultValues: { name: "", email: "", phone: "", message: "", marketingOptIn: false } })

  async function onSubmit(values: Values) {
    setFailed(false)
    const res = await track({ event: "contact", ...values, page: location.pathname, attribution: getAttribution() })
    if (!res.ok) return setFailed(true)
    reset()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-6 rounded-[2rem] border border-border bg-card p-8 md:p-12">
        <span className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground">
          <CheckIcon className="size-8" />
        </span>
        <h2 className="text-display-sm">ההודעה בדרך אלינו!</h2>
        <p className="text-xl text-muted-foreground">תודה שכתבתם. נחזור אליכם ממש בקרוב.</p>
        <Button variant="outline" onClick={() => setSent(false)}>
          שליחת הודעה נוספת
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-6 rounded-[2rem] border border-border bg-card p-6 md:p-10"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Field id="name" label="שם מלא" error={errors.name?.message}>
          <Input id="name" autoComplete="name" placeholder="איך קוראים לכם?" aria-invalid={!!errors.name}
            {...register("name", { required: "נשמח לדעת איך לפנות אליכם" })} />
        </Field>
        <Field id="phone" label="טלפון (לא חובה)" error={errors.phone?.message}>
          <Input id="phone" type="tel" dir="ltr" autoComplete="tel" placeholder="050-0000000" className="text-start" aria-invalid={!!errors.phone}
            {...register("phone", { pattern: { value: /^[0-9+\-\s]{9,15}$/, message: "מספר הטלפון לא נראה תקין" } })} />
        </Field>
      </div>
      <Field id="email" label="אימייל" error={errors.email?.message}>
        <Input id="email" type="email" dir="ltr" autoComplete="email" placeholder="you@example.com" className="text-start" aria-invalid={!!errors.email}
          {...register("email", {
            required: "צריך מייל כדי שנוכל לחזור אליכם",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "המייל לא נראה תקין" },
          })} />
      </Field>
      <Field id="message" label="מה תרצו לספר לנו?" error={errors.message?.message}>
        <Textarea id="message" placeholder="שאלה על מוצר, מידות, צבעים, כל דבר" aria-invalid={!!errors.message}
          {...register("message", { required: "כתבו לנו כמה מילים", maxLength: { value: 2000, message: "עד 2000 תווים" } })} />
      </Field>
      <Controller
        name="marketingOptIn"
        control={control}
        render={({ field }) => (
          <Label className="cursor-pointer font-normal text-muted-foreground">
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            אשמח לקבל עדכונים על מוצרים חדשים והנחות
          </Label>
        )}
      />
      {failed && <FieldError message="משהו השתבש בשליחה. נסו שוב בעוד רגע." />}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-fit">
          {isSubmitting ? "שולחים..." : "שליחה"}
        </Button>
        <p className="text-sm text-muted-foreground">
          בשליחה אתם מסכימים ל
          <Link href="/terms#privacy" className="underline underline-offset-4">
            תנאי השימוש והפרטיות
          </Link>
        </p>
      </div>
    </form>
  )
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      <FieldError message={error} />
    </div>
  )
}
