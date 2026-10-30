import { DropletsIcon, GemIcon, MessageCircleIcon, RotateCcwIcon, ShieldCheckIcon, TruckIcon } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { SectionHeading } from "@/components/section-heading"

const BADGES = [
  { icon: ShieldCheckIcon, title: "קנייה בטוחה" },
  { icon: TruckIcon, title: "משלוח חינם" },
  { icon: RotateCcwIcon, title: "החזרה תוך 14 יום" },
  { icon: MessageCircleIcon, title: "שירות בוואטסאפ" },
]

export function TrustBadges({ className }: { className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3", className)}>
      {BADGES.map(({ icon: Icon, title }) => (
        <li key={title} className="flex flex-col items-center gap-2 rounded-2xl bg-background p-3 text-center sm:flex-row sm:gap-3 sm:text-start">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted">
            <Icon className="size-5" />
          </span>
          <span className="text-base leading-tight font-bold">{title}</span>
        </li>
      ))}
    </ul>
  )
}

// Longer version of the badges for the product page. Only promises the site already makes elsewhere.
const REASONS = [
  { icon: TruckIcon, title: "משלוח חינם עד הבית", text: "בלי עלויות נסתרות. המחיר שאתם רואים הוא המחיר שאתם משלמים." },
  { icon: RotateCcwIcon, title: "החזרה תוך 14 יום", text: "לא מתאים לחלל? מחזירים תוך 14 יום מקבלת המוצר." },
  { icon: ShieldCheckIcon, title: "תשלום מאובטח", text: "כרטיס אשראי, Apple Pay, Google Pay או bit." },
  { icon: MessageCircleIcon, title: "שירות אישי בוואטסאפ", text: "שאלה על מידות, צבע או משלוח? כתבו לנו ונחזור אליכם מהר." },
  { icon: GemIcon, title: "אקריליק, לא זכוכית", text: "שקוף כמו זכוכית, אבל קל יותר ועמיד הרבה יותר בפני שבירה." },
  { icon: DropletsIcon, title: "ניקוי בשנייה", text: "מטלית לחה וזהו. בלי חומרים מיוחדים." },
]

export function TrustSection({ className }: { className?: string }) {
  return (
    <section className={cn("container-site flex flex-col gap-10 py-20", className)}>
      <SectionHeading eyebrow="למה clearbrick" title="קונים בראש שקט." />
      {/* Mobile: compact rows with the icon beside the text. Desktop: 3-column cards. */}
      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {REASONS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-4 rounded-3xl border border-border bg-card p-5 sm:flex-col sm:gap-3 sm:rounded-[2rem] md:p-8">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-muted">
              <Icon className="size-6" />
            </span>
            <span className="flex flex-col gap-1 sm:gap-3">
              <span className="text-lg leading-tight font-bold md:text-xl">{title}</span>
              <span className="text-base leading-relaxed text-muted-foreground md:text-lg">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

const PAYMENTS = [
  { src: "/payments/visa.svg", alt: "Visa" },
  { src: "/payments/mastercard.svg", alt: "Mastercard" },
  { src: "/payments/applepay.svg", alt: "Apple Pay", size: "h-10" },
  { src: "/payments/googlepay.svg", alt: "Google Pay", size: "h-10" },
  { src: "/payments/bit.svg", alt: "bit" },
]

export function PaymentMethods({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <span className="text-base text-muted-foreground">תשלום מאובטח עם</span>
      <ul className="flex flex-wrap justify-center gap-1.5">
        {PAYMENTS.map((p) => (
          <li key={p.alt} className="grid h-11 w-[3.25rem] place-items-center overflow-hidden rounded-lg border border-border bg-background px-1.5">
            <Image src={p.src} alt={p.alt} width={40} height={24} className={cn("h-6 w-auto", p.size)} />
          </li>
        ))}
      </ul>
    </div>
  )
}
