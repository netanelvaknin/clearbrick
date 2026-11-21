import type { Metadata } from "next"
import { TagIcon } from "lucide-react"
import { products } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { TrustSection } from "@/components/trust-badges"

export const metadata: Metadata = {
  title: "Collection",
  description: "Clear and colored acrylic bookshelves, nightstands and desks. Black Friday: up to 30% off, free shipping.",
}

const maxOff = Math.max(...products.map((p) => (p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0)))

// Product listing page: every product, with the Black Friday offer on top.
export default function ShopPage() {
  return (
    <>
      <section className="container-site flex flex-col gap-10 py-12 md:py-20">
        <div className="flex flex-col gap-4">
          <span className="text-eyebrow text-muted-foreground">Collection</span>
          <h1 className="text-display-lg text-balance">The whole collection.</h1>
          <p className="max-w-2xl text-xl leading-relaxed text-muted-foreground">
            Three acrylic pieces that make any room feel bigger. Free shipping on every order.
          </p>
        </div>

        {/* Black Friday offer, same palette as the header strip */}
        <div className="flex flex-col gap-3 rounded-[2rem] bg-linear-to-r from-[#ff3b30] via-[#ff5a1f] to-[#ff8a00] p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-extrabold tracking-wide uppercase">🔥 Black Friday sale</span>
            <p className="text-2xl font-black md:text-3xl">Up to {maxOff}% off everything</p>
          </div>
          <p className="flex items-center gap-2 text-base font-semibold">
            <TagIcon className="size-4 shrink-0" /> Code BLACKFRIDAY26 is applied automatically. Ends Cyber Monday.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i === 0} />
          ))}
        </div>
      </section>

      <TrustSection className="pt-0" />
    </>
  )
}
