import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/products"

export function Price({ price, compareAt, large }: { price: number; compareAt?: number; large?: boolean }) {
  return (
    <div className="flex shrink-0 flex-col items-end">
      <span className={cn("font-black tracking-tight", large ? "text-4xl md:text-5xl" : "text-2xl")}>
        {formatPrice(price)}
      </span>
      {compareAt && (
        <span className={cn("text-muted-foreground line-through", large ? "text-xl" : "text-base")}>
          {formatPrice(compareAt)}
        </span>
      )}
    </div>
  )
}
