"use client"

import { useEffect } from "react"
import { getAttribution } from "@/lib/attribution"

export function AttributionCapture() {
  useEffect(() => {
    getAttribution()
  }, [])
  return null
}
