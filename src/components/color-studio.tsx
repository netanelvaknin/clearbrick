"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import type { Product } from "@/lib/products"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// Homepage colors section: tap a glass chip and the same shelf, in the same room, changes color.
// Pink leads here (first chip + default) to match the hero; the product page keeps its own order.
export function ColorStudio({ product }: { product: Product }) {
  const colors = [...product.colors].sort((a, b) => Number(b.id === "pink") - Number(a.id === "pink"))
  const [color, setColor] = useState(colors[0])

  return (
    <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-card text-white">
      <div className="relative aspect-[3/4] sm:aspect-[16/10] lg:aspect-[16/8]">
        {colors.map((c) => {
          const img = product.images[c.image]
          return (
            <Image
              key={c.id}
              src={img.src}
              alt={c.id === color.id ? img.alt : ""}
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              className={cn("object-cover object-[50%_40%] transition-opacity duration-500", c.id === color.id ? "opacity-100" : "opacity-0")}
            />
          )
        })}
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-black/30" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-between gap-6 p-5 md:p-10">
        <div className="flex max-w-xl flex-col gap-3">
          <span className="text-eyebrow w-fit rounded-full border border-white/25 bg-white/15 px-3 py-1 backdrop-blur-md">The colors</span>
          <h2 className="text-display-md text-balance drop-shadow-sm">
            The color? That’s the furniture.
            <br />
            Everything else is clear.
          </h2>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div role="radiogroup" aria-label="Luna Bookshelf color" className="flex flex-wrap gap-2">
            {colors.map((c) => {
              const on = c.id === color.id
              return (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setColor(c)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border py-1.5 ps-1.5 pe-4 text-base font-semibold backdrop-blur-md transition",
                    on ? "border-white/70 bg-white/35 shadow-[inset_0_1px_0_rgb(255_255_255/0.6)]" : "border-white/25 bg-white/15 hover:bg-white/25"
                  )}
                >
                  <span className="size-7 rounded-full border-2 border-white/80" style={{ background: c.swatch }} />
                  {c.name}
                </button>
              )
            })}
          </div>
          <Link href={`/products/${product.slug}?color=${color.id}`} className={cn(buttonVariants({ size: "lg" }), "w-full md:w-auto")}>
            {product.name} in {color.name} <ArrowUpRightIcon />
          </Link>
        </div>
      </div>
    </div>
  )
}
