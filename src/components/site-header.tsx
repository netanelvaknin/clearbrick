import Link from "next/link"
import { ArrowUpLeftIcon, MenuIcon, MessageCircleIcon, PercentIcon, ShoppingBagIcon, TruckIcon } from "lucide-react"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { buttonVariants } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/products/arch-bookshelf", label: "מדף הקשת" },
  { href: "/products/bedside-table", label: "שידת הלילה", badge: "חדש" },
  { href: "/#why", label: "למה אקריליק" },
  { href: "/#about", label: "עלינו" },
  { href: "/contact", label: "צרו קשר" },
]

const PERKS = [
  { icon: TruckIcon, text: "משלוח חינם עד הבית" },
  { icon: MessageCircleIcon, text: "שירות לקוחות בוואטסאפ" },
  { icon: PercentIcon, text: "עד 30% הנחה על כל הקולקציה" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      {/* Announcement bar */}
      <div className="bg-foreground text-background">
        {/* Mobile: one perk at a time, sliding up (animate-perk cycles 3 perks × 3s). Desktop: all in a row. */}
        <ul className="container-site relative flex h-9 items-center justify-center gap-8 overflow-hidden text-sm font-medium">
          {PERKS.map(({ icon: Icon, text }, i) => (
            <li
              key={text}
              style={{ animationDelay: `${-((PERKS.length - i) % PERKS.length) * 3}s` }}
              className={cn(
                "absolute inset-0 flex animate-perk items-center justify-center gap-2 opacity-0 motion-reduce:animate-none md:static md:animate-none md:opacity-100",
                i === 0 && "motion-reduce:opacity-100"
              )}
            >
              <Icon className="size-4 opacity-70" />
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="container-site flex h-16 items-center justify-between gap-6">
          <Link href="/" aria-label="קלירבריק, לדף הבית">
            <Logo />
          </Link>

          <nav className="hidden items-center divide-x divide-border text-[15px] font-medium md:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="flex items-center gap-2 px-5 leading-5 transition-opacity hover:opacity-60">
                {n.label}
                {n.badge && (
                  <span className="rounded-full bg-foreground px-2 py-0.5 text-[11px] font-bold leading-none text-background">{n.badge}</span>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/#collection" className={cn(buttonVariants({ size: "sm" }), "hidden md:inline-flex")}>
              לקולקציה <ArrowUpLeftIcon />
            </Link>
            <Link
              href="/products/arch-bookshelf"
              aria-label="סל קניות"
              className="relative grid size-11 place-items-center rounded-full transition-colors hover:bg-muted"
            >
              <ShoppingBagIcon className="size-5" />
              <span className="absolute -top-0.5 -end-0.5 grid size-5 place-items-center rounded-full bg-foreground text-xs font-bold text-background">
                0
              </span>
            </Link>
            <Sheet>
              <SheetTrigger
                aria-label="תפריט"
                className="grid size-11 place-items-center rounded-full transition-colors hover:bg-muted md:hidden"
              >
                <MenuIcon className="size-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-sm bg-background p-8">
                <SheetTitle className="sr-only">תפריט</SheetTitle>
                <nav className="mt-12 flex flex-col divide-y divide-border border-y border-border">
                  {NAV.map((n) => (
                    <SheetClose
                      key={n.href}
                      nativeButton={false}
                      render={<Link href={n.href} />}
                      className="flex items-center justify-between py-5 text-2xl font-bold"
                    >
                      {n.label}
                      {n.badge && (
                        <span className="rounded-full bg-foreground px-2.5 py-1 text-xs font-bold text-background">{n.badge}</span>
                      )}
                    </SheetClose>
                  ))}
                </nav>
                <ul className="mt-8 flex flex-col gap-3 text-base text-muted-foreground">
                  {PERKS.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3">
                      <Icon className="size-5" />
                      {text}
                    </li>
                  ))}
                </ul>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
