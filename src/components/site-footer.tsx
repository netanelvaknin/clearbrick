import Link from "next/link"
import { LockIcon } from "lucide-react"
import { Logo } from "@/components/logo"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr]">
        <div className="flex flex-col gap-5">
          <Logo className="self-start" />
          <p className="max-w-sm text-lg text-muted-foreground">
            Clear acrylic furniture for homes that love light.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">Shop</h2>
          <Link href="/shop" className="text-lg text-muted-foreground hover:text-foreground">
            Collection
          </Link>
          <Link href="/products/arch-bookshelf" className="text-lg text-muted-foreground hover:text-foreground">
            Luna Bookshelf
          </Link>
          <Link href="/products/bedside-table" className="text-lg text-muted-foreground hover:text-foreground">
            Laila Nightstand
          </Link>
          <Link href="/products/acrylic-desk" className="text-lg text-muted-foreground hover:text-foreground">
            Ora Desk
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">Talk to us</h2>
          <Link href="/contact" className="text-lg text-muted-foreground hover:text-foreground">
            Contact
          </Link>
          <a href="mailto:info@clearbrick.co.il" dir="ltr" className="w-fit text-lg text-muted-foreground hover:text-foreground">
            info@clearbrick.co.il
          </a>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-site flex flex-wrap items-center justify-between gap-4 py-6 text-sm text-muted-foreground">
          <p>© 2026 clearbrick. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <LockIcon className="size-4" /> Secure site · SSL-encrypted checkout
          </p>
          <Link href="/terms" className="hover:text-foreground">
            Terms & privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
