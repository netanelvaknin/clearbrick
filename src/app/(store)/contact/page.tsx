import type { Metadata } from "next"
import { MailIcon, MessageCircleIcon } from "lucide-react"
import { ContactForm } from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Contact",
  description: "Question about a product, sizes or colors? Write to us and we'll get back to you fast.",
}

export default function ContactPage() {
  return (
    <section className="container-site grid gap-12 py-12 md:grid-cols-[1fr_1.3fr] md:py-20">
      <div className="flex flex-col gap-8">
        <span className="text-eyebrow text-muted-foreground">Contact</span>
        <h1 className="text-display-lg">Let’s talk.</h1>
        <p className="max-w-md text-xl leading-relaxed text-muted-foreground">
          Question about sizes? Can’t pick a color? Write to us. We answer fast, and no bots.
        </p>
        <div className="flex flex-col gap-4">
          <a href="mailto:info@clearbrick.co.il" className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5 transition hover:border-foreground">
            <span className="grid size-12 place-items-center rounded-full bg-muted"><MailIcon className="size-5" /></span>
            <span className="flex flex-col">
              <span className="text-sm text-muted-foreground">Email</span>
              <span dir="ltr" className="text-lg font-bold">info@clearbrick.co.il</span>
            </span>
          </a>
          <div className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5">
            <span className="grid size-12 place-items-center rounded-full bg-muted"><MessageCircleIcon className="size-5" /></span>
            <span className="flex flex-col">
              <span className="text-sm text-muted-foreground">Response time</span>
              <span className="text-lg font-bold">Within one business day</span>
            </span>
          </div>
        </div>
      </div>
      <ContactForm />
    </section>
  )
}
