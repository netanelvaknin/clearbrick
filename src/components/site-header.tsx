import Link from "next/link"
import { MenuIcon, ShoppingBagIcon } from "lucide-react"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "@/components/logo"

const NAV = [
  { href: "/products/arch-bookshelf", label: "מדף הקשת" },
  { href: "/products/bedside-table", label: "שידת הלילה" },
  { href: "/#why", label: "למה אקריליק" },
  { href: "/contact", label: "צרו קשר" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container-site flex h-18 items-center justify-between gap-6">
        <Link href="/" aria-label="קלירבריק, לדף הבית">
          <Logo />
        </Link>

        <nav className="hidden items-center divide-x divide-border text-lg font-semibold md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="px-6 leading-5 transition-opacity hover:opacity-60">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/products/arch-bookshelf"
            aria-label="סל קניות"
            className="relative grid size-12 place-items-center rounded-full transition-colors hover:bg-muted"
          >
            <ShoppingBagIcon className="size-6" />
            <span className="absolute -top-0.5 -end-0.5 grid size-5 place-items-center rounded-full bg-foreground text-xs font-bold text-background">
              0
            </span>
          </Link>
          <Sheet>
            <SheetTrigger
              aria-label="תפריט"
              className="grid size-12 place-items-center rounded-full transition-colors hover:bg-muted md:hidden"
            >
              <MenuIcon className="size-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm bg-background p-8">
              <SheetTitle className="sr-only">תפריט</SheetTitle>
              <nav className="mt-12 flex flex-col divide-y divide-border border-y border-border">
                {NAV.map((n) => (
                  <SheetClose key={n.href} nativeButton={false} render={<Link href={n.href} />} className="py-5 text-display-sm">
                    {n.label}
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
