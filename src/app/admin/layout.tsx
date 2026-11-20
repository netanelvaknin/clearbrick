import type { Metadata } from "next"
import { Heebo } from "next/font/google"
import "../globals.css"

// Admin stays in Hebrew, and Geist has no Hebrew glyphs, so it keeps Heebo.
const heebo = Heebo({ subsets: ["hebrew", "latin"], weight: ["400", "700", "900"], variable: "--font-app" })

export const metadata: Metadata = {
  title: "clearbrick admin",
  robots: { index: false, follow: false },
}

// Separate root layout: no store header, no pixel, no analytics. Access is gated by the session check in src/proxy.ts.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  )
}
