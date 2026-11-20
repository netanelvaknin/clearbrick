import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AttributionCapture } from "@/components/attribution-capture"
import { SmoothScroll } from "@/components/smooth-scroll"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { VercelAnalytics } from "@/components/vercel-analytics"
import { CartProvider } from "@/components/cart"
import { Tags } from "@/components/tags"
import "../globals.css"

const GTM_ID = "GTM-MCQ9SFVR"
// Tags (Meta pixel, Clarity) load only on the live site, so local and preview visits never reach Meta.
const IS_PROD = process.env.VERCEL_ENV === "production"

// Geist (Vercel), variable font: every weight from 100 to 900 in one file. Exposed as --font-app for globals.css.
const geist = Geist({ subsets: ["latin"], variable: "--font-app" })

export const metadata: Metadata = {
  metadataBase: new URL("https://www.clearbrickhome.com"),
  title: { default: "clearbrick | Modern Acrylic Furniture", template: "%s | clearbrick" },
  description: "Clear and colored acrylic bookshelves, nightstands and desks. Modern, minimal and shatter-resistant, with free shipping.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "clearbrick",
    url: "/",
    images: [{ url: "/og/home.jpg", width: 1200, height: 630, alt: "The clearbrick Luna Bookshelf and Laila Nightstand in a bright living room" }],
  },
  twitter: { card: "summary_large_image" },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" dir="ltr" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {IS_PROD && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <CartProvider>
          <SmoothScroll>
            <AttributionCapture />
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </SmoothScroll>
        </CartProvider>
        {/* GTM (Meta pixel, Clarity) loads client-side so friends marked with ?internal=1 can be skipped */}
        {IS_PROD && <Tags />}
        <WhatsAppButton />
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
