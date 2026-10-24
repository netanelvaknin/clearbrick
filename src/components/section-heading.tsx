import { cn } from "@/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  className,
  children,
}: {
  eyebrow?: string
  title: React.ReactNode
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {eyebrow && <span className="text-eyebrow text-muted-foreground">{eyebrow}</span>}
      <h2 className="text-display-lg text-balance">{title}</h2>
      {children && <p className="max-w-2xl text-xl leading-relaxed text-muted-foreground">{children}</p>}
    </div>
  )
}
