import { MessageCircleIcon, RotateCcwIcon, ShieldCheckIcon, TruckIcon } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

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
