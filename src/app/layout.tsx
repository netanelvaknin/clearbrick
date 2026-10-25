import type { Metadata } from "next"
import { Heebo } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { GoogleTagManager } from "@next/third-parties/google"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AttributionCapture } from "@/components/attribution-capture"
import { SmoothScroll } from "@/components/smooth-scroll"
import "./globals.css"

const GTM_ID = "GTM-MCQ9SFVR"

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
      <GoogleTagManager gtmId={GTM_ID} />
      <body className="flex min-h-full flex-col">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <SmoothScroll>
          <AttributionCapture />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  )
}
