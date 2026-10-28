import { getBookingContext } from "@/features/bookings/server/queries";
import { readCartIds } from "@/features/cart/server/cart-cookie";

import { getSchedule } from "../server/queries";
import { groupSessionsByDay } from "../server/schedule-days";
import { ScheduleTabs } from "./schedule-tabs";

/**
 * Bookable timetable. Reads the session (optional), so render it inside <Suspense>.
 * Pass `classSlug` to show only one class's sessions (class detail page).
 */
export async function LiveSchedule({ classSlug }: { classSlug?: string }) {
  const [sessions, viewer, cartIds] = await Promise.all([getSchedule(), getBookingContext(), readCartIds()]);
  const filtered = classSlug ? sessions.filter((s) => s.classSlug === classSlug) : sessions;

  return (
    <ScheduleTabs
      days={groupSessionsByDay(filtered)}
      bookedSessionIds={viewer.bookedSessionIds}
      cartSessionIds={cartIds}
      isAuthenticated={viewer.isAuthenticated}
      showClassLink={!classSlug}
    />
  );
}
