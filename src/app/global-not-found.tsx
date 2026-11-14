import type { Metadata } from "next"
import Link from "next/link"
import { Heebo } from "next/font/google"
import "./globals.css"

const heebo = Heebo({ subsets: ["hebrew", "latin"], weight: ["400", "900"] })

export const metadata: Metadata = { title: "הדף לא נמצא | clearbrick" }

// Needed because the store and the admin each have their own root layout.
export default function GlobalNotFound() {
  return (
    <html lang="he" dir="rtl" className={heebo.className}>
      <body className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center">
        <h1 className="text-display-lg">הדף לא נמצא</h1>
        <Link href="/" className="text-lg underline">
          חזרה לחנות
        </Link>
      </body>
    </html>
  )
}
