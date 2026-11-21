import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { HEROES, isHeroKey } from "@/lib/heroes"
import { Home } from "../../home"

// The homepage with the hero for one ad, pre-built for every ad. Never linked or visited directly: the proxy rewrites
// "/?utm_content=<ad>" here, so the address bar still shows the homepage URL (with its UTMs for attribution).
export const metadata: Metadata = { alternates: { canonical: "/" }, robots: { index: false } }

export function generateStaticParams() {
  return Object.keys(HEROES).map((hero) => ({ hero }))
}

export default async function AdHomePage({ params }: PageProps<"/h/[hero]">) {
  const { hero } = await params
  if (!isHeroKey(hero)) notFound()
  return <Home hero={HEROES[hero]} />
}
