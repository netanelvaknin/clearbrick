import type { Metadata } from "next"
import { Heebo } from "next/font/google"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AttributionCapture } from "@/components/attribution-capture"
import "./globals.css"

const heebo = Heebo({ subsets: ["hebrew", "latin"], weight: ["400", "500", "600", "700", "800", "900"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://clearbrick.co.il"),
  title: { default: "clearbrick | רהיטי אקריליק שקופים", template: "%s | clearbrick" },
  description: "מדפים ושידות אקריליק בעיצוב נקי ומודרני. שקוף, צבעוני, שלכם.",
  openGraph: { locale: "he_IL", siteName: "clearbrick", images: ["/products/hero-arch-pink.jpg"] },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.className} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <AttributionCapture />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
