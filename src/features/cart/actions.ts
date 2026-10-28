"use server";

import { refresh } from "next/cache";

import { MAX_ORDER_ITEMS } from "@/features/checkout/schemas";
import { getSessionById } from "@/features/classes/server/queries";
import { requireUser } from "@/lib/auth/dal";

import { readCartIds, writeCartIds } from "./server/cart-cookie";
import type { CartActionResult } from "./types";

export async function addToCart(sessionId: string): Promise<CartActionResult> {
  // Server Actions are public endpoints: always re-check the user here, never trust the client.
  await requireUser();

  const session = await getSessionById(sessionId);
  if (!session) return { ok: false, message: "This class session is no longer available." };
  if (session.spotsLeft <= 0) return { ok: false, message: "Sorry, this class is full." };

  const ids = await readCartIds();
  if (ids.includes(sessionId)) return { ok: true, message: `${session.className} is already in your cart.` };
  if (ids.length >= MAX_ORDER_ITEMS) {
    return { ok: false, message: `Your cart can hold up to ${MAX_ORDER_ITEMS} classes. Check out or remove one first.` };
  }

  await writeCartIds([...ids, sessionId]);
  refresh();
  return { ok: true, message: `${session.className} added to your cart.` };
}

export async function removeFromCart(sessionId: string): Promise<CartActionResult> {
  await requireUser();
  await writeCartIds((await readCartIds()).filter((id) => id !== sessionId));
  refresh();
  return { ok: true, message: "Removed from your cart." };
}
