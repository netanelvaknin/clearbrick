import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms & privacy",
  description: "Terms of use and privacy policy for the clearbrick website.",
}

const UPDATED = "November 20, 2026"

const SECTIONS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "general",
    title: "General",
    body: (
      <p>
        Welcome to the clearbrick website (&ldquo;the site&rdquo;). By using the site in any way, you agree to these terms. If you
        don&rsquo;t agree, please don&rsquo;t use the site.
      </p>
    ),
  },
  {
    id: "pre-launch",
    title: "Stock, orders and waitlist",
    body: (
      <>
        <p>
          The products shown on the site are not currently in stock. Clicking &ldquo;Add to cart&rdquo; or &ldquo;Buy now&rdquo; does not
          create an order, no payment is taken, and neither side makes any commitment.
        </p>
        <p>
          Leaving your email adds you to a waitlist so we can let you know when the product is back in stock. This is not a
          commitment on our part to any date, price or availability.
        </p>
      </>
    ),
  },
  {
    id: "prices",
    title: "Prices and product descriptions",
    body: (
      <>
        <p>
          Prices on the site are in US dollars and don&rsquo;t include sales tax, where applicable. Prices, promotions and discounts may
          change until sales actually open.
        </p>
        <p>
          Photos on the site are for illustration. Some were produced with digital tools, and there may be slight differences in
          color, lighting and room styling compared with the actual product. The listed dimensions are what count.
        </p>
      </>
    ),
  },
  {
    id: "privacy",
    title: "Privacy and data collection",
    body: (
      <>
        <p>We only collect the information you give us and basic information about how the site is used:</p>
        <ul>
          <li>The email address you left on the waitlist.</li>
          <li>The name, email, phone and message you entered in the contact form.</li>
          <li>
            Actions on the site (like clicking &ldquo;Add to cart&rdquo;), the product and color you picked, the page you were on, your
            browser type, and how you got to the site (for example, a Facebook or TikTok campaign).
          </li>
        </ul>
        <p>
          We use this information to let you know when products are back in stock, to reply to your messages, and to understand
          which products interest visitors. You don&rsquo;t have to give us any information, but without it we can&rsquo;t update you
          or get back to you.
        </p>
        <p>
          The information is sent to and stored with third-party service providers that help us run the site (such as automation
          and hosting services), some of which operate outside the United States. We never sell your information.
        </p>
        <p>
          You can ask to see the information we hold about you, correct it or delete it. Email us at{" "}
          <a href="mailto:info@clearbrick.co.il">info@clearbrick.co.il</a>.
        </p>
      </>
    ),
  },
  {
    id: "marketing",
    title: "Emails and updates",
    body: (
      <p>
        We only send marketing emails if you explicitly agreed, for example by checking the box in the contact form. Back-in-stock
        updates go only to people who asked for them. You can unsubscribe from any email, or ask us to remove you by email.
      </p>
    ),
  },
  {
    id: "ip",
    title: "Intellectual property",
    body: (
      <p>
        All content on the site, including design, text, images, logo and trademarks, belongs to clearbrick or its respective
        owners. It may not be copied, distributed or used commercially without prior written permission.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Liability",
    body: (
      <p>
        The site and its content are provided &ldquo;as is.&rdquo; We work to keep the information accurate and up to date, but errors or
        outages may happen. To the extent permitted by law, we are not liable for damage caused by using the site or relying on its
        information.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: <p>We may update these terms from time to time. The version published on the site is the binding one, and the date of the last update appears at the top of the page.</p>,
  },
  {
    id: "law",
    title: "Governing law",
    body: <p>These terms are governed by the laws of the State of Israel, and the competent courts in Israel have exclusive jurisdiction.</p>,
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions about these terms or your privacy? Write to us at <a href="mailto:info@clearbrick.co.il">info@clearbrick.co.il</a> or
        through the <Link href="/contact">contact form</Link>.
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <div className="container-site grid gap-12 py-12 md:grid-cols-[18rem_1fr] md:gap-20 md:py-20">
      <aside className="flex flex-col gap-6 md:sticky md:top-28 md:self-start">
        <span className="text-eyebrow text-muted-foreground">Last updated: {UPDATED}</span>
        <h1 className="text-display-md">Terms & privacy</h1>
        <nav aria-label="Contents" className="hidden flex-col gap-3 border-s-2 border-border ps-5 md:flex">
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
