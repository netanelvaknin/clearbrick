import Link from "next/link"
import { LockIcon } from "lucide-react"
import { Logo } from "@/components/logo"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr]">
        <div className="flex flex-col gap-5">
          <Logo />
          <p className="max-w-sm text-lg text-muted-foreground">
            רהיטי אקריליק שקופים לבית שאוהב אור. עיצוב נקי, צבע רק איפה שצריך.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">חנות</h2>
          <Link href="/products/arch-bookshelf" className="text-lg text-muted-foreground hover:text-foreground">
            מדף הקשת
          </Link>
          <Link href="/products/bedside-table" className="text-lg text-muted-foreground hover:text-foreground">
            שידת הלילה
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">דברו איתנו</h2>
          <Link href="/contact" className="text-lg text-muted-foreground hover:text-foreground">
            צרו קשר
          </Link>
          <a href="mailto:hello@clearbrick.co.il" dir="ltr" className="w-fit text-lg text-muted-foreground hover:text-foreground">
            hello@clearbrick.co.il
          </a>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-site flex flex-wrap items-center justify-between gap-4 py-6 text-sm text-muted-foreground">
          <p>© 2026 clearbrick. כל הזכויות שמורות.</p>
          <p className="flex items-center gap-2">
            <LockIcon className="size-4" /> אתר מאובטח · תשלום מוצפן SSL
          </p>
          <Link href="/terms" className="hover:text-foreground">
            תנאי שימוש ופרטיות
          </Link>
        </div>
      </div>
    </footer>
  )
}
