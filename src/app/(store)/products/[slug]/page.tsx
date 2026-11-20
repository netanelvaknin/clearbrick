import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProduct, products } from "@/lib/products"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ProductView } from "@/components/product-view"
import { LaunchCountdown } from "@/components/launch-countdown"
import { ProductCard } from "@/components/product-card"
import { SectionHeading } from "@/components/section-heading"
import { TrustSection } from "@/components/trust-badges"

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug)
  if (!product) return {}
  // openGraph here replaces the layout's, so repeat siteName/locale. Share images are 1200×630 for iMessage/Instagram/Facebook previews.
  const title = `${product.name} · $${product.price}`
  return {
    title: product.name,
    description: product.tagline,
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "clearbrick",
      url: `/products/${product.slug}`,
      title,
      description: product.tagline,
      images: [{ url: `/og/${product.slug}.jpg`, width: 1200, height: 630, alt: product.images[0].alt }],
    },
    twitter: { card: "summary_large_image", title, description: product.tagline },
  }
}

export default function ProductPage(props: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<div className="bg-dots min-h-screen" />}>
      <ProductContent {...props} />
    </Suspense>
  )
}

async function ProductContent({ params, searchParams }: PageProps<"/products/[slug]">) {
  const product = getProduct((await params).slug)
  if (!product) notFound()
  const others = products.filter((p) => p.slug !== product.slug)

  return (
    <>
      <div className="bg-dots">
        <div className="container-site flex flex-col gap-6 pt-4 pb-8 md:gap-8 md:py-10">
          <LaunchCountdown product={product} />

          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-base text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-foreground">Shop all</Link>
            <span>/</span>
            <span className="font-semibold text-foreground">{product.name}</span>
          </nav>

          <Suspense fallback={<ProductView product={product} />}>
            <ProductViewWithColor product={product} searchParams={searchParams} />
          </Suspense>

        </div>
      </div>

      <section className="container-site grid gap-12 py-20 md:grid-cols-[1fr_1.4fr]">
        <SectionHeading eyebrow="About the product" title="Everything you need to know." />
        <Accordion defaultValue={["desc"]} className="border-t border-border">
          <AccordionItem value="desc" className="border-b border-border">
            <AccordionTrigger className="text-xl">Description</AccordionTrigger>
            <AccordionContent className="text-lg">{product.description}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="specs" className="border-b border-border">
            <AccordionTrigger className="text-xl">Specs & dimensions</AccordionTrigger>
            <AccordionContent className="text-lg">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                {product.specs.map((s) => (
                  <div key={s.label} className="contents">
                    <dt>{s.label}</dt>
                    <dd className="font-bold text-foreground">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="care" className="border-b border-border">
            <AccordionTrigger className="text-xl">Cleaning & care</AccordionTrigger>
            <AccordionContent className="text-lg">
              A soft microfiber cloth with a little water or mild soap. Avoid abrasive cleaners and alcohol to keep it crystal clear.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="questions" className="border-b border-border">
            <AccordionTrigger className="text-xl">Still have questions?</AccordionTrigger>
            <AccordionContent className="text-lg">
              Have a question about this product? <Link href="/contact">Write to us</Link> and we’ll get back to you fast.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <TrustSection className="pt-0" />

      <section className="container-site flex flex-col gap-12 pb-20 md:pb-28">
        <SectionHeading eyebrow="More from the collection" title="Complete the look." />
        <div className="grid gap-8 md:grid-cols-2">
          {others.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  )
}

// ?color=... preselects a swatch (used by homepage links). Streams in after the static shell.
async function ProductViewWithColor({
  product,
  searchParams,
}: {
  product: NonNullable<ReturnType<typeof getProduct>>
  searchParams: PageProps<"/products/[slug]">["searchParams"]
}) {
  const { color } = await searchParams
  return <ProductView product={product} initialColor={typeof color === "string" ? color : undefined} />
}
