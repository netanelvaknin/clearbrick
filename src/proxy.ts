import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE, verifySession } from "@/lib/admin-session"

const UID = "cb_uid"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const adminHost = request.headers.get("host")?.startsWith("admin.") ?? false
  if (adminHost || pathname.startsWith("/admin")) return admin(request, adminHost)

  // Gives every visitor a stable anonymous ID, sent with each funnel event so Make rows can be joined per user.
  // Set by the server (not JS) so Safari's 7-day cap on script-set cookies doesn't reset it.
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

// Admin panel: admin.clearbrickhome.com/* serves /admin/* (admin.clearbrick.co.il 308-redirects there in Vercel). Everything except the login page needs a valid session cookie
// (set by the login form, see src/app/admin/login/actions.ts); without one you're sent to the login page.
async function admin(request: NextRequest, adminHost: boolean) {
  const { pathname } = request.nextUrl
  const path = adminHost && !pathname.startsWith("/admin") ? `/admin${pathname === "/" ? "" : pathname}` : pathname

  if (path !== "/admin/login" && !(await verifySession(request.cookies.get(SESSION_COOKIE)?.value))) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  const response = path !== pathname ? NextResponse.rewrite(new URL(path, request.url)) : NextResponse.next()
  response.headers.set("X-Robots-Tag", "noindex, nofollow")
  return response
}

export const config = {
  // Pages and server actions only; static files and images don't need it.
  matcher: "/((?!_next/static|_next/image|.*\\..*).*)",
}
