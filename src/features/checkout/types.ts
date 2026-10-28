import type { Booking } from "@/features/bookings/types";
import type { ID, ISODateString, Money } from "@/types/common";

export type PaymentMethod = "card" | "upi";

export type OrderTotals = {
  subtotal: Money;
  tax: Money;
  total: Money;
};

/** One class in an order. Paying creates its booking. */
export type OrderItem = {
  bookingId: ID;
  /** Snapshot of the session at purchase time, same shape as a booking's. */
  session: Booking["session"];
  price: Money;
};

/** A paid purchase of one or more drop-in classes. */
export type Order = OrderTotals & {
  id: ID;
  status: "paid";
  createdAt: ISODateString;
  items: OrderItem[];
  attendee: { name: string; email: string; phone: string };
  /** Safe-to-show description of how it was paid, e.g. "Visa •••• 4242" or "you@okhdfc". */
  payment: { method: PaymentMethod; label: string };
};

/** Payment details as the gateway receives them. Never stored or echoed back to the browser. */
export type PaymentDetails =
  | { method: "card"; cardNumber: string; expiry: string; cvc: string }
  | { method: "upi"; upiId: string };
