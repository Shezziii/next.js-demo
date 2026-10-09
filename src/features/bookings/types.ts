import type { ClassSession } from "@/features/classes/types";
import type { ID, ISODateString } from "@/types/common";

export type BookingStatus = "confirmed" | "cancelled" | "attended";

export type Booking = {
  id: ID;
  status: BookingStatus;
  bookedAt: ISODateString;
  /** Snapshot of the session at booking time, so the list needs no extra lookups. */
  session: Pick<
    ClassSession,
    "id" | "className" | "category" | "trainerName" | "room" | "startsAt" | "durationMinutes"
  >;
};

/** Result returned by booking Server Actions to the client. */
export type BookingActionResult = { ok: true; message: string } | { ok: false; message: string };
