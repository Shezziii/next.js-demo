import "server-only";

import { env } from "@/config/env";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoint";
import { getCurrentUser, requireUser } from "@/lib/auth/dal";
import { mockApi } from "@/mocks/server";

import type { Booking } from "../types";

/**
 * The signed-in member's bookings. Personal and frequently changing, so not cached.
 * The user comes from the DAL, never from an argument, so callers can't request someone else's data.
 */
export async function getMyBookings(): Promise<Booking[]> {
  const user = await requireUser();
  if (env.USE_MOCK_API) return mockApi.listBookings(user.id);
  // Real backend: pass the member's access token (stored in the session) as `token`.
  return apiClient.get<Booking[]>(endpoints.bookings.list);
}

/** Splits bookings into upcoming (confirmed, in the future) and history (everything else). */
export function splitBookings(bookings: Booking[], now = Date.now()) {
  const upcoming: Booking[] = [];
  const history: Booking[] = [];
  for (const booking of bookings) {
    const isFuture = new Date(booking.session.startsAt).getTime() > now;
    (booking.status === "confirmed" && isFuture ? upcoming : history).push(booking);
  }
  return { upcoming, history: history.reverse() };
}

/** Who is looking at the schedule: guests can browse, members also see what they've booked. */
export async function getBookingContext() {
  const user = await getCurrentUser();
  if (!user) return { isAuthenticated: false, bookedSessionIds: [] as string[] };
  const { upcoming } = splitBookings(await getMyBookings());
  return { isAuthenticated: true, bookedSessionIds: upcoming.map((b) => b.session.id) };
}
