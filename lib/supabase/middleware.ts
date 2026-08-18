import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE, verifySessionToken } from "@/lib/mongodb/session"

// Edge-safe session check. The role is embedded in the signed JWT session
// cookie, so no database call is needed here (the Mongo driver can't run on the edge).
export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request })

  const token = request.cookies.get(SESSION_COOKIE)?.value
  const session = await verifySessionToken(token)

  // Protected routes that require authentication
  const protectedPaths = ["/account", "/admin", "/manager", "/checkout"]
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isProtectedPath && !session) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Role-based access control
  if (session && request.nextUrl.pathname.startsWith("/admin") && session.role !== "admin") {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  if (
    session &&
    request.nextUrl.pathname.startsWith("/manager") &&
    session.role !== "manager" &&
    session.role !== "admin"
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
