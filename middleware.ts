import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { SESSION_COOKIE, verifySessionToken } from "@/lib/mongodb/session"

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  // If a logged-in user visits an auth page, send them to their account.
  if (request.nextUrl.pathname.startsWith("/auth/login") || request.nextUrl.pathname.startsWith("/auth/signup")) {
    const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)
    if (session) {
      return NextResponse.redirect(new URL("/account", request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
