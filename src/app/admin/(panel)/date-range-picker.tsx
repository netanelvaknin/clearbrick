"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { he } from "date-fns/locale/he"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Custom range: pick a start and end day, then apply. Limited to what Vercel keeps on Pro (min = 12 months back).
export function DateRangePicker({ path, from, to, min, max, active }: { path: string; from: string; to: string; min: string; max: string; active: boolean }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState<DateRange | undefined>({ from: parseISO(from), to: parseISO(to) })
  const wide = useWide()

  const label = `${format(parseISO(from), "d.M.yy")} – ${format(parseISO(to), "d.M.yy")}`
  const apply = () => {
    if (!range?.from) return
    const end = range.to ?? range.from
    router.push(`${path}?from=${format(range.from, "yyyy-MM-dd")}&to=${format(end, "yyyy-MM-dd")}`)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={`flex h-10 w-full items-center justify-center gap-2 rounded-full border px-4 text-sm tabular-nums sm:w-auto ${active ? "border-foreground bg-foreground text-background" : "border-border"}`}
      >
        <CalendarIcon className="size-4" />
        {active ? label : "טווח מותאם"}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto max-w-[calc(100vw-2rem)] p-2">
        <Calendar
          mode="range"
          dir="rtl"
          locale={he}
          numberOfMonths={wide ? 2 : 1}
          defaultMonth={range?.from}
          selected={range}
          onSelect={setRange}
          disabled={{ before: parseISO(min), after: parseISO(max) }}
          startMonth={parseISO(min)}
          endMonth={parseISO(max)}
          className="[--cell-size:--spacing(10)] sm:[--cell-size:--spacing(8)]"
        />
        <div className="flex items-center justify-between gap-2 border-t border-border px-1 pt-2">
          <span className="text-xs text-muted-foreground tabular-nums">
            {range?.from ? `${format(range.from, "d.M.yy")} – ${range.to ? format(range.to, "d.M.yy") : "…"}` : "בחרו תאריך התחלה"}
          </span>
          <button onClick={apply} disabled={!range?.from} className="h-9 rounded-full bg-foreground px-5 text-sm text-background disabled:opacity-40">
            הצג
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Two months side by side only when there's room.
function useWide() {
  const [wide, setWide] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)")
    const update = () => setWide(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return wide
}
