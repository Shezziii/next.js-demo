import "server-only";

import type { Booking } from "@/features/bookings/types";
import type { ClassSession } from "@/features/classes/types";
import type { Enquiry } from "@/features/enquiries/types";
import { ApiError } from "@/lib/api/errors";
import { toDateKey } from "@/lib/format";

import { classes, plans, rooms, trainers, weeklyTimetable } from "./data";

/**
 * In-memory mock backend, used while USE_MOCK_API=true.
 * Each function mirrors one backend endpoint and throws ApiError the same way the real client would,
 * so feature code is identical in both modes. Data resets when the server restarts.
 */

const DAY_MS = 24 * 60 * 60 * 1000;
const IST_OFFSET = "+05:30";

// ---------------------------------------------------------------------------
// Schedule
// ---------------------------------------------------------------------------

/** Small deterministic hash so "already booked" numbers look realistic but stay stable. */
function hash(value: string) {
  let h = 0;
  for (const char of value) h = (h * 31 + char.charCodeAt(0)) | 0;
  return Math.abs(h);
}

function sessionsForDay(dateKey: string): Omit<ClassSession, "spotsLeft">[] {
  const weekday = new Date(`${dateKey}T12:00:00${IST_OFFSET}`).getUTCDay();
  return weeklyTimetable[weekday].map((slot) => {
    const gymClass = classes.find((c) => c.slug === slot.classSlug)!;
    const trainer = trainers.find((t) => t.id === gymClass.trainerId)!;
    return {
      id: `${gymClass.slug}_${dateKey}_${slot.time.replace(":", "")}`,
      classId: gymClass.id,
      classSlug: gymClass.slug,
      className: gymClass.name,
      category: gymClass.category,
      level: gymClass.level,
      trainerName: trainer.name,
      room: slot.room,
      startsAt: `${dateKey}T${slot.time}:00${IST_OFFSET}`,
      durationMinutes: gymClass.durationMinutes,
      capacity: rooms[slot.room],
    };
  });
}

function withAvailability(session: Omit<ClassSession, "spotsLeft">): ClassSession {
  // Roughly 1 in 9 sessions is pre-filled to show the "full" state.
  const h = hash(session.id);
  const walkIns = h % 9 === 0 ? session.capacity : h % Math.ceil(session.capacity * 0.7);
  const memberBookings = [...db().bookings.values()]
    .flat()
    .filter((b) => b.session.id === session.id && b.status === "confirmed").length;
  return { ...session, spotsLeft: Math.max(0, session.capacity - walkIns - memberBookings) };
}

function dateKeysFrom(from: Date, days: number) {
  return Array.from({ length: days }, (_, i) => toDateKey(new Date(from.getTime() + i * DAY_MS).toISOString()));
}

function findSession(sessionId: string) {
  const dateKey = sessionId.split("_")[1];
  if (!dateKey || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return null;
  const session = sessionsForDay(dateKey).find((s) => s.id === sessionId);
  return session ? withAvailability(session) : null;
}

// ---------------------------------------------------------------------------
// Bookings store (kept on globalThis so it survives dev hot reloads)
// ---------------------------------------------------------------------------

type MockDb = { bookings: Map<string, Booking[]>; enquiries: Enquiry[] };
const store = globalThis as typeof globalThis & { __goldsGymMockDb?: MockDb };

function toBooking(session: ClassSession | Omit<ClassSession, "spotsLeft">, status: Booking["status"]): Booking {
  const { id, className, category, trainerName, room, startsAt, durationMinutes } = session;
  return {
    id: `bkg_${hash(`${id}${Date.now()}${Math.random()}`).toString(36)}`,
    status,
    bookedAt: new Date().toISOString(),
    session: { id, className, category, trainerName, room, startsAt, durationMinutes },
  };
}

/** Seed the demo member with some history so the dashboard isn't empty on first login. */
function seed(): MockDb {
  const now = Date.now();
  const evening = (daysAgo: number) =>
    sessionsForDay(toDateKey(new Date(now - daysAgo * DAY_MS).toISOString())).at(-2)!;
  const upcoming = sessionsForDay(toDateKey(new Date(now + DAY_MS).toISOString()))[0];

  return {
    bookings: new Map([
      ["usr_001", [toBooking(upcoming, "confirmed"), ...[2, 4, 7, 9].map((d) => toBooking(evening(d), "attended"))]],
    ]),
    enquiries: [],
  };
}

function db() {
  const db = (store.__goldsGymMockDb ??= seed());
  db.enquiries ??= []; // stores created before enquiries existed (dev hot reload)
  return db;
}

// ---------------------------------------------------------------------------
// "Endpoints"
// ---------------------------------------------------------------------------

export const mockApi = {
  listClasses: async () => classes,
  listTrainers: async () => trainers,
  listPlans: async () => plans,

  listSessions: async ({ from, days }: { from: Date; days: number }) =>
    dateKeysFrom(from, days).flatMap((key) => sessionsForDay(key).map(withAvailability)),

  listBookings: async (userId: string) =>
    [...(db().bookings.get(userId) ?? [])].sort((a, b) => a.session.startsAt.localeCompare(b.session.startsAt)),

  createBooking: async (userId: string, sessionId: string) => {
    const session = findSession(sessionId);
    if (!session) throw new ApiError("This class session no longer exists.", { status: 404, code: "NOT_FOUND" });
    if (new Date(session.startsAt).getTime() <= Date.now())
      throw new ApiError("This class has already started.", { status: 422, code: "SESSION_STARTED" });

    const bookings = db().bookings.get(userId) ?? [];
    if (bookings.some((b) => b.session.id === sessionId && b.status === "confirmed"))
      throw new ApiError("You've already booked this class.", { status: 409, code: "ALREADY_BOOKED" });
    if (session.spotsLeft <= 0)
      throw new ApiError("Sorry, this class is full.", { status: 409, code: "CLASS_FULL" });

    const booking = toBooking(session, "confirmed");
    db().bookings.set(userId, [...bookings, booking]);
    return booking;
  },

  createEnquiry: async (input: Omit<Enquiry, "id" | "createdAt">): Promise<Enquiry> => {
    const enquiry = { ...input, id: `enq_${hash(`${input.email}${Date.now()}`).toString(36)}`, createdAt: new Date().toISOString() };
    db().enquiries.push(enquiry);
    console.info("[mock] new enquiry", enquiry);
    return enquiry;
  },

  cancelBooking: async (userId: string, bookingId: string) => {
    const bookings = db().bookings.get(userId) ?? [];
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking || booking.status !== "confirmed")
      throw new ApiError("Booking not found.", { status: 404, code: "NOT_FOUND" });
    if (new Date(booking.session.startsAt).getTime() <= Date.now())
      throw new ApiError("Past bookings can't be cancelled.", { status: 422, code: "SESSION_STARTED" });

    booking.status = "cancelled";
    return booking;
  },
};
