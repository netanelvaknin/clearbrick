"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"
import type { Product } from "@/lib/products"

/** Full-screen, swipeable (endless loop) view of the product images. */
export function GalleryLightbox({
  images,
  open,
  index,
  onOpenChange,
  onIndexChange,
}: {
  images: Product["images"]
  open: boolean
  index: number
  onOpenChange: (open: boolean) => void
  onIndexChange: (i: number) => void
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Popup className="fixed inset-0 z-50 flex flex-col bg-background outline-none data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0">
          <DialogPrimitive.Title className="sr-only">תמונות המוצר</DialogPrimitive.Title>
          {open && <Slides images={images} start={index} onIndexChange={onIndexChange} />}
          <DialogPrimitive.Close
            aria-label="סגירה"
            className="absolute top-4 end-4 flex size-11 items-center justify-center rounded-full bg-foreground text-background shadow-lg"
          >
            <XIcon className="size-5" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

function Slides({ images, start, onIndexChange }: { images: Product["images"]; start: number; onIndexChange: (i: number) => void }) {
  const [zoomed, setZoomed] = useState(false)
  const [viewport, embla] = useEmblaCarousel({ loop: true, direction: "rtl", startIndex: start, watchDrag: !zoomed })
  const [current, setCurrent] = useState(start)
  const scroller = useRef<HTMLDivElement>(null)
  const focus = useRef({ x: 0.5, y: 0.5 })
  // Double-tap: zoom 2.5× into the tapped point (scroll/pan to explore), tap again to zoom out.
  // Own double-tap detection: mobile browsers don't reliably fire dblclick inside a swipe track.
  const lastTap = useRef(0)
  const onTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = e.timeStamp
    if (now - lastTap.current < 320) {
      lastTap.current = 0
      toggleZoom(e)
    } else lastTap.current = now
  }
  const toggleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    focus.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
    setZoomed((z) => !z)
  }
  useLayoutEffect(() => {
    const el = scroller.current
    if (!zoomed || !el) return
    el.scrollLeft = focus.current.x * el.scrollWidth - el.clientWidth / 2
    el.scrollTop = focus.current.y * el.scrollHeight - el.clientHeight / 2
  }, [zoomed])
  useEffect(() => {
    if (!embla) return
    const onSelect = () => {
      const i = embla.selectedScrollSnap()
      setCurrent(i)
      setZoomed(false)
      onIndexChange(i)
    }
    embla.on("select", onSelect)
    return () => {
      embla.off("select", onSelect)
    }
  }, [embla, onIndexChange])

  return (
    <>
      <div ref={viewport} dir="rtl" className="min-h-0 flex-1 overflow-hidden">
        <div className="flex h-full touch-pan-y">
          {images.map((img, i) => {
            const z = zoomed && i === current
            return (
              <div
                key={img.src}
                ref={z ? scroller : undefined}
                onClick={onTap}
                className={cn("relative h-full min-w-0 shrink-0 grow-0 basis-full", z ? "overflow-auto" : "overflow-hidden cursor-zoom-in")}
              >
                <div className={cn("relative", z ? "h-[250%] w-[250%] cursor-zoom-out" : "h-full w-full")}>
                  <Image src={img.src} alt={img.alt} fill sizes={z ? "250vw" : "100vw"} quality={90} className="object-contain" draggable={false} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <p className="flex justify-center gap-3 pb-8 pt-3 text-sm font-bold text-muted-foreground">
        {zoomed ? "הקשה כפולה להקטנה" : "הקשה כפולה להגדלה"}
        <span className="tabular-nums" dir="ltr">
          {current + 1} / {images.length}
        </span>
      </p>
    </>
  )
}
