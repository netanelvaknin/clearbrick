import { NextResponse, type NextRequest } from "next/server"

const UID = "cb_uid"

// Gives every visitor a stable anonymous ID, sent with each funnel event so Make rows can be joined per user.
// Set by the server (not JS) so Safari's 7-day cap on script-set cookies doesn't reset it.
export function proxy(request: NextRequest) {
  const response = NextResponse.next()
  if (!request.cookies.has(UID)) {
    response.cookies.set(UID, crypto.randomUUID(), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 730,
    })
  }
  return response
}

export const config = {
  // Pages and server actions only; static files and images don't need it.
  matcher: "/((?!_next/static|_next/image|.*\\..*).*)",
}
