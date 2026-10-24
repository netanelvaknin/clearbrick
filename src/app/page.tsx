import Image from "next/image"
import Link from "next/link"
import { ArrowUpLeftIcon, SparklesIcon } from "lucide-react"
import { products, getProduct, formatPrice } from "@/lib/products"
import { buttonVariants } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ProductCard } from "@/components/product-card"
import { SectionHeading } from "@/components/section-heading"

const MARQUEE = ["אקריליק עבה ועמיד", "שקוף, אז החדר נראה גדול יותר", "4 צבעים למדף הקשת", "מתאים לסלון, לחדר שינה ולחדר ילדים", "מנגבים במטלית וזהו"]

const WHY = [
  { n: "01", title: "שקוף = מרווח", text: "רהיט שלא חוסם את האור ולא מעמיס על החדר. גם בדירה קטנה." },
  { n: "02", title: "עמיד באמת", text: "אקריליק עבה שמחזיק ספרים, צמחים ואת כל מה שתשימו עליו." },
  { n: "03", title: "צבע רק איפה שצריך", text: "ורוד, כחול, ענבר או שקוף לגמרי. הרהיט הוא נקודת הצבע של החדר." },
  { n: "04", title: "אפס תחזוקה", text: "מטלית לחה וזהו. בלי שמנים, בלי ליטושים, בלי כאב ראש." },
]

const FAQ = [
  { q: "אקריליק זה כמו פלסטיק?", a: "אקריליק הוא חומר שקוף כמו זכוכית, אבל קל וחזק ממנה בהרבה ולא מתנפץ. בגלל זה הוא מושלם לרהיטים, גם בבית עם ילדים." },
  { q: "איך מנקים?", a: "מטלית מיקרופייבר רכה ומעט מים או סבון עדין. לא מומלץ להשתמש בחומרים שוחקים או באלכוהול." },
  { q: "כמה משקל המדפים מחזיקים?", a: "כל קומה במדף הקשת מחזיקה בנוחות ספרים, עציצים ופריטי נוי. פשוט פזרו את המשקל לאורך המדף." },
  { q: "יש עוד צבעים בדרך?", a: "כן! אנחנו עובדים על גוונים חדשים. השאירו מייל בדף המוצר ותהיו הראשונים לשמוע." },
]

export default function Home() {
  const arch = getProduct("arch-bookshelf")!
  const bedside = getProduct("bedside-table")!

  return (
    <>
      {/* Hero */}
      <section className="container-site grid items-center gap-10 pt-10 pb-16 md:grid-cols-[1.1fr_1fr] md:pt-16 md:pb-24">
        <div className="flex flex-col gap-8">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-eyebrow">
            <SparklesIcon className="size-4" /> קולקציית אקריליק חדשה
          </span>
          <h1 className="text-display-xl">
            שקוף.
            <br />
            נקי.
            <br />
            <span className="text-muted-foreground">שלך.</span>
          </h1>
          <p className="max-w-md text-xl leading-relaxed text-muted-foreground">
            רהיטי אקריליק שנותנים לחדר לנשום. עיצוב מינימליסטי, צבע רק איפה שבא לכם.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/products/arch-bookshelf" className={buttonVariants({ size: "lg" })}>
              לקולקציה <ArrowUpLeftIcon />
            </Link>
            <Link href="#why" className={buttonVariants({ size: "lg", variant: "outline" })}>
              למה אקריליק?
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-[2rem] bg-card">
            <Image src={arch.images[0].src} alt={arch.images[0].alt} fill priority sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
          </div>
          <Link
            href={`/products/${bedside.slug}`}
            className="absolute -bottom-6 start-0 flex items-center gap-4 rounded-3xl border border-border bg-card/95 p-3 pe-6 shadow-xl backdrop-blur transition-transform hover:-translate-y-1 md:-start-10"
          >
            <span className="relative size-20 overflow-hidden rounded-2xl">
              <Image src={bedside.images[0].src} alt="" fill sizes="80px" className="object-cover" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm text-muted-foreground">חדש בחנות</span>
              <span className="text-lg font-bold">{bedside.name}</span>
              <span className="font-black">{formatPrice(bedside.price)}</span>
            </span>
          </Link>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-border bg-foreground py-5 text-background" aria-hidden>
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap text-2xl font-bold">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="flex items-center gap-12">
              {m} <span className="opacity-40">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Collection */}
      <section id="collection" className="container-site flex flex-col gap-12 py-20 md:py-28">
        <SectionHeading eyebrow="הקולקציה" title="שני רהיטים. אינסוף סטייל." />
        <div className="grid gap-10 md:grid-cols-2 md:gap-8">
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i === 0} />
          ))}
        </div>
      </section>

      {/* Colors statement */}
      <section className="bg-card py-20 md:py-28">
        <div className="container-site grid items-end gap-12 md:grid-cols-2">
          <SectionHeading eyebrow="הצבעים" title={<>הצבע? הוא של הרהיט.<br />כל השאר שקוף.</>}>
            מדף הקשת מגיע בארבעה גוונים. בחרו את זה שמתאים לחדר, או לכם.
          </SectionHeading>
          <div className="flex items-end justify-start gap-3 md:justify-end md:gap-4">
            {arch.colors.map((c, i) => (
              <Link
                key={c.id}
                href={`/products/arch-bookshelf?color=${c.id}`}
                className="group flex flex-col items-center gap-3"
              >
                <span
                  className="block w-16 rounded-t-full border border-foreground/10 transition-transform group-hover:-translate-y-2 md:w-24"
                  style={{ background: c.swatch, height: `${9 + i * 1.5}rem`, opacity: c.id === "clear" ? 1 : 0.85 }}
                />
                <span className="text-base font-semibold">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Duo editorial */}
      <section className="container-site pt-20 md:pt-28">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] sm:aspect-[16/9]">
          <Image src="/products/duo-living.jpg" alt="מדף הקשת הוורוד ושידת הלילה בגוון ענבר בסלון מואר" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3 rounded-3xl bg-background/90 p-6 backdrop-blur md:inset-x-auto md:start-8 md:bottom-8 md:max-w-md md:p-8">
            <h2 className="text-display-sm">שני רהיטים, חדר אחד, הרבה אור.</h2>
            <p className="text-lg text-muted-foreground">שקופים מספיק כדי שהחדר ימשיך לנשום, צבעוניים מספיק כדי שישימו לב.</p>
          </div>
        </div>
      </section>

      {/* Why acrylic */}
      <section id="why" className="container-site flex scroll-mt-24 flex-col gap-12 py-20 md:py-28">
        <SectionHeading eyebrow="למה אקריליק" title="קל לאהוב. קשה לשבור." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w) => (
            <div key={w.n} className="flex flex-col gap-6 rounded-[2rem] border border-border bg-card p-8">
              <span className="text-5xl font-black text-muted-foreground/40">{w.n}</span>
              <h3 className="text-2xl font-extrabold">{w.title}</h3>
              <p className="text-lg leading-relaxed text-muted-foreground">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lifestyle bento */}
      <section className="container-site flex flex-col gap-12 pb-20 md:pb-28">
        <SectionHeading eyebrow="אצלכם בבית" title="נראה טוב בכל פינה." />
        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
          <Tile src={bedside.images[0].src} alt={bedside.images[0].alt} label="שידת הלילה ליד הספה" href="/products/bedside-table" className="aspect-[4/5] md:row-span-2 md:aspect-auto" />
          <Tile src={arch.images[2].src} alt={arch.images[2].alt} label="מעושן בחדר השינה" href="/products/arch-bookshelf?color=smoke" className="aspect-square md:col-span-2 md:aspect-[2/1]" />
          <Tile src={arch.images[3].src} alt={arch.images[3].alt} label="כחול בחדר הילדים" href="/products/arch-bookshelf?color=blue" className="aspect-square" />
          <Tile src={bedside.images[2].src} alt={bedside.images[2].alt} label="ענבר לפני השינה" href="/products/bedside-table" className="aspect-square" />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-card py-20 md:py-28">
        <div className="container-site grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="שאלות" title="יש שאלות? יש תשובות." />
          <Accordion className="border-t border-border">
            {FAQ.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-b border-border">
                <AccordionTrigger className="text-xl">{f.q}</AccordionTrigger>
                <AccordionContent className="text-lg">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="container-site py-20 md:py-28">
        <div className="flex flex-col items-start gap-8 rounded-[2.5rem] bg-foreground p-10 text-background md:flex-row md:items-end md:justify-between md:p-16">
          <h2 className="text-display-lg max-w-3xl text-balance">החדר שלכם מחכה לקצת שקיפות.</h2>
          <Link href="/products/arch-bookshelf" className={buttonVariants({ size: "lg", variant: "secondary" })}>
            לחנות <ArrowUpLeftIcon />
          </Link>
        </div>
      </section>
    </>
  )
}

function Tile({ src, alt, label, href, className }: { src: string; alt: string; label: string; href: string; className?: string }) {
  return (
    <Link href={href} className={`group relative overflow-hidden rounded-[2rem] bg-card ${className}`}>
      <Image src={src} alt={alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
      <span className="absolute bottom-4 start-4 rounded-full bg-background/90 px-4 py-2 text-base font-bold backdrop-blur">{label}</span>
    </Link>
  )
}
