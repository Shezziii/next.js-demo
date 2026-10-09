import { NextResponse, type NextRequest } from "next/server";

import { authRoutes, isGuestOnlyPath, isProtectedPath } from "@/config/routes";
import { decodeSession, SESSION_COOKIE } from "@/lib/auth/session";

/**
 * Optimistic auth redirects. Only checks the cookie signature (no user lookup),
 * because proxy runs on every request including prefetches.
 * Real authorization happens in the Data Access Layer (lib/auth/dal.ts).
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isSignedIn = decodeSession(request.cookies.get(SESSION_COOKIE)?.value) !== null;

  if (!isSignedIn && isProtectedPath(pathname)) {
    const loginUrl = new URL(authRoutes.login, request.nextUrl);
    loginUrl.searchParams.set("from", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isSignedIn && isGuestOnlyPath(pathname)) {
    return NextResponse.redirect(new URL(authRoutes.afterLogin, request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  // Skip API routes, Next internals and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)"],
};
