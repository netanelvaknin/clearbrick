"use client"

import { useEffect, useState } from "react"
import { GoogleTagManager } from "@next/third-parties/google"

const GTM_ID = "GTM-MCQ9SFVR"
export const INTERNAL = "cb_internal"

// Internal visits (us, friends) shouldn't count in Meta or Make. Open any page once with ?internal=1 to mark
// the browser (?internal=0 undoes it). Marked browsers never load GTM, so no Meta pixel or Clarity, and
// track() drops their events on the server.
export function Tags() {
  const [load, setLoad] = useState(false)

  useEffect(() => {
    const flag = new URLSearchParams(location.search).get("internal")
    if (flag === "1") document.cookie = `${INTERNAL}=1; path=/; max-age=63072000; samesite=lax; secure`
    if (flag === "0") document.cookie = `${INTERNAL}=; path=/; max-age=0`
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the cookie is only readable on the client
    setLoad(!document.cookie.split("; ").includes(`${INTERNAL}=1`))
  }, [])

  return load ? <GoogleTagManager gtmId={GTM_ID} /> : null
}
