import type { Metadata } from "next"
import { MailIcon, MessageCircleIcon } from "lucide-react"
import { ContactForm } from "@/components/contact-form"

export const metadata: Metadata = {
  title: "צרו קשר",
  description: "שאלה על מוצר, מידות או צבעים? כתבו לנו ונחזור אליכם מהר.",
}

export default function ContactPage() {
  return (
    <section className="container-site grid gap-12 py-12 md:grid-cols-[1fr_1.3fr] md:py-20">
      <div className="flex flex-col gap-8">
        <span className="text-eyebrow text-muted-foreground">צרו קשר</span>
        <h1 className="text-display-lg">בואו נדבר.</h1>
        <p className="max-w-md text-xl leading-relaxed text-muted-foreground">
          שאלה על מידות? מתלבטים בין צבעים? כתבו לנו, אנחנו עונים מהר ובלי בוטים.
        </p>
        <div className="flex flex-col gap-4">
          <a href="mailto:clearbrickisrael@gmail.com" className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5 transition hover:border-foreground">
            <span className="grid size-12 place-items-center rounded-full bg-muted"><MailIcon className="size-5" /></span>
            <span className="flex flex-col">
              <span className="text-sm text-muted-foreground">מייל</span>
              <span dir="ltr" className="text-lg font-bold">clearbrickisrael@gmail.com</span>
            </span>
          </a>
          <div className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5">
            <span className="grid size-12 place-items-center rounded-full bg-muted"><MessageCircleIcon className="size-5" /></span>
            <span className="flex flex-col">
              <span className="text-sm text-muted-foreground">זמן מענה</span>
              <span className="text-lg font-bold">עד יום עסקים אחד</span>
            </span>
          </div>
        </div>
      </div>
      <ContactForm />
    </section>
  )
}
