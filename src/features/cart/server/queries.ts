import "server-only";

import { getBookingContext } from "@/features/bookings/server/queries";
import { getOrderTotals } from "@/features/checkout/pricing";
import { getSchedule } from "@/features/classes/server/queries";

import type { CartItem, CartItemStatus } from "../types";
import { readCartIds } from "./cart-cookie";

/**
 * The cart resolved against the live schedule. Sessions that dropped out of the booking window
 * are left out; ones that filled up or were booked meanwhile stay, flagged, so the member sees why.
 */
export async function getCart() {
  const [ids, sessions, viewer] = await Promise.all([readCartIds(), getSchedule(), getBookingContext()]);
  const booked = new Set(viewer.bookedSessionIds);
  const now = Date.now();

  const items: CartItem[] = ids
    .map((id) => sessions.find((s) => s.id === id))
    .filter((session) => session !== undefined)
    .map((session) => {
      const status: CartItemStatus = booked.has(session.id)
        ? "booked"
        : new Date(session.startsAt).getTime() <= now
          ? "started"
          : session.spotsLeft <= 0
            ? "full"
            : "available";
      return { session, status };
    })
    .sort((a, b) => a.session.startsAt.localeCompare(b.session.startsAt));

  const available = items.filter((item) => item.status === "available");
  return {
    items,
    totals: getOrderTotals(available.map((item) => item.session.price)),
    /** True when there is something to pay for and nothing needs fixing first. */
    canCheckout: items.length > 0 && available.length === items.length,
  };
}

/** Number shown on the header cart icon. Only counts sessions still in the schedule. */
export async function getCartCount() {
  const [ids, sessions] = await Promise.all([readCartIds(), getSchedule()]);
  return ids.filter((id) => sessions.some((s) => s.id === id)).length;
}
