// clearbrick logo: black "cb" monogram square + bold lowercase wordmark (vector, from the chosen brand concept).
// The square alone is the favicon (app/icon.svg) and iOS icon (app/apple-icon.tsx).
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="129 234 812 220" role="img" aria-label="clearbrick" className={`h-8 w-auto ${className ?? ""}`}>
      <rect x="129" y="234" width="220" height="220" rx="9" fill="currentColor" />
      <g fill="var(--logo-knockout, #fff)">
        <path d="M229 325 A43 43 0 1 0 229 375 L209 362 A19 19 0 1 1 209 338 Z" />
        <path fillRule="evenodd" d="M234 276 H259 V316 C266 310 274 307 282 307 C306 307 325 326 325 350 C325 374 306 393 282 393 C272 393 264 390 258 384 V391 H234 Z M281 331 A19 19 0 1 0 281 369 A19 19 0 1 0 281 331 Z" />
      </g>
      <g fill="currentColor" transform="translate(385 295)">
        <path d="M55 34 L41 43 C37 37 33 35 28 35 C19 35 14 42 14 53 C14 64 19 71 28 71 C34 71 38 68 41 63 L55 72 C49 82 40 87 28 87 C10 87 -2 73 -2 53 C-2 33 10 19 28 19 C40 19 49 24 55 34 Z" />
        <path d="M64 0 H81 V85 H64 Z" />
        <path fillRule="evenodd" d="M150 58 H108 C109 67 115 72 124 72 C131 72 136 70 141 66 L149 77 C142 84 134 87 123 87 C103 87 90 74 90 53 C90 33 103 19 122 19 C140 19 151 32 151 52 Z M108 46 H134 C133 38 129 34 122 34 C115 34 110 38 108 46 Z" />
        <path fillRule="evenodd" d="M206 21 H222 V85 H206 V78 C201 84 195 87 187 87 C169 87 158 73 158 53 C158 33 169 19 187 19 C195 19 201 22 206 28 Z M191 35 C181 35 175 42 175 53 C175 64 181 71 191 71 C200 71 206 64 206 53 C206 42 200 35 191 35 Z" />
        <path d="M234 21 H250 V31 C254 23 261 19 271 20 V37 C259 35 251 42 251 55 V85 H234 Z" />
        <path fillRule="evenodd" d="M280 0 H297 V28 C302 22 308 19 316 19 C334 19 345 33 345 53 C345 73 334 87 316 87 C308 87 301 84 296 78 V85 H280 Z M312 35 C302 35 296 42 296 53 C296 64 302 71 312 71 C322 71 328 64 328 53 C328 42 322 35 312 35 Z" />
        <path d="M356 21 H372 V31 C376 23 383 19 393 20 V37 C381 35 373 42 373 55 V85 H356 Z" />
        <path d="M402 21 H419 V85 H402 Z" />
        <circle cx="410.5" cy="6" r="9.5" />
        <path d="M485 34 L471 43 C467 37 463 35 458 35 C449 35 444 42 444 53 C444 64 449 71 458 71 C464 71 468 68 471 63 L485 72 C479 82 470 87 458 87 C440 87 427 73 427 53 C427 33 440 19 458 19 C470 19 479 24 485 34 Z" />
        <path d="M494 0 H511 V48 L532 21 H552 L527 51 L554 85 H533 L511 56 V85 H494 Z" />
      </g>
    </svg>
  )
}
