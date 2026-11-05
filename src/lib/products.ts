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
    // Slug kept from the arch shelf so live ad links keep working.
    slug: "arch-bookshelf",
    name: "ספריית לונה",
    shortName: "ספריית לונה",
    tagline: "ספרייה שקופה בקווים נקיים, 4 קומות של סטייל.",
    description:
      "ספריית אקריליק פתוחה עם גג שטוח וקווים נקיים, שמחזיקה את כל מה שאתם אוהבים, ספרים, צמחים, אוספים, ונותן לחדר להמשיך לנשום. מתאים לסלון, לחדר שינה או לחדר ילדים, ועומדת יציב על הרצפה או צמוד לקיר.",
    price: 890,
    compareAt: 1290,
    images: [
      { src: "/products/luna-bedroom-smoke.jpg", alt: "ספריית לונה בגוון אפור מעושן בחדר שינה ליד המיטה" },
      { src: "/products/luna-office-clear.jpg", alt: "ספריית לונה בגוון שקוף בפינת עבודה ליד שולחן עץ" },
      { src: "/products/luna-living-pink.jpg", alt: "ספריית לונה בגוון ורוד בסלון באור שקיעה, עם ספרים, עציץ ואגרטלים" },
      { src: "/products/luna-kids-blue.jpg", alt: "ספריית לונה בגוון כחול בחדר ילדים, עם צעצועי עץ, ספרים ושטיח צבעוני" },
      { src: "/products/luna-detail-pink.jpg", alt: "תקריב על שתי הקומות העליונות של ספריית לונה הוורודה" },
      { src: "/products/luna-dining-clear.jpg", alt: "ספריית לונה בגוון שקוף בפינת אוכל עם כלים וספרי בישול" },
    ],
    cardImage: { src: "/products/luna-bedroom-smoke.jpg", alt: "ספריית לונה בגוון אפור מעושן" },
    colors: [
      // Smoke first (best-selling color), so the product page opens on it.
      { id: "smoke", name: "אפור מעושן", swatch: "#6f6a64", image: 0 },
      { id: "clear", name: "שקוף", swatch: "#eef1f2", image: 1 },
      { id: "pink", name: "ורוד", swatch: "#e9b8cf", image: 2 },
      { id: "blue", name: "כחול", swatch: "#1f3fd1", image: 3 },
    ],
    specs: [
      { label: "גובה", value: "160 ס״מ" },
      { label: "רוחב", value: "60 ס״מ" },
      { label: "עומק", value: "30 ס״מ" },
      { label: "קומות", value: "4 × 40 ס״מ" },
    ],
    features: ["אקריליק עבה ועמיד", "4 קומות אחסון", "עומדת על הרצפה או צמוד לקיר", "מנגבים במטלית לחה וזהו"],
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
      { id: "smoke", name: "אפור מעושן", swatch: "#6f6a64", image: 2 },
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
  {
    slug: "acrylic-desk",
    name: "שולחן אור",
    shortName: "שולחן אור",
    tagline: "שולחן עבודה שקוף שכמעט נעלם בחדר.",
    description:
      "שולחן עבודה מאקריליק שקוף בעובי 8 מ״מ, עם מדף נוסף מתחת למשטח ללפטופ, מחברות ומגזינים. רואים דרכו, אז גם חדר קטן נשאר פתוח ומואר. מושלם לפינת לפטופ בסלון, לפינת איפור בחדר השינה או לשיעורי בית בחדר הילדים.",
    price: 1190,
    compareAt: 1590,
    images: [
      { src: "/products/desk-studio-clear-v3.jpg", alt: "שולחן אור מאקריליק שקוף על רקע בהיר, עם לפטופ סגור וספל על המשטח ומחברות על המדף" },
      { src: "/products/desk-dims-v3.jpg", alt: "מידות שולחן אור: רוחב 100 ס״מ, עומק 50 ס״מ, גובה 75 ס״מ, אקריליק בעובי 8 מ״מ" },
      { src: "/products/desk-vibe-olive-zoom.jpg", alt: "מבט קרוב על משטח ומדף שולחן אור, עם לפטופ, ספל ומחברות, ועץ זית ברקע" },
      { src: "/products/desk-vibe-detail.jpg", alt: "פינת שולחן אור עם ספל ומחברת על המדף, וצמח פיקוס כינורי בסלסלה ברקע" },
    ],
    cardImage: { src: "/products/desk-card-v3.jpg", alt: "שולחן אור מאקריליק שקוף על רקע בהיר" },
    colors: [
      { id: "clear", name: "שקוף", swatch: "#eef1f2", image: 0 },
    ],
    specs: [
      { label: "רוחב", value: "100 ס״מ" },
      { label: "עומק", value: "50 ס״מ" },
      { label: "גובה", value: "75 ס״מ" },
      { label: "עובי", value: "8 מ״מ" },
    ],
    features: ["אקריליק שקוף בעובי 8 מ״מ", "מדף ללפטופ ולמחברות מתחת למשטח", "משטח עבודה ברוחב 100 ס״מ", "מנגבים במטלית לחה וזהו"],
  },
]

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}

export const formatPrice = (n: number) => `₪${n.toLocaleString("he-IL")}`
