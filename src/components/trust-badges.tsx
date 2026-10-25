import { LockIcon, MessageCircleIcon, RotateCcwIcon, ShieldCheckIcon, TruckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const BADGES = [
  { icon: ShieldCheckIcon, title: "קנייה בטוחה", text: "פרטים מוצפנים" },
  { icon: TruckIcon, title: "משלוח חינם", text: "עד הבית" },
  { icon: RotateCcwIcon, title: "החזרה תוך 14 יום", text: "בלי כאב ראש" },
  { icon: MessageCircleIcon, title: "שירות בוואטסאפ", text: "אנשים אמיתיים" },
]

export function TrustBadges({ className }: { className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3", className)}>
      {BADGES.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex flex-col items-center gap-2 rounded-2xl bg-background p-3 text-center sm:flex-row sm:gap-3 sm:text-start">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted">
            <Icon className="size-5" />
          </span>
          <span className="flex flex-col leading-tight sm:items-start">
            <span className="text-base font-bold">{title}</span>
            <span className="text-sm text-muted-foreground">{text}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}

export function SecureNote({ className }: { className?: string }) {
  return (
    <p className={cn("flex items-center justify-center gap-2 text-sm text-muted-foreground", className)}>
      <LockIcon className="size-4" /> תשלום מאובטח · הצפנת SSL
    </p>
  )
}
