import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

// Same arch mark as icon.svg, rendered as PNG for iOS home screens.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#171717" }}>
        <svg width="120" height="120" viewBox="0 0 64 64">
          <path d="M20 50V28a12 12 0 0 1 24 0v22Z" fill="none" stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
          <path d="M20 39h24" stroke="#fff" strokeWidth="5" />
        </svg>
      </div>
    ),
    size
  )
}
