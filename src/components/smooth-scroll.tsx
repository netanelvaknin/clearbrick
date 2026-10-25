"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { ReactLenis, useLenis } from "lenis/react"
import "lenis/dist/lenis.css"

// Inertia-based smooth scrolling for the whole page (wheel, trackpad, anchor links).
// Lenis turns itself off for users with prefers-reduced-motion.
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        wheelMultiplier: 0.9,
        anchors: true, // offsets come from each target's scroll-margin-top
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
      }}
    >
      <ResetOnNavigate />
      <PauseWhenLocked />
      {children}
    </ReactLenis>
  )
}

function ResetOnNavigate() {
  const pathname = usePathname()
  const lenis = useLenis()
  useEffect(() => {
    if (!location.hash) lenis?.scrollTo(0, { immediate: true })
  }, [pathname, lenis])
  return null
}

// Dialogs and sheets lock scrolling with overflow: hidden on <body>. Lenis scrolls
// programmatically, so it would keep moving the page behind them; pause it instead.
function PauseWhenLocked() {
  const lenis = useLenis()
  useEffect(() => {
    if (!lenis) return
    const sync = () => {
      const locked = [document.documentElement, document.body].some((el) => getComputedStyle(el).overflow === "hidden")
      if (locked) lenis.stop()
      else lenis.start()
    }
    const observer = new MutationObserver(sync)
    for (const el of [document.documentElement, document.body]) {
      observer.observe(el, { attributes: true, attributeFilter: ["style", "class"] })
    }
    return () => observer.disconnect()
  }, [lenis])
  return null
}
