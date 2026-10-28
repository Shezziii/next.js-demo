import "server-only";

import { cookies } from "next/headers";

import { isProduction } from "@/config/env";
import { MAX_ORDER_ITEMS } from "@/features/checkout/schemas";

/**
 * The cart is just a list of session ids in a cookie. It holds no prices or availability:
 * those are always looked up on the server, so editing the cookie can't change what anyone pays.
 */
const CART_COOKIE = "gg_cart";
const CART_TTL_SECONDS = 7 * 24 * 60 * 60;
const SESSION_ID = /^[\w-]{1,100}$/;

/** Session ids in the cart, in the order they were added. Ignores anything malformed. Never throws. */
export async function readCartIds(): Promise<string[]> {
  const raw = (await cookies()).get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const ids = parsed.filter((id): id is string => typeof id === "string" && SESSION_ID.test(id));
    return [...new Set(ids)].slice(0, MAX_ORDER_ITEMS);
  } catch {
    return [];
  }
}

/** Call from a Server Action only (cookies can't be set while rendering). */
export async function writeCartIds(ids: string[]) {
  const store = await cookies();
  if (ids.length === 0) {
    store.delete(CART_COOKIE);
    return;
  }
  store.set(CART_COOKIE, JSON.stringify(ids), {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: CART_TTL_SECONDS,
  });
}
