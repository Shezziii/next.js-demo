/** Single source of truth for auth routing, shared by proxy.ts, the DAL and the auth actions. */
export const authRoutes = {
  login: "/login",
  register: "/register",
  afterLogin: "/dashboard",
  afterLogout: "/",
  /** Path prefixes that require a signed-in member. Classes and trainers are public; booking needs login. */
  protected: ["/dashboard", "/bookings", "/cart", "/checkout", "/orders"],
  /** Pages a signed-in member should skip (redirected to afterLogin). */
  guestOnly: ["/login", "/register"],
} as const;

export function isProtectedPath(pathname: string) {
  return authRoutes.protected.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isGuestOnlyPath(pathname: string) {
  return (authRoutes.guestOnly as readonly string[]).includes(pathname);
}

/** Only allow same-site relative paths, so `?from=` can't be used as an open redirect. */
export function safeRedirectPath(path: unknown, fallback: string = authRoutes.afterLogin) {
  // "//evil.com" and "/\evil.com" are both treated as external URLs by browsers.
  return typeof path === "string" && /^\/(?![/\\])/.test(path) ? path : fallback;
}
