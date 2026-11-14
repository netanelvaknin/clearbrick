"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpLeftIcon, FilterIcon, GlobeIcon, LayoutDashboardIcon, LogOutIcon, MegaphoneIcon, MenuIcon, PackageIcon } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { logout } from "../login/actions"

const SECTIONS = [
  { href: "/admin#overview", label: "סקירה", icon: LayoutDashboardIcon },
  { href: "/admin#funnel", label: "משפך", icon: FilterIcon },
  { href: "/admin#traffic", label: "תנועה", icon: GlobeIcon },
  { href: "/admin#products", label: "מוצרים", icon: PackageIcon },
  { href: "/admin/meta", label: "Meta", icon: MegaphoneIcon },
]

// Desktop: fixed sidebar on the start (right) edge. Phones: top bar with a menu button that opens the same items in a drawer.
export function AdminNav() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <aside className="fixed inset-y-0 start-0 z-30 hidden w-60 flex-col bg-foreground p-4 text-background md:flex">
        <Logo />
        <Items />
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-foreground px-4 text-background md:hidden">
        <Logo />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger aria-label="תפריט" className="grid size-10 place-items-center rounded-full hover:bg-background/10">
            <MenuIcon className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72 border-none bg-foreground p-4 text-background">
            <SheetTitle className="sr-only">תפריט</SheetTitle>
            <Logo />
            <Items onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </header>
    </>
  )
}

function Logo() {
  return (
    <Link href="/admin" className="flex items-baseline gap-2 px-2 py-1 text-lg font-black">
      clearbrick <span className="rounded bg-background/15 px-1.5 py-0.5 text-xs font-bold">admin</span>
    </Link>
  )
}

const item = "flex h-11 items-center gap-3 rounded-xl px-3 text-background/75 hover:bg-background/10 hover:text-background"

function Items({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="mt-6 flex flex-1 flex-col">
      <nav className="flex flex-col gap-1">
        {SECTIONS.map(({ href, label, icon: Icon }) => (
          <a key={href} href={href} onClick={onNavigate} className={item}>
            <Icon className="size-4" /> {label}
          </a>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-1 border-t border-background/15 pt-4">
        <a href="https://www.clearbrick.co.il" target="_blank" rel="noreferrer" className={item}>
          <ArrowUpLeftIcon className="size-4" /> לאתר
        </a>
        <form action={logout}>
          <button className={`${item} w-full`}>
            <LogOutIcon className="size-4" /> יציאה
          </button>
        </form>
      </div>
    </div>
  )
}
