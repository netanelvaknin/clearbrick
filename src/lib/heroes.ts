// Homepage hero per ad. A Meta ad links with utm_content=<ad name> (see clearbrick-social/22-us-ads/copy.txt), so the
// visitor lands on the same product, color and photo they just saw, with matching copy and CTA.
// `?hero=<key>` forces a variant (handy for testing or ads without UTMs).

export type HeroVariant = {
  product: string // product slug
  color?: string // color id, preselected on the product page
  image: { src: string; alt: string; position?: string } // position = CSS object-position (focal point when cropped)
  headline: [string, string, string] // 3 short words; the last one is muted
  sub: string // mobile, one line
  subDesktop: string
  cta: { label: string; href: string }
}

const luna = (color: string, image: HeroVariant["image"], v: Partial<HeroVariant>): HeroVariant => ({
  product: "arch-bookshelf",
  color,
  image,
  headline: ["Clear.", "Clean.", "Yours."],
  sub: "Acrylic furniture that makes small spaces feel big.",
  subDesktop: "See-through acrylic furniture that makes any room feel bigger and brighter. Minimal design, with color only where you want it.",
  cta: { label: `Shop Luna in ${color[0].toUpperCase()}${color.slice(1)}`, href: `/products/arch-bookshelf?color=${color}` },
  ...v,
})

const desk = (image: HeroVariant["image"]): HeroVariant => ({
  product: "acrylic-desk",
  image,
  headline: ["Clear.", "Focused.", "Yours."],
  sub: "A see-through desk that takes up no space.",
  subDesktop: "Crystal-clear acrylic with a built-in shelf for your laptop and notebooks. A workspace that keeps even a small apartment open and bright.",
  cta: { label: "Shop the Ora Desk", href: "/products/acrylic-desk" },
})

const DESK_DETAIL = { src: "/products/desk-vibe-detail.jpg", position: "68% 50%", alt: "Corner of the Ora Desk with a mug and notebook on the shelf, and a fiddle-leaf fig in a basket behind" }
const PINK = { src: "/products/luna-living-pink.jpg", alt: "The Luna bookshelf in pink in a bright living room" }

export const HEROES = {
  // No ad (direct, organic, other campaigns): the whole collection.
  default: luna("pink", PINK, { cta: { label: "Shop the collection", href: "/shop" } }),

  desk_spin_video: desk(DESK_DETAIL),
  desk_clear: desk(DESK_DETAIL),
  desk_shelf: desk(DESK_DETAIL),
  desk_olive: desk({ src: "/products/desk-vibe-olive-zoom.jpg", alt: "The Ora Desk with a laptop and notebooks, and an olive tree behind" }),

  luna_pink: luna("pink", PINK, {}),
  luna_smoke: luna("smoke", { src: "/products/luna-bedroom-smoke.jpg", alt: "The Luna bookshelf in smoke gray in a calm bedroom" }, {
    headline: ["Clear.", "Calm.", "Yours."],
    sub: "A boutique-hotel bedroom. Zero renovation.",
    subDesktop: "The Luna acrylic bookshelf in smoke gray: quiet, elegant, and it holds everything you keep by the bed.",
    cta: { label: "Shop Luna in Smoke gray", href: "/products/arch-bookshelf?color=smoke" },
  }),
  luna_blue: luna("blue", { src: "/products/luna-kids-blue.jpg", alt: "The Luna bookshelf in blue in a kids' room" }, {
    headline: ["Clear.", "Bright.", "Theirs."],
    sub: "Kids' room, sorted. Room for every book and toy.",
    subDesktop: "Room for every book, toy and big dream. And because it's see-through acrylic, the room stays bright and open.",
  }),

  nightstand: {
    product: "bedside-table",
    image: { src: "/products/bedside-sofa.jpg", alt: "The amber Laila Nightstand next to a sofa in sunlight" },
    headline: ["Clear.", "Cozy.", "Yours."],
    sub: "The nightstand that rolls with you.",
    subDesktop: "A see-through amber nightstand on 4 wheels, with a built-in magazine rack. By the bed, by the sofa, wherever you want it.",
    cta: { label: "Shop the Laila Nightstand", href: "/products/bedside-table" },
  },
} satisfies Record<string, HeroVariant>

export type HeroKey = keyof typeof HEROES
export const isHeroKey = (k: string): k is HeroKey => k in HEROES

// ?hero= wins, then the exact ad name, then the product family in the ad name or campaign. Unknown → default.
// Runs in the proxy (src/proxy.ts), which serves the pre-built /h/<key> page so the right hero is in the first paint.
export function heroKeyFor(params: URLSearchParams): HeroKey {
  const get = (k: string) => params.get(k)?.toLowerCase() ?? ""
  for (const key of [get("hero"), get("utm_content")]) if (isHeroKey(key)) return key
  const hint = `${get("utm_content")} ${get("utm_campaign")}`
  if (hint.includes("desk")) return "desk_clear"
  if (/nightstand|bedside|laila/.test(hint)) return "nightstand"
  if (/luna|shelf/.test(hint)) return "luna_pink"
  return "default"
}
