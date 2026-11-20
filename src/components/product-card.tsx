import Image from "next/image"
import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import type { Product } from "@/lib/products"
import { Price } from "@/components/price"

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col gap-5">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-card">
        <Image
          src={product.cardImage.src}
          alt={product.cardImage.alt}
          fill
          priority={priority}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute top-5 start-5 rounded-full border border-white/60 bg-white/40 px-4 py-2 text-sm font-bold shadow-[inset_0_1px_0_rgb(255_255_255/0.8)] backdrop-blur-md">
          {product.colors.length > 1 ? `${product.colors.length} colors` : product.colors[0].name}
        </span>
        <span className="absolute bottom-5 end-5 grid size-14 place-items-center rounded-full border border-white/25 bg-foreground/70 text-background shadow-[inset_0_1px_0_rgb(255_255_255/0.3)] backdrop-blur-md transition-transform group-hover:-translate-y-1">
          <ArrowUpRightIcon className="size-6" />
        </span>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-display-sm">{product.name}</h3>
          <p className="text-lg text-muted-foreground">{product.tagline}</p>
        </div>
        <Price price={product.price} compareAt={product.compareAt} />
      </div>
    </Link>
  )
}
