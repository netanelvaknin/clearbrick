"use client"

import { useState } from "react"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { sendGTMEvent } from "@next/third-parties/google"
import { CheckIcon } from "lucide-react"
import { track } from "@/lib/track"
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
    sendGTMEvent({ event: "generate_lead", lead_type: "contact" })
    reset()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-6 rounded-[2rem] border border-border bg-card p-8 md:p-12">
        <span className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground">
          <CheckIcon className="size-8" />
        </span>
        <h2 className="text-display-sm">Your message is on its way!</h2>
        <p className="text-xl text-muted-foreground">Thanks for writing. We’ll get back to you very soon.</p>
        <Button variant="outline" onClick={() => setSent(false)}>
          Send another message
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
        <Field id="name" label="Full name" error={errors.name?.message}>
          <Input id="name" autoComplete="name" placeholder="What's your name?" aria-invalid={!!errors.name}
            {...register("name", { required: "Let us know what to call you" })} />
        </Field>
        <Field id="phone" label="Phone (optional)" error={errors.phone?.message}>
          <Input id="phone" type="tel" dir="ltr" autoComplete="tel" placeholder="(555) 555-0123" className="text-start" aria-invalid={!!errors.phone}
            {...register("phone", { pattern: { value: /^[0-9+\-\s]{9,15}$/, message: "That phone number doesn't look right" } })} />
        </Field>
      </div>
      <Field id="email" label="Email" error={errors.email?.message}>
        <Input id="email" type="email" dir="ltr" autoComplete="email" placeholder="you@example.com" className="text-start" aria-invalid={!!errors.email}
          {...register("email", {
            required: "We need your email to get back to you",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "That email doesn't look right" },
          })} />
      </Field>
      <Field id="message" label="What would you like to tell us?" error={errors.message?.message}>
        <Textarea id="message" placeholder="A question about a product, sizes, colors, anything" aria-invalid={!!errors.message}
          {...register("message", { required: "Write us a few words", maxLength: { value: 2000, message: "Up to 2,000 characters" } })} />
      </Field>
      <Controller
        name="marketingOptIn"
        control={control}
        render={({ field }) => (
          <Label className="cursor-pointer font-normal text-muted-foreground">
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            Send me news about new products and deals
          </Label>
        )}
      />
      {failed && <FieldError message="Something went wrong sending. Please try again in a moment." />}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-fit">
          {isSubmitting ? "Sending..." : "Send"}
        </Button>
        <p className="text-sm text-muted-foreground">
          By sending you agree to the 
          <Link href="/terms#privacy" className="underline underline-offset-4">
            terms & privacy policy
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
