import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProduct, products } from "@/lib/products"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ProductView } from "@/components/product-view"
import { ProductCard } from "@/components/product-card"
import { SectionHeading } from "@/components/section-heading"

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.tagline,
    openGraph: { images: [product.images[0].src] },
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
        <div className="container-site flex flex-col gap-8 py-8 md:py-12">
          <nav aria-label="פירורי לחם" className="flex items-center gap-2 text-base text-muted-foreground">
            <Link href="/" className="hover:text-foreground">ראשי</Link>
            <span>/</span>
            <Link href="/#collection" className="hover:text-foreground">הקולקציה</Link>
            <span>/</span>
            <span className="font-semibold text-foreground">{product.name}</span>
          </nav>

          <Suspense fallback={<ProductView product={product} />}>
            <ProductViewWithColor product={product} searchParams={searchParams} />
          </Suspense>

          {/* Spec chips */}
          <ul className="flex flex-wrap justify-center gap-3">
            {product.specs.map((s) => (
              <li key={s.label} className="rounded-2xl border border-border bg-card px-5 py-3 text-lg">
                <span className="text-muted-foreground">{s.label}</span> <span className="font-bold">{s.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="container-site grid gap-12 py-20 md:grid-cols-[1fr_1.4fr]">
        <SectionHeading eyebrow="על המוצר" title="כל מה שצריך לדעת." />
        <Accordion defaultValue={["desc"]} className="border-t border-border">
          <AccordionItem value="desc" className="border-b border-border">
            <AccordionTrigger className="text-xl">תיאור</AccordionTrigger>
            <AccordionContent className="text-lg">{product.description}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="specs" className="border-b border-border">
            <AccordionTrigger className="text-xl">מפרט ומידות</AccordionTrigger>
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
            <AccordionTrigger className="text-xl">ניקוי ותחזוקה</AccordionTrigger>
            <AccordionContent className="text-lg">
              מטלית מיקרופייבר רכה עם מעט מים או סבון עדין. לא להשתמש בחומרים שוחקים או באלכוהול כדי לשמור על השקיפות.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="questions" className="border-b border-border">
            <AccordionTrigger className="text-xl">שאלות נוספות</AccordionTrigger>
            <AccordionContent className="text-lg">
              יש לכם שאלה על המוצר? <Link href="/contact">כתבו לנו</Link> ונחזור אליכם מהר.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="container-site flex flex-col gap-12 pb-20 md:pb-28">
        <SectionHeading eyebrow="עוד מהקולקציה" title="משלים את הלוק." />
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
