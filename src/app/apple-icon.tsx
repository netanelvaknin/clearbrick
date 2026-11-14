import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

// The "cb" monogram from icon.svg, rendered as PNG for iOS home screens (iOS rounds the corners itself).
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#000" }}>
        <svg width="180" height="180" viewBox="129 234 220 220">
          <g fill="#fff">
            <path d="M229 325 A43 43 0 1 0 229 375 L209 362 A19 19 0 1 1 209 338 Z" />
            <path fillRule="evenodd" d="M234 276 H259 V316 C266 310 274 307 282 307 C306 307 325 326 325 350 C325 374 306 393 282 393 C272 393 264 390 258 384 V391 H234 Z M281 331 A19 19 0 1 0 281 369 A19 19 0 1 0 281 331 Z" />
          </g>
        </svg>
      </div>
    ),
    size
  )
}
