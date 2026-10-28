import type { ClassSession } from "@/features/classes/types";

/** Why a class in the cart can't be paid for right now ("available" means it can). */
export type CartItemStatus = "available" | "full" | "started" | "booked";

export type CartItem = {
  session: ClassSession;
  status: CartItemStatus;
};

/** Result returned by cart Server Actions to the client. */
export type CartActionResult = { ok: true; message: string } | { ok: false; message: string };
