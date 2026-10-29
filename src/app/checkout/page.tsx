import { Suspense } from "react"
import type { Metadata } from "next"
import { CheckoutForm } from "@/components/checkout-form"

export const metadata: Metadata = {
  title: "השלמת הזמנה",
  robots: { index: false },
}

export default function CheckoutPage() {
  return (
    <section className="container-site flex flex-col gap-8 py-8 md:py-12">
      <h1 className="text-display-md">השלמת הזמנה</h1>
      <Suspense>
        <CheckoutForm />
      </Suspense>
    </section>
  )
}
