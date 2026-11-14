"use client"

import { useEffect } from "react"

// Mobile keyboards shrink the *visual* viewport but not the layout one, so `fixed` + `100vh/dvh`
// dialogs end up squashed or half under the keyboard. This mirrors the visible area into CSS vars
// (--vv-top, --vv-height) that dialogs use for position and max-height, and keeps the focused
// field in view. Used by DialogContent, so every dialog gets it.
let users = 0

function sync() {
  const vv = window.visualViewport
  if (!vv) return
  const root = document.documentElement.style
  root.setProperty("--vv-top", `${vv.offsetTop}px`)
  root.setProperty("--vv-height", `${vv.height}px`)
}

function keepFocusVisible() {
  sync()
  const el = document.activeElement
  if (el instanceof HTMLElement && el.matches("input, textarea, select")) el.scrollIntoView({ block: "nearest" })
}

export function useVisualViewport(active = true) {
  useEffect(() => {
    const vv = window.visualViewport
    if (!active || !vv) return
    if (users++ === 0) {
      sync()
      vv.addEventListener("resize", keepFocusVisible)
      vv.addEventListener("scroll", sync)
    }
    return () => {
      if (--users > 0) return
      vv.removeEventListener("resize", keepFocusVisible)
      vv.removeEventListener("scroll", sync)
      document.documentElement.style.removeProperty("--vv-top")
      document.documentElement.style.removeProperty("--vv-height")
    }
  }, [active])
}
