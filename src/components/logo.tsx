// Wordmark: a tiny arch (the brand's signature shape) + "clearbrick".
export function Logo({ className }: { className?: string }) {
  return (
    <span dir="ltr" className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <svg viewBox="0 0 24 28" className="h-7 w-6" aria-hidden>
        <path d="M2 27V12a10 10 0 0 1 20 0v15Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M2 18h20" stroke="currentColor" strokeWidth="2.5" />
      </svg>
      <span className="text-2xl font-black tracking-tight">clearbrick</span>
    </span>
  )
}
