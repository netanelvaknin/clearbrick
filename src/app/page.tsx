import Image from "next/image"
import Link from "next/link"
import { ArrowDownIcon, ArrowUpLeftIcon, LockIcon, MessageCircleIcon, PackageIcon, RotateCcwIcon, SparklesIcon, TruckIcon } from "lucide-react"
import { products, getProduct, formatPrice } from "@/lib/products"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ProductCard } from "@/components/product-card"
import { SectionHeading } from "@/components/section-heading"

const MARQUEE = ["משלוח חינם עד הבית", "אקריליק עבה ועמיד", "הרכבה קלה", "שירות לקוחות בוואטסאפ"]

const WHY = [
  { n: "01", title: "שקוף = מרווח", text: "רהיט שלא חוסם את האור ולא מעמיס על החדר. גם בדירה קטנה." },
  { n: "02", title: "עמיד באמת", text: "אקריליק עבה שמחזיק ספרים, צמחים ואת כל מה שתשימו עליו." },
  { n: "03", title: "צבע רק איפה שצריך", text: "ורוד, כחול, ענבר או שקוף לגמרי. הרהיט הוא נקודת הצבע של החדר." },
  { n: "04", title: "אפס תחזוקה", text: "מטלית לחה וזהו. בלי שמנים, בלי ליטושים, בלי כאב ראש." },
]

const VALUES = [
  { icon: PackageIcon, title: "נארז בקפדנות", text: "כל רהיט נבדק ונארז ביד, עם שכבות הגנה בכל פינה, כדי שיגיע אליכם מושלם ובלי שריטה." },
  { icon: MessageCircleIcon, title: "מדברים איתכם", text: "שאלה על מידה, צבע או משלוח? כתבו לנו בוואטסאפ ותקבלו תשובה מבן אדם." },
  { icon: RotateCcwIcon, title: "עומדים מאחורי כל רהיט", text: "14 יום להחזרה, כי אנחנו בטוחים במה שאנחנו שולחים." },
]

const STEPS = [
  { icon: LockIcon, title: "מזמינים באתר", text: "בוחרים רהיט וצבע, ומשלמים בתשלום מאובטח ומוצפן." },
  { icon: TruckIcon, title: "מקבלים עד הבית", text: "משלוח חינם עד הדלת, ארוז היטב ומוכן להרכבה קלה." },
  { icon: RotateCcwIcon, title: "14 יום להתאהב", text: "לא מתאים לחדר? כתבו לנו ונסדר החזרה בלי כאב ראש." },
]

const FAQ = [
  { q: "אקריליק זה כמו פלסטיק?", a: "אקריליק הוא חומר שקוף כמו זכוכית, אבל קל וחזק ממנה בהרבה ולא מתנפץ. בגלל זה הוא מושלם לרהיטים, גם בבית עם ילדים." },
  { q: "איך מנקים?", a: "מטלית מיקרופייבר רכה ומעט מים או סבון עדין. לא מומלץ להשתמש בחומרים שוחקים או באלכוהול." },
  { q: "כמה משקל המדפים מחזיקים?", a: "כל קומה בספריית לונה מחזיקה בנוחות ספרים, עציצים ופריטי נוי. פשוט פזרו את המשקל לאורך המדף." },
  { q: "המשלוח באמת חינם?", a: "כן. משלוח עד הבית בחינם לכל הזמנה, בלי מינימום ובלי אותיות קטנות." },
  { q: "ואם זה לא מתאים לי?", a: "יש לכם 14 יום מרגע שהרהיט הגיע. לא התאהבתם? שלחו לנו הודעה ונסדר החזרה." },
  { q: "התשלום באתר מאובטח?", a: "כן. כל פרטי התשלום עוברים בחיבור מוצפן SSL ואנחנו לא שומרים את פרטי הכרטיס שלכם." },
  { q: "יש עוד צבעים בדרך?", a: "כן! אנחנו עובדים על גוונים חדשים. השאירו מייל בדף המוצר ותהיו הראשונים לשמוע." },
]

export default function Home() {
  const shelf = getProduct("arch-bookshelf")!
  const bedside = getProduct("bedside-table")!

  return (
    <>
      {/* Hero */}
      {/* Mobile: full-screen photo card with oversized type and glass controls. Desktop: split layout with shelf image. */}
      <section className="container-site pt-3 pb-10 md:grid md:grid-cols-[1.1fr_1fr] md:items-center md:gap-10 md:pt-16 md:pb-24">
        <div className="relative h-[calc(100svh-6rem)] min-h-[34rem] overflow-hidden rounded-[2rem] md:order-last md:mx-auto md:h-auto md:min-h-0 md:w-full md:max-w-lg md:overflow-visible md:rounded-none">
          <div className="absolute inset-0 overflow-hidden bg-card md:relative md:aspect-[3/4] md:rounded-[2.5rem]">
            <Image
              src={shelf.images[0].src}
              alt={shelf.images[0].alt}
              fill
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover motion-safe:animate-hero-zoom md:motion-safe:animate-none"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/15 to-black/25 md:hidden" />
          </div>

          {/* Mobile overlay */}
          <div className="relative z-10 flex h-full flex-col justify-between p-5 text-white md:hidden">
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold whitespace-nowrap backdrop-blur-md">
                <SparklesIcon className="size-4" /> קולקציה חדשה
              </span>
              <Link
                href="/products/arch-bookshelf"
                aria-label="4 צבעים לספריית לונה"
                className="flex items-center gap-2 rounded-full border border-white/25 bg-white/15 py-1.5 ps-1.5 pe-3 text-sm font-semibold whitespace-nowrap backdrop-blur-md"
              >
                <span className="flex -space-x-2 rtl:space-x-reverse">
                  {shelf.colors.map((c) => (
                    <span key={c.id} className="size-6 rounded-full border-2 border-white/80" style={{ background: c.swatch }} />
                  ))}
                </span>
                <span className="max-[380px]:hidden">4 צבעים</span>
              </Link>
            </div>

            <div className="flex flex-col gap-5">
              <Link
                href="/products/arch-bookshelf"
                className="motion-safe:animate-rise w-fit rounded-full border border-white/25 bg-white/15 px-4 py-2 text-base font-semibold backdrop-blur-md"
              >
                {shelf.name} · {formatPrice(shelf.price)}
              </Link>
              <h1 className="motion-safe:animate-rise text-[19vw] leading-[0.82] font-black tracking-[-0.05em] [animation-delay:80ms]">
                שקוף.
                <br />
                נקי.
                <br />
                <span className="text-white/70">שלך.</span>
              </h1>
              <p className="motion-safe:animate-rise max-w-xs text-lg leading-snug text-white/85 [animation-delay:160ms]">
                רהיטי אקריליק שנותנים לחדר לנשום.
              </p>
              <div className="motion-safe:animate-rise flex gap-3 [animation-delay:240ms]">
                <Link href="/products/arch-bookshelf" className={cn(buttonVariants({ size: "lg" }), "flex-1 bg-white text-black hover:bg-white/90")}>
                  לקולקציה <ArrowUpLeftIcon />
                </Link>
                <Link
                  href="#collection"
                  aria-label="גללו לקולקציה"
                  className="grid size-16 shrink-0 place-items-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md"
                >
                  <ArrowDownIcon className="size-6 motion-safe:animate-bounce" />
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop floating card */}
          <Link
            href={`/products/${bedside.slug}`}
            className="absolute -bottom-6 -start-10 hidden items-center gap-4 rounded-3xl border border-border bg-card/95 p-3 pe-6 shadow-xl backdrop-blur transition-transform hover:-translate-y-1 md:flex"
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

        <div className="hidden flex-col gap-8 md:flex">
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
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-border bg-foreground py-5 text-background" aria-hidden>
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap text-2xl font-bold">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="flex items-center gap-12">
              {m} <span className="opacity-40">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Collection */}
      <section id="collection" className="container-site flex scroll-mt-28 flex-col gap-12 py-20 md:py-28">
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
            ספריית לונה מגיעה בארבעה גוונים. בחרו את זה שמתאים לחדר, או לכם.
          </SectionHeading>
          <div className="flex items-end justify-start gap-3 md:justify-end md:gap-4">
            {shelf.colors.map((c, i) => (
              <Link
                key={c.id}
                href={`/products/arch-bookshelf?color=${c.id}`}
                className="group flex flex-col items-center gap-3"
              >
                <span
                  className="block w-16 rounded-md border border-foreground/10 transition-transform group-hover:-translate-y-2 md:w-24"
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
          <Image src="/products/duo-living.jpg" alt="ספריית לונה הוורודה ושידת הלילה בגוון ענבר בסלון מואר" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3 rounded-3xl bg-background/90 p-6 backdrop-blur md:inset-x-auto md:start-8 md:bottom-8 md:max-w-md md:p-8">
            <h2 className="text-display-sm">שני רהיטים, חדר אחד, הרבה אור.</h2>
            <p className="text-lg text-muted-foreground">שקופים מספיק כדי שהחדר ימשיך לנשום, צבעוניים מספיק כדי שישימו לב.</p>
          </div>
        </div>
      </section>

      {/* Why acrylic */}
      <section id="why" className="container-site flex scroll-mt-28 flex-col gap-12 py-20 md:py-28">
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

      {/* About */}
      <section id="about" className="bg-card py-20 md:py-28 scroll-mt-28">
        <div className="container-site grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] md:order-last">
            <Image src="/about-plans.jpg" alt="שולחן העבודה שלנו: שרטוטים של ספריית לונה ודוגמאות אקריליק בצבעים" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col gap-10">
            <SectionHeading eyebrow="הסיפור שלנו" title="התחלנו מחדר שהיה צריך יותר אור.">
              clearbrick התחיל מדירה קטנה ששום רהיט לא התאים לה. כל מדף העמיס, כל שידה חסמה את האור. אז עיצבנו רהיטים שעושים את העבודה בלי לתפוס מקום בעין: שקופים, נקיים, עם צבע רק איפה שבא לכם.
            </SectionHeading>
            <ul className="flex flex-col gap-6">
              {VALUES.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-background">
                    <Icon className="size-5" />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-xl font-bold">{title}</span>
                    <span className="text-lg leading-relaxed text-muted-foreground">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Lifestyle bento */}
      <section className="container-site flex flex-col gap-12 py-20 md:py-28">
        <SectionHeading eyebrow="אצלכם בבית" title="נראה טוב בכל פינה." />
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr] md:grid-rows-2">
          <Tile src="/lifestyle-pink-close.jpg" alt="אישה מסדרת עציץ על ספריית לונה הוורודה בסלון" label="ורוד בסלון" href="/products/arch-bookshelf?color=pink" className="aspect-[4/5] md:row-span-2 md:aspect-auto" />
          <Tile src={shelf.images[2].src} alt={shelf.images[2].alt} label="מעושן בחדר השינה" href="/products/arch-bookshelf?color=smoke" className="aspect-square md:col-span-2 md:aspect-[2/1]" />
          <Tile src="/lifestyle-blue-close.jpg" alt="הורה וילד מסדרים ספרים בספריית לונה הכחולה" label="כחול בחדר הילדים" href="/products/arch-bookshelf?color=blue" className="aspect-square" />
          <Tile src="/products/bedside-detail.jpg" alt="יד מניחה כוס מים על שידת הלילה ליד המיטה" label="ענבר לפני השינה" href="/products/bedside-table" className="aspect-square" />
        </div>
      </section>

      {/* How it works */}
      <section className="container-site flex flex-col gap-12 pb-20 md:pb-28">
        <SectionHeading eyebrow="איך זה עובד" title="שלושה צעדים ורהיט חדש בבית." />
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="flex flex-col gap-6 rounded-[2rem] border border-border p-8">
              <div className="flex items-center justify-between">
                <span className="grid size-14 place-items-center rounded-full bg-foreground text-background">
                  <Icon className="size-6" />
                </span>
                <span className="text-5xl font-black text-muted-foreground/30">{i + 1}</span>
              </div>
              <h3 className="text-2xl font-extrabold">{title}</h3>
              <p className="text-lg leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="bg-card py-20 md:py-28">
        <div className="container-site grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="שאלות" title="יש שאלות?" />
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
        <div className="relative isolate flex min-h-96 flex-col items-start justify-end gap-8 overflow-hidden rounded-[2.5rem] bg-card p-10 md:flex-row md:items-end md:justify-between md:p-16">
          <Image src="/cta-light.jpg" alt="" fill sizes="(min-width: 1280px) 1280px, 100vw" className="-z-10 object-cover object-[30%_45%]" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-card/90 via-card/50 to-transparent md:bg-linear-to-l md:from-card/80 md:via-card/30" />
          <h2 className="text-display-lg max-w-3xl text-balance">החדר שלכם מחכה לקצת שקיפות.</h2>
          <Link href="/products/arch-bookshelf" className={buttonVariants({ size: "lg" })}>
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
