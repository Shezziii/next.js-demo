"use server";

import { refresh, updateTag } from "next/cache";

import { env } from "@/config/env";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoint";
import { getErrorMessage } from "@/lib/api/errors";
import { requireUser } from "@/lib/auth/dal";
import { cacheTags } from "@/lib/cache-tags";
import { mockApi } from "@/mocks/server";

import type { BookingActionResult } from "./types";

/** Refresh the cached schedule (spots left) and the uncached per-user booking lists. */
function revalidateBookings() {
  updateTag(cacheTags.schedule);
  refresh();
}

// New bookings are created by paying for them: see placeOrder in features/checkout/actions.ts.

export async function cancelBooking(bookingId: string): Promise<BookingActionResult> {
  // Server Actions are public endpoints: always re-check the user here, never trust the client.
  const user = await requireUser();

  try {
    if (env.USE_MOCK_API) await mockApi.cancelBooking(user.id, bookingId);
    else await apiClient.delete(endpoints.bookings.cancel(bookingId));
    revalidateBookings();
    return { ok: true, message: "Booking cancelled." };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error) };
  }
}
