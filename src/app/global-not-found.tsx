import type { Metadata } from "next"
import Link from "next/link"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-app" })

export const metadata: Metadata = { title: "Page not found | clearbrick" }

// Needed because the store and the admin each have their own root layout.
export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr" className={`${geist.variable} font-sans`}>
      <body className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center">
        <h1 className="text-display-lg">Page not found</h1>
        <Link href="/" className="text-lg underline">
          Back to the shop
        </Link>
      </body>
    </html>
  )
}
