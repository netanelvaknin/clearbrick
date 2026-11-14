import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "תנאי שימוש ופרטיות",
  description: "תנאי השימוש ומדיניות הפרטיות של אתר clearbrick.",
}

const UPDATED = "25 באוקטובר 2026"

const SECTIONS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "general",
    title: "כללי",
    body: (
      <>
        <p>
          ברוכים הבאים לאתר clearbrick.co.il (״האתר״). השימוש באתר, בכל אמצעי, מהווה הסכמה לתנאים אלה. אם אינכם מסכימים
          להם, אנא אל תשתמשו באתר.
        </p>
        <p>התנאים כתובים בלשון רבים מטעמי נוחות ומתייחסים לכל המגדרים.</p>
      </>
    ),
  },
  {
    id: "pre-launch",
    title: "מלאי, הזמנות ורשימת המתנה",
    body: (
      <>
        <p>
          המוצרים המוצגים באתר אינם זמינים כרגע במלאי. לחיצה על ״הוספה לסל״ או ״לקנייה מהירה״ אינה יוצרת הזמנה, לא נגבה
          תשלום ולא נוצרת התחייבות מצד מי מהצדדים.
        </p>
        <p>
          השארת כתובת מייל מצרפת אתכם לרשימת המתנה, כדי שנעדכן אתכם כשהמוצר יחזור למלאי. אין בכך התחייבות שלנו למועד,
          למחיר או לזמינות.
        </p>
      </>
    ),
  },
  {
    id: "prices",
    title: "מחירים ותיאור מוצרים",
    body: (
      <>
        <p>
          המחירים באתר נקובים בשקלים חדשים וכוללים מע״מ. המחירים, המבצעים וההנחות עשויים להשתנות עד לפתיחת המכירה בפועל.
        </p>
        <p>
          התמונות באתר נועדו להמחשה. חלקן הופקו בעזרת כלים דיגיטליים, וייתכנו הבדלים קלים בגוון, בתאורה ובעיצוב החדר
          לעומת המוצר בפועל. המידות המפורטות הן המידות הקובעות.
        </p>
      </>
    ),
  },
  {
    id: "privacy",
    title: "פרטיות ואיסוף מידע",
    body: (
      <>
        <p>אנחנו אוספים רק את המידע שאתם מוסרים לנו ומידע בסיסי על השימוש באתר:</p>
        <ul>
          <li>כתובת מייל שהשארתם ברשימת ההמתנה.</li>
          <li>שם, מייל, טלפון ותוכן הפנייה שמילאתם בטופס יצירת הקשר.</li>
          <li>
            פעולות באתר (כמו לחיצה על ״הוספה לסל״), המוצר והצבע שבחרתם, הדף שבו הייתם, סוג הדפדפן ומקור ההגעה לאתר
            (למשל קמפיין בפייסבוק או בטיקטוק).
          </li>
        </ul>
        <p>
          המידע משמש אותנו כדי לעדכן אתכם על חזרת מוצרים למלאי, לחזור לפניות, ולהבין אילו מוצרים מעניינים את הגולשים.
          לא תחויבו למסור מידע, אך בלעדיו לא נוכל לעדכן אתכם או לחזור אליכם.
        </p>
        <p>
          המידע מועבר ונשמר אצל ספקי שירות חיצוניים שמסייעים לנו בתפעול (כגון שירותי אוטומציה ואחסון), שחלקם פועלים מחוץ
          לישראל. איננו מוכרים את המידע לאף אחד.
        </p>
        <p>
          לפי חוק הגנת הפרטיות, התשמ״א-1981, אתם רשאים לבקש לעיין במידע שנשמר עליכם, לתקן אותו או למחוק אותו. פנו אלינו
          במייל <a href="mailto:clearbrickisrael@gmail.com">clearbrickisrael@gmail.com</a>.
        </p>
      </>
    ),
  },
  {
    id: "marketing",
    title: "דיוור ועדכונים",
    body: (
      <p>
        נשלח לכם הודעות שיווקיות רק אם אישרתם זאת במפורש, למשל בסימון התיבה בטופס יצירת הקשר. עדכון על חזרת מוצר למלאי
        נשלח רק למי שביקש אותו. בכל הודעה תוכלו להסיר את עצמכם מרשימת התפוצה, או לבקש זאת במייל.
      </p>
    ),
  },
  {
    id: "ip",
    title: "קניין רוחני",
    body: (
      <p>
        כל התכנים באתר, כולל עיצוב, טקסטים, תמונות, לוגו וסימני מסחר, שייכים ל-clearbrick או לבעלי הזכויות בהם. אין להעתיק,
        להפיץ או לעשות בהם שימוש מסחרי ללא אישור מראש ובכתב.
      </p>
    ),
  },
  {
    id: "liability",
    title: "אחריות",
    body: (
      <p>
        האתר והתכנים בו מוצגים כפי שהם (AS IS). אנו עושים מאמץ שהמידע יהיה מדויק ועדכני, אך ייתכנו טעויות או תקלות. לא
        נהיה אחראים לנזק שנגרם משימוש באתר או מהסתמכות על המידע בו, במידה המותרת לפי דין.
      </p>
    ),
  },
  {
    id: "changes",
    title: "שינויים בתנאים",
    body: <p>אנו רשאים לעדכן את התנאים מעת לעת. הנוסח המחייב הוא הנוסח המפורסם באתר, ותאריך העדכון האחרון מופיע בראש העמוד.</p>,
  },
  {
    id: "law",
    title: "דין וסמכות שיפוט",
    body: <p>על תנאים אלה יחולו דיני מדינת ישראל בלבד. סמכות השיפוט הבלעדית נתונה לבתי המשפט המוסמכים בישראל.</p>,
  },
  {
    id: "contact",
    title: "יצירת קשר",
    body: (
      <p>
        שאלות על התנאים או על הפרטיות? כתבו לנו ל-<a href="mailto:clearbrickisrael@gmail.com">clearbrickisrael@gmail.com</a> או דרך{" "}
        <Link href="/contact">טופס יצירת הקשר</Link>.
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <div className="container-site grid gap-12 py-12 md:grid-cols-[18rem_1fr] md:gap-20 md:py-20">
      <aside className="flex flex-col gap-6 md:sticky md:top-28 md:self-start">
        <span className="text-eyebrow text-muted-foreground">עודכן לאחרונה: {UPDATED}</span>
        <h1 className="text-display-md">תנאי שימוש ופרטיות</h1>
        <nav aria-label="תוכן העניינים" className="hidden flex-col gap-3 border-s-2 border-border ps-5 md:flex">
          {SECTIONS.map((s, i) => (
            <a key={s.id} href={`#${s.id}`} className="text-base text-muted-foreground transition-colors hover:text-foreground">
              {i + 1}. {s.title}
            </a>
          ))}
        </nav>
      </aside>

      <div className="flex flex-col gap-4">
        {SECTIONS.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className="flex scroll-mt-28 flex-col gap-4 rounded-[2rem] border border-border bg-card p-6 text-lg leading-relaxed text-muted-foreground md:p-10 [&_a]:font-semibold [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_li]:ms-6 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2"
          >
            <h2 className="flex items-baseline gap-3 text-2xl font-extrabold text-foreground md:text-3xl">
              <span className="text-muted-foreground/50">{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </h2>
            {s.body}
          </section>
        ))}
      </div>
    </div>
  )
}
