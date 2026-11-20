export type ProductColor = {
  id: string
  name: string
  swatch: string
  image: number // index into images
}

export type Product = {
  slug: string
  name: string
  shortName: string
  tagline: string
  description: string
  price: number
  compareAt?: number
  images: { src: string; alt: string }[]
  cardImage: { src: string; alt: string }
  colors: ProductColor[] // each color's image is a same-angle shot; images no color points to are extra gallery shots
  specs: { label: string; value: string }[]
  features: string[]
}

export const products: Product[] = [
  {
    // Slug kept from the arch shelf so live ad links keep working.
    slug: "arch-bookshelf",
    name: "Luna Bookshelf",
    shortName: "Luna Bookshelf",
    tagline: "A clear bookshelf with clean lines. Four tiers of style.",
    description:
      "An open acrylic bookshelf with a flat top and clean lines. It holds everything you love (books, plants, collections) and still lets the room breathe. Made for the living room, bedroom or kids' room, and stands steady on the floor or against the wall.",
    price: 299,
    compareAt: 429,
    images: [
      // 0-3: one shot per color, same angle, so switching color changes only the color.
      { src: "/products/luna-living-smoke.jpg", alt: "The Luna Bookshelf in smoke grey in a living room at sunset, with books, a plant and vases" },
      { src: "/products/luna-living-clear.jpg", alt: "The Luna Bookshelf in clear in a living room at sunset, with books, a plant and vases" },
      { src: "/products/luna-living-pink.jpg", alt: "The Luna Bookshelf in pink in a living room at sunset, with books, a plant and vases" },
      { src: "/products/luna-living-blue.jpg", alt: "The Luna Bookshelf in blue in a living room at sunset, with books, a plant and vases" },
      { src: "/products/luna-bedroom-smoke.jpg", alt: "The Luna Bookshelf in smoke grey in a bedroom, next to the bed" },
      { src: "/products/luna-kids-blue.jpg", alt: "The Luna Bookshelf in blue in a kids' room, with wooden toys, books and a colorful rug" },
      { src: "/products/luna-detail-pink.jpg", alt: "Close-up of the top two shelves of the pink Luna Bookshelf" },
      { src: "/products/luna-bedroom-clear.jpg", alt: "The Luna Bookshelf in clear in a bedroom corner, with folded sweaters, books and a lamp" },
      { src: "/products/luna-detail-clear-40.jpg", alt: "Close-up of a shelf on the clear Luna Bookshelf, with a row of books, folded sweaters and a plant" },
    ],
    cardImage: { src: "/products/luna-bedroom-smoke.jpg", alt: "The Luna Bookshelf in smoke grey" },
    colors: [
      // Smoke first (best-selling color), so the product page opens on it.
      { id: "smoke", name: "Smoke grey", swatch: "#6f6a64", image: 0 },
      { id: "clear", name: "Clear", swatch: "#eef1f2", image: 1 },
      { id: "pink", name: "Pink", swatch: "#e9b8cf", image: 2 },
      { id: "blue", name: "Blue", swatch: "#1f3fd1", image: 3 },
    ],
    specs: [
      { label: "Height", value: '63" (160 cm)' },
      { label: "Width", value: '23.6" (60 cm)' },
      { label: "Depth", value: '11.8" (30 cm)' },
      { label: "Tiers", value: '4 × 15.7" (40 cm)' },
      { label: "Thickness", value: '5/16" (8 mm)' },
    ],
    features: ["Thick, durable acrylic", "4 tiers of storage", "Stands on the floor or against the wall", "Just wipe with a damp cloth"],
  },
  {
    slug: "bedside-table",
    name: "Laila Nightstand",
    shortName: "Laila Nightstand",
    tagline: "A clear nightstand on wheels, with room for magazines and everything else.",
    description:
      "An acrylic nightstand in 5 shades, with two surfaces, a built-in magazine rack and wheels that move with you. By the bed, by the sofa, or in any corner that needs a little light.",
    price: 199,
    compareAt: 269,
    images: [
      { src: "/products/bedside-sofa.jpg", alt: "The Laila Nightstand in amber next to a sofa in sunlight" },
      { src: "/products/bedside-sofa-pink.jpg", alt: "The Laila Nightstand in pink next to a sofa in sunlight" },
      { src: "/products/bedside-sofa-clear.jpg", alt: "The Laila Nightstand in clear next to a sofa in sunlight" },
      { src: "/products/bedside-sofa-smoke.jpg", alt: "The Laila Nightstand in smoke grey next to a sofa in sunlight" },
      { src: "/products/bedside-sofa-blue.jpg", alt: "The Laila Nightstand in blue next to a sofa in sunlight" },
      { src: "/products/bedside-bedroom-day.jpg", alt: "The Laila Nightstand in amber by the bed, with a lamp and books" },
      { src: "/products/bedside-bedroom.jpg", alt: "The Laila Nightstand in amber by the bed, with magazines in the rack" },
      { src: "/products/bedside-detail.jpg", alt: "A hand setting a glass of water on the Laila Nightstand by the bed" },
    ],
    cardImage: { src: "/products/bedside-bedroom-day.jpg", alt: "The Laila Nightstand in amber by the bed" },
    colors: [
      { id: "amber", name: "Amber", swatch: "#d9822b", image: 0 },
      { id: "pink", name: "Pink", swatch: "#e9b8cf", image: 1 },
      { id: "clear", name: "Clear", swatch: "#eef1f2", image: 2 },
      { id: "smoke", name: "Smoke grey", swatch: "#6f6a64", image: 3 },
      { id: "blue", name: "Blue", swatch: "#1f3fd1", image: 4 },
    ],
    specs: [
      { label: "Height", value: '21.7" (55 cm)' },
      { label: "Width", value: '18.1" (46 cm)' },
      { label: "Depth", value: '15.7" (40 cm)' },
      { label: "Thickness", value: '5/16" (8 mm)' },
    ],
    features: ["4 wheels, moves easily", "Built-in magazine rack", "2 storage surfaces", "Clear, so the room looks bigger"],
  },
  {
    slug: "acrylic-desk",
    name: "Ora Desk",
    shortName: "Ora Desk",
    tagline: "A clear desk that all but disappears in the room.",
    description:
      "A desk made of 5/16\" (8 mm) clear acrylic, with an extra shelf under the top for your laptop, notebooks and magazines. You can see right through it, so even a small room stays open and bright. Perfect for a laptop nook in the living room, a vanity in the bedroom or homework in the kids' room.",
    price: 389,
    compareAt: 519,
    images: [
      { src: "/products/desk-studio-clear-v3.jpg", alt: "The clear acrylic Ora Desk on a light background, with a closed laptop and a mug on top and notebooks on the shelf" },
      { src: "/products/desk-dims-en.jpg", alt: "Ora Desk dimensions: 39.4\" (100 cm) wide, 19.7\" (50 cm) deep, 29.5\" (75 cm) high, 5/16\" (8 mm) acrylic" },
      { src: "/products/desk-vibe-olive-zoom.jpg", alt: "Close look at the Ora Desk top and shelf, with a laptop, mug and notebooks, and an olive tree behind" },
      { src: "/products/desk-vibe-detail.jpg", alt: "Corner of the Ora Desk with a mug and notebook on the shelf, and a fiddle-leaf fig in a basket behind" },
    ],
    cardImage: { src: "/products/desk-office-clean.jpg", alt: "The clear acrylic Ora Desk in a bright workspace" },
    colors: [
      { id: "clear", name: "Clear", swatch: "#eef1f2", image: 0 },
    ],
    specs: [
      { label: "Width", value: '39.4" (100 cm)' },
      { label: "Depth", value: '19.7" (50 cm)' },
      { label: "Height", value: '29.5" (75 cm)' },
      { label: "Thickness", value: '5/16" (8 mm)' },
    ],
    features: ["5/16\" (8 mm) clear acrylic", "Shelf under the top for laptop and notebooks", "39\" (100 cm) wide work surface", "Just wipe with a damp cloth"],
  },
]

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}

export const formatPrice = (n: number) => `$${n.toLocaleString("en-US")}`
