"use client"

import { useState } from "react"
import Image from "next/image"
import { CheckIcon } from "lucide-react"
import type { Product } from "@/lib/products"
import { cn } from "@/lib/utils"
import { Price } from "@/components/price"
import { BuyButtons } from "@/components/notify-dialog"
import { SecureNote, TrustBadges } from "@/components/trust-badges"
import { useProductEngagement } from "@/lib/pixel"

export function ProductView({ product, initialColor }: { product: Product; initialColor?: string }) {
  const start = product.colors.find((c) => c.id === initialColor) ?? product.colors[0]
  const [color, setColor] = useState(start)
  const [active, setActive] = useState(start.image)
  const interact = useProductEngagement(product)

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
      {/* Gallery */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-32 lg:self-start">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-card">
          {product.images.map((img, i) => (
            <Image
              key={img.src}
              src={img.src}
              alt={img.alt}
              fill
              priority={i === start.image}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className={cn("object-cover transition-opacity duration-500", i === active ? "opacity-100" : "opacity-0")}
            />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {product.images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => {
                setActive(i)
                interact("gallery", String(i + 1))
              }}
              aria-label={`תמונה ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "relative aspect-square overflow-hidden rounded-2xl border-2 bg-card transition",
                i === active ? "border-foreground" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img.src} alt="" fill sizes="150px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Buy box */}
      <div className="flex flex-col gap-8 rounded-[2rem] border border-border bg-card p-6 md:p-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {product.compareAt && (
              <span className="rounded-full bg-foreground px-3 py-1 text-sm font-bold text-background">
                {Math.round((1 - product.price / product.compareAt) * 100)}% הנחת השקה
              </span>
            )}
            <span className="rounded-full bg-muted px-3 py-1 text-sm font-bold">אקריליק</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-display-md">{product.name}</h1>
            <Price price={product.price} compareAt={product.compareAt} large />
          </div>
          <p className="text-xl leading-relaxed text-muted-foreground">{product.tagline}</p>
        </div>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-4 text-lg font-bold">
            צבע: <span className="font-normal text-muted-foreground">{color.name}</span>
          </legend>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((c) => (
              <label key={c.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="color"
                  value={c.id}
                  checked={c.id === color.id}
                  onChange={() => {
                    setColor(c)
                    setActive(c.image)
                    interact("color", c.name)
                  }}
                  className="peer sr-only"
                />
                <span className="flex h-14 items-center gap-3 rounded-full border-2 border-border bg-background ps-2 pe-5 text-base font-semibold transition peer-checked:border-foreground peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50">
                  <span className="grid size-10 place-items-center rounded-full border border-foreground/10" style={{ background: c.swatch }}>
                    {c.id === color.id && <CheckIcon className={cn("size-5", c.id === "clear" ? "text-foreground" : "text-white")} />}
                  </span>
                  {c.name}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <BuyButtons
          ctx={{ product: product.name, color: color.name, price: product.price }}
          className="grid gap-3"
        />
        <div className="-mt-4 flex flex-col gap-4">
          <SecureNote />
          <TrustBadges />
        </div>

        <ul className="grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
          {product.features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-lg">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted">
                <CheckIcon className="size-4" />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
