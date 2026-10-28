import "server-only";

import type { Booking } from "@/features/bookings/types";
import { getOrderTotals } from "@/features/checkout/pricing";
import type { Order, PaymentDetails } from "@/features/checkout/types";
import type { ClassSession } from "@/features/classes/types";
import type { Enquiry } from "@/features/enquiries/types";
import { ApiError } from "@/lib/api/errors";
import { formatDate, formatTime, toDateKey } from "@/lib/format";

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
      price: gymClass.price,
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

type MockDb = { bookings: Map<string, Booking[]>; orders: Map<string, Order[]>; enquiries: Enquiry[] };
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
    orders: new Map(),
    enquiries: [],
  };
}

function db() {
  const db = (store.__goldsGymMockDb ??= seed());
  db.enquiries ??= []; // stores created before enquiries existed (dev hot reload)
  db.orders ??= new Map();
  return db;
}

/** Throws the same errors the backend would if this member can't book this session right now. */
function assertBookable(userId: string, sessionId: string) {
  const session = findSession(sessionId);
  if (!session) throw new ApiError("One of these class sessions no longer exists.", { status: 404, code: "NOT_FOUND" });
  // Orders can hold several classes, so say which one is the problem.
  const name = `${session.className} on ${formatDate(session.startsAt)} at ${formatTime(session.startsAt)}`;
  if (new Date(session.startsAt).getTime() <= Date.now())
    throw new ApiError(`${name} has already started.`, { status: 422, code: "SESSION_STARTED" });
  if ((db().bookings.get(userId) ?? []).some((b) => b.session.id === sessionId && b.status === "confirmed"))
    throw new ApiError(`You've already booked ${name}.`, { status: 409, code: "ALREADY_BOOKED" });
  if (session.spotsLeft <= 0) throw new ApiError(`Sorry, ${name} is full.`, { status: 409, code: "CLASS_FULL" });
  return session;
}

// ---------------------------------------------------------------------------
// Payment gateway stand-in
// ---------------------------------------------------------------------------

function cardBrand(cardNumber: string) {
  if (cardNumber.startsWith("4")) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(cardNumber)) return "Mastercard";
  if (/^3[47]/.test(cardNumber)) return "Amex";
  if (/^(60|65|81|82|508)/.test(cardNumber)) return "RuPay";
  return "Card";
}

/** Pretends to charge the member (always succeeds). Returns a label that is safe to store and show. */
function charge(payment: PaymentDetails) {
  if (payment.method === "upi") return payment.upiId;
  return `${cardBrand(payment.cardNumber)} •••• ${payment.cardNumber.slice(-4)}`;
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

  /**
   * Checks every session, charges once for all of them, then books the spots. All or nothing:
   * if any class can't be booked, nothing is charged. Prices always come from the server.
   */
  createOrder: async (
    userId: string,
    input: { sessionIds: string[]; attendee: Order["attendee"]; payment: PaymentDetails },
  ): Promise<Order> => {
    if (input.sessionIds.length === 0) throw new ApiError("Your cart is empty.", { status: 422, code: "EMPTY_ORDER" });
    const sessions = input.sessionIds.map((id) => assertBookable(userId, id));
    const paymentLabel = charge(input.payment);

    const bookings = sessions.map((session) => toBooking(session, "confirmed"));
    db().bookings.set(userId, [...(db().bookings.get(userId) ?? []), ...bookings]);

    const order: Order = {
      id: `ord_${hash(`${bookings[0].id}${Date.now()}`).toString(36)}`,
      status: "paid",
      createdAt: new Date().toISOString(),
      items: bookings.map((booking, i) => ({ bookingId: booking.id, session: booking.session, price: sessions[i].price })),
      attendee: input.attendee,
      payment: { method: input.payment.method, label: paymentLabel },
      ...getOrderTotals(sessions.map((s) => s.price)),
    };
    db().orders.set(userId, [...(db().orders.get(userId) ?? []), order]);
    return order;
  },

  getOrder: async (userId: string, orderId: string) => {
    const order = db().orders.get(userId)?.find((o) => o.id === orderId);
    if (!order) throw new ApiError("Order not found.", { status: 404, code: "NOT_FOUND" });
    return order;
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
