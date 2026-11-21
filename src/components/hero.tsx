import Image from "next/image"
import Link from "next/link"
import { ArrowUpRightIcon, TagIcon } from "lucide-react"
import { getProduct, formatPrice } from "@/lib/products"
import type { HeroVariant } from "@/lib/heroes"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Same glass chip as the product cards' "4 colors" badge, for the hero photo.
const GLASS_CHIP =
  "rounded-full border border-white/60 bg-white/40 text-sm font-bold text-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.8)] backdrop-blur-md"

// Mobile: full-screen photo card with oversized type and glass controls. Desktop: split layout with the photo.
// Content comes from the ad the visitor clicked (see lib/heroes.ts).
export function Hero({ hero }: { hero: HeroVariant }) {
  const product = getProduct(hero.product)!
  const productHref = `/products/${product.slug}${hero.color ? `?color=${hero.color}` : ""}`
  // Desktop floating card promotes a different product than the hero.
  const other = getProduct(product.slug === "bedside-table" ? "acrylic-desk" : "bedside-table")!
  const [l1, l2, l3] = hero.headline

  return (
    <section className="container-site pt-3 pb-10 md:grid md:grid-cols-[1.1fr_1fr] md:items-center md:gap-10 md:pt-16 md:pb-24">
      <div className="relative h-[calc(100svh-8.25rem)] min-h-[34rem] overflow-hidden rounded-[2rem] md:order-last md:mx-auto md:h-auto md:min-h-0 md:w-full md:max-w-lg md:overflow-visible md:rounded-none">
        <div className="absolute inset-0 overflow-hidden bg-card md:relative md:aspect-[3/4] md:rounded-[2.5rem]">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            priority
            sizes="(min-width: 768px) 45vw, 100vw"
            style={{ objectPosition: hero.image.position }}
            className="object-cover motion-safe:animate-hero-zoom md:motion-safe:animate-none"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/15 to-black/25 md:hidden" />
        </div>

        {/* Mobile overlay */}
        <div className="relative z-10 flex h-full flex-col justify-between p-5 text-white md:hidden">
          <div className="flex items-start justify-between gap-3">
            <span className={cn(GLASS_CHIP, "inline-flex items-center gap-1.5 px-3 py-2 whitespace-nowrap")}>
              <TagIcon className="size-4" /> Black Friday sale
            </span>
            {product.colors.length > 1 && (
              <Link
                href={productHref}
                aria-label={`The ${product.name} in ${product.colors.length} colors`}
                className={cn(GLASS_CHIP, "flex items-center gap-2 py-1.5 ps-1.5 pe-3 whitespace-nowrap")}
              >
                <span className="flex -space-x-2">
                  {product.colors.slice(0, 4).map((c) => (
                    <span key={c.id} className="size-6 rounded-full border-2 border-white" style={{ background: c.swatch }} />
                  ))}
                </span>
                <span className="max-[400px]:hidden">{product.colors.length} colors</span>
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <Link href={productHref} className={cn(GLASS_CHIP, "motion-safe:animate-rise w-fit px-4 py-2 text-base")}>
              {product.name} · {formatPrice(product.price)}
            </Link>
            <h1 className="motion-safe:animate-rise text-[19vw] leading-[0.82] font-black tracking-[-0.05em] [animation-delay:80ms]">
              {l1}
              <br />
              {l2}
              <br />
              <span className="text-white/70">{l3}</span>
            </h1>
            <p className="motion-safe:animate-rise max-w-xs text-lg leading-snug text-white/85 [animation-delay:160ms]">{hero.sub}</p>
            <div className="motion-safe:animate-rise flex gap-3 [animation-delay:240ms]">
              <Link href={hero.cta.href} className={cn(buttonVariants({ variant: "glass", size: "lg" }), "flex-1 bg-white/25")}>
                {hero.cta.label} <ArrowUpRightIcon />
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop floating card */}
        <Link
          href={`/products/${other.slug}`}
          className="absolute -bottom-6 -start-10 hidden items-center gap-4 rounded-3xl border border-border bg-card/95 p-3 pe-6 shadow-xl backdrop-blur transition-transform hover:-translate-y-1 md:flex"
        >
          <span className="relative size-20 overflow-hidden rounded-2xl">
            <Image src={other.images[0].src} alt="" fill sizes="80px" className="object-cover" />
          </span>
          <span className="flex flex-col">
            <span className="text-sm text-muted-foreground">New in store</span>
            <span className="text-lg font-bold">{other.name}</span>
            <span className="font-black">{formatPrice(other.price)}</span>
          </span>
        </Link>
      </div>

      <div className="hidden flex-col gap-8 md:flex">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-eyebrow">
          <TagIcon className="size-4" /> Black Friday · up to 30% off
        </span>
        <h1 className="text-display-xl">
          {l1}
          <br />
          {l2}
          <br />
          <span className="text-muted-foreground">{l3}</span>
        </h1>
        <p className="max-w-md text-xl leading-relaxed text-muted-foreground">{hero.subDesktop}</p>
        <div className="flex flex-wrap gap-3">
          <Link href={hero.cta.href} className={buttonVariants({ size: "lg" })}>
            {hero.cta.label} <ArrowUpRightIcon />
          </Link>
          <Link href="#why" className={buttonVariants({ size: "lg", variant: "outline" })}>
            Why acrylic?
          </Link>
        </div>
      </div>
    </section>
  )
}
