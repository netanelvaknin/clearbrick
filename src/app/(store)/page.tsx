import Image from "next/image"
import Link from "next/link"
import { ArrowUpRightIcon, HeartHandshakeIcon, MessageCircleIcon, PackageIcon, SparklesIcon } from "lucide-react"
import { products, getProduct, formatPrice } from "@/lib/products"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ProductCard } from "@/components/product-card"
import { SectionHeading } from "@/components/section-heading"
import { ColorStudio } from "@/components/color-studio"

const MARQUEE = ["Black Friday: up to 30% off", "Free shipping, always", "Shatter-resistant acrylic", "Easy assembly", "Easy 14-day returns"]

const WHY = [
  { n: "01", title: "Rooms look bigger", text: "Light passes right through, so even a studio apartment feels open and bright.", img: "/products/luna-bedroom-clear.jpg", alt: "The Luna bookshelf in clear, in the corner of a bedroom" },
  { n: "02", title: "Seriously sturdy", text: "Thick 5/16\" acrylic that holds your books, plants and everything else you love.", img: "/why/strong-wide.jpg", alt: "Hands placing a stack of heavy art books on a smoke gray acrylic shelf" },
  { n: "03", title: "A pop of color, not a wall of it", text: "Pink, blue, amber or crystal clear. Let one piece be the statement.", img: "/why/color.jpg", alt: "The pink Luna bookshelf in a bright, clean living room" },
  { n: "04", title: "Zero upkeep", text: "Wipe with a damp cloth. That's it. No polish, no oils, no fuss.", img: "/why/care.jpg", alt: "A hand wiping the amber nightstand with a cloth" },
]

const VALUES = [
  { icon: PackageIcon, title: "Packed with care", text: "Every piece is checked and packed by hand, with protection on every corner, so it arrives perfect and scratch-free." },
  { icon: MessageCircleIcon, title: "Real people, real answers", text: "Questions about size, color or shipping? Message us and a real person answers. No bots, no ticket numbers." },
  { icon: HeartHandshakeIcon, title: "We stand behind every piece", text: "Easy 14-day returns, because we're confident in what we ship." },
]

const FAQ = [
  { q: "Is acrylic the same as Lucite?", a: "Same material. Lucite is a brand name for acrylic, the crystal-clear material behind iconic mid-century designer pieces. It's as clear as glass but much lighter and far more shatter-resistant, so it's a great fit for homes with kids and pets." },
  { q: "How do I clean it?", a: "A soft microfiber cloth with a little water or mild soap. Avoid abrasive cleaners and alcohol." },
  { q: "How much weight do the shelves hold?", a: "Each Luna tier comfortably holds a full row of books, plants and decor. Just spread heavier items along the shelf." },
  { q: "Is shipping really free?", a: "Yes. Free shipping on every order to anywhere in the contiguous US. No minimum, no fine print." },
  { q: "What if it's not right for me?", a: "You have 14 days from delivery. Not in love? Send us a message and we'll set up your return." },
  { q: "Is checkout secure?", a: "Yes. Checkout runs over an encrypted SSL connection, and we never store your card details." },
  { q: "Are more colors coming?", a: "Yes! New shades are in the works. Leave your email on any product page and you'll be the first to know." },
]

export default function Home() {
  const shelf = getProduct("arch-bookshelf")!
  const imageOf = (color: string) => shelf.images[shelf.colors.find((c) => c.id === color)!.image]
  const heroImage = imageOf("pink")
  const smokeImage = shelf.images.find((i) => i.src.includes("bedroom-smoke"))!
  const bedside = getProduct("bedside-table")!

  return (
    <>
      {/* Hero */}
      {/* Mobile: full-screen photo card with oversized type and glass controls. Desktop: split layout with shelf image. */}
      <section className="container-site pt-3 pb-10 md:grid md:grid-cols-[1.1fr_1fr] md:items-center md:gap-10 md:pt-16 md:pb-24">
        <div className="relative h-[calc(100svh-8.25rem)] min-h-[34rem] overflow-hidden rounded-[2rem] md:order-last md:mx-auto md:h-auto md:min-h-0 md:w-full md:max-w-lg md:overflow-visible md:rounded-none">
          <div className="absolute inset-0 overflow-hidden bg-card md:relative md:aspect-[3/4] md:rounded-[2.5rem]">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
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
                <SparklesIcon className="size-4" /> Black Friday sale
              </span>
              <Link
                href="/products/arch-bookshelf"
                aria-label="The Luna bookshelf in 4 colors"
                className="flex items-center gap-2 rounded-full border border-white/25 bg-white/15 py-1.5 ps-1.5 pe-3 text-sm font-semibold whitespace-nowrap backdrop-blur-md"
              >
                <span className="flex -space-x-2">
                  {shelf.colors.map((c) => (
                    <span key={c.id} className="size-6 rounded-full border-2 border-white/80" style={{ background: c.swatch }} />
                  ))}
                </span>
                <span className="max-[380px]:hidden">4 colors</span>
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
                Clear.
                <br />
                Clean.
                <br />
                <span className="text-white/70">Yours.</span>
              </h1>
              <p className="motion-safe:animate-rise max-w-xs text-lg leading-snug text-white/85 [animation-delay:160ms]">
                Acrylic furniture that makes small spaces feel big.
              </p>
              <div className="motion-safe:animate-rise flex gap-3 [animation-delay:240ms]">
                <Link href="/products/arch-bookshelf" className={cn(buttonVariants({ variant: "glass", size: "lg" }), "flex-1 bg-white/25")}>
                  Shop the collection <ArrowUpRightIcon />
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
              <span className="text-sm text-muted-foreground">New in store</span>
              <span className="text-lg font-bold">{bedside.name}</span>
              <span className="font-black">{formatPrice(bedside.price)}</span>
            </span>
          </Link>
        </div>

        <div className="hidden flex-col gap-8 md:flex">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-eyebrow">
            <SparklesIcon className="size-4" /> Black Friday · up to 30% off
          </span>
          <h1 className="text-display-xl">
            Clear.
            <br />
            Clean.
            <br />
            <span className="text-muted-foreground">Yours.</span>
          </h1>
          <p className="max-w-md text-xl leading-relaxed text-muted-foreground">
            See-through acrylic furniture that makes any room feel bigger and brighter. Minimal design, with color only where you want it.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/products/arch-bookshelf" className={buttonVariants({ size: "lg" })}>
              Shop the collection <ArrowUpRightIcon />
            </Link>
            <Link href="#why" className={buttonVariants({ size: "lg", variant: "outline" })}>
              Why acrylic?
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
      <section id="collection" className="container-site flex scroll-mt-36 flex-col gap-12 py-20 md:py-28">
        <SectionHeading eyebrow="The collection" title="Three pieces. Zero visual clutter." />
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i === 0} />
          ))}
        </div>
      </section>

      {/* Colors: tap a glass chip, the shelf changes color in place */}
      <section className="container-site pt-4 md:pt-8">
        <ColorStudio product={shelf} />
      </section>

      {/* Why acrylic */}
      <section id="why" className="container-site flex scroll-mt-36 flex-col gap-12 py-20 md:py-28">
        <SectionHeading eyebrow="Why acrylic" title="Easy to love. Hard to break." />
        {/* Mobile: swipeable gallery (native scroll-snap, peeking next card). Desktop: 4-up grid. */}
        <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {WHY.map((w) => (
            <li key={w.n} className="relative isolate flex aspect-[3/4] w-[78%] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-[2rem] bg-card p-6 text-white sm:w-auto">
              <Image src={w.img} alt={w.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 80vw" className="-z-10 scale-105 object-cover blur-[1.5px]" />
              {/* Light blur + tint: the photo sets the mood, the text carries the card. */}
              <div aria-hidden className="absolute inset-0 -z-10 bg-black/15 bg-linear-to-t from-black/65 via-black/15 to-transparent" />
              <span className="absolute top-5 start-5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-sm font-bold backdrop-blur-md">{w.n}</span>
              <h3 className="text-2xl font-extrabold">{w.title}</h3>
              <p className="mt-2 text-lg leading-snug text-white/85">{w.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* About */}
      <section id="about" className="bg-card py-20 md:py-28 scroll-mt-36">
        <div className="container-site grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] md:order-last">
            <Image src="/about-plans.jpg" alt="Our worktable: sketches of the Luna bookshelf and colored acrylic samples" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col gap-10">
            <SectionHeading eyebrow="Our story" title="It started with a room that needed more light.">
              clearbrick started in a small apartment where nothing fit. Every bookshelf felt bulky, every nightstand blocked the light. So we designed furniture that does the job without hogging the room: clear, clean, with color only where you want it.
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
        <SectionHeading eyebrow="Real rooms" title="Looks good wherever it lands." />
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr] md:grid-rows-2">
          <Tile src="/products/luna-detail-pink.jpg" alt="Close-up of the top two shelves of the pink Luna bookshelf" label="Pink in the living room" href="/products/arch-bookshelf?color=pink" className="aspect-[4/5] md:row-span-2 md:aspect-auto" />
          <Tile src={smokeImage.src} alt={smokeImage.alt} label="Smoke gray in the bedroom" href="/products/arch-bookshelf?color=smoke" className="aspect-square md:col-span-2 md:aspect-[2/1]" />
          <Tile src="/lifestyle-blue-kidsroom.jpg" alt="The blue Luna bookshelf in a kids' room, with children's books, a stuffed bunny, wooden blocks and a straw basket" label="Blue in the kids' room" href="/products/arch-bookshelf?color=blue" className="aspect-square" />
          <Tile src="/products/bedside-detail.jpg" alt="A hand setting a glass of water on the nightstand by the bed" label="The Laila nightstand by the bed" href="/products/bedside-table" className="aspect-square" />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-card py-20 md:py-28">
        <div className="container-site grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="FAQ" title="Got questions?" />
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
          <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-card/90 via-card/50 to-transparent md:bg-linear-to-r md:from-card/80 md:via-card/30" />
          <h2 className="text-display-lg max-w-3xl text-balance">Your room is ready for a little clarity.</h2>
          <Link href="/products/arch-bookshelf" className={buttonVariants({ size: "lg" })}>
            Shop now <ArrowUpRightIcon />
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
      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/45 to-transparent to-45%" />
      <span className="absolute bottom-4 start-4 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-base font-bold text-white backdrop-blur-md">{label}</span>
    </Link>
  )
}
