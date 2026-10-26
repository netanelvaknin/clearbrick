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
  colors: ProductColor[]
  specs: { label: string; value: string }[]
  features: string[]
}

export const products: Product[] = [
  {
    slug: "arch-bookshelf",
    name: "מדף הקשת",
    shortName: "מדף הקשת",
    tagline: "ספרייה שקופה בקשת רכה, 4 קומות של סטייל.",
    description:
      "מדף אקריליק בצורת קשת שמחזיק את כל מה שאתם אוהבים, ספרים, צמחים, אוספים, ונותן לחדר להמשיך לנשום. מתאים לסלון, לחדר שינה או לחדר ילדים, ועומד יציב על הרצפה או צמוד לקיר.",
    price: 890,
    compareAt: 1290,
    images: [
      { src: "/products/hero-arch-pink.jpg", alt: "מדף הקשת בגוון ורוד בסלון מואר" },
      { src: "/products/arch-clear-studio.jpg", alt: "מדף הקשת בגוון שקוף על רקע לבן" },
      { src: "/products/arch-smoke-bedroom.jpg", alt: "מדף הקשת בגוון אפור מעושן בחדר שינה" },
      { src: "/products/arch-blue-kids.jpg", alt: "מדף הקשת בגוון כחול בחדר ילדים" },
      { src: "/products/arch-blue-dimensions.png", alt: "מידות מדף הקשת: גובה 120, רוחב 60, עומק 28 ס״מ" },
      { src: "/products/arch-detail.png", alt: "תקריב על קשת האקריליק המעושן" },
    ],
    cardImage: { src: "/products/arch-clear-studio.jpg", alt: "מדף הקשת בגוון שקוף" },
    colors: [
      { id: "pink", name: "ורוד", swatch: "#e9b8cf", image: 0 },
      { id: "clear", name: "שקוף", swatch: "#eef1f2", image: 1 },
      { id: "smoke", name: "אפור מעושן", swatch: "#6f6a64", image: 2 },
      { id: "blue", name: "כחול", swatch: "#1f3fd1", image: 3 },
    ],
    specs: [
      { label: "גובה", value: "120 ס״מ" },
      { label: "רוחב", value: "60 ס״מ" },
      { label: "עומק", value: "28 ס״מ" },
      { label: "קומות", value: "4 × 30 ס״מ" },
    ],
    features: ["אקריליק עבה ועמיד", "4 קומות אחסון", "עומד על הרצפה או צמוד לקיר", "מנגבים במטלית לחה וזהו"],
  },
  {
    slug: "bedside-table",
    name: "שידת הלילה",
    shortName: "שידת הלילה",
    tagline: "שידה שקופה על גלגלים, עם מקום למגזינים ולכל השאר.",
    description:
      "שידת אקריליק ב-5 גוונים, עם שני משטחים, מתלה מגזינים מובנה וגלגלים שזזים איתכם. ליד המיטה, ליד הספה, או בכל פינה שצריכה קצת אור.",
    price: 590,
    compareAt: 790,
    images: [
      { src: "/products/bedside-sofa.jpg", alt: "שידת הלילה בגוון ענבר ליד ספה באור שמש" },
      { src: "/products/bedside-sofa-pink.jpg", alt: "שידת הלילה בגוון ורוד ליד ספה באור שמש" },
      { src: "/products/bedside-sofa-clear.jpg", alt: "שידת הלילה בגוון שקוף ליד ספה באור שמש" },
      { src: "/products/bedside-sofa-smoke.jpg", alt: "שידת הלילה בגוון אפור מעושן ליד ספה באור שמש" },
      { src: "/products/bedside-sofa-blue.jpg", alt: "שידת הלילה בגוון כחול ליד ספה באור שמש" },
    ],
    cardImage: { src: "/products/bedside-studio.jpg", alt: "שידת הלילה בגוון ענבר" },
    colors: [
      { id: "amber", name: "ענבר", swatch: "#d9822b", image: 0 },
      { id: "pink", name: "ורוד", swatch: "#e9b8cf", image: 1 },
      { id: "clear", name: "שקוף", swatch: "#eef1f2", image: 2 },
      { id: "smoke", name: "אפור מעושן", swatch: "#6f6a64", image: 3 },
      { id: "blue", name: "כחול", swatch: "#1f3fd1", image: 4 },
    ],
    specs: [
      { label: "חומר", value: "אקריליק" },
      { label: "משטחים", value: "2" },
      { label: "גלגלים", value: "4" },
      { label: "אחסון", value: "מתלה מגזינים" },
    ],
    features: ["4 גלגלים, זזה בקלות", "מתלה מגזינים מובנה", "2 משטחים לאחסון", "שקופה, אז החדר נראה גדול יותר"],
  },
]

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}

export const formatPrice = (n: number) => `₪${n.toLocaleString("he-IL")}`
