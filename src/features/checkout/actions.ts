"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { env } from "@/config/env";
import { readCartIds, writeCartIds } from "@/features/cart/server/cart-cookie";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoint";
import { getErrorMessage, isApiError } from "@/lib/api/errors";
import { requireUser } from "@/lib/auth/dal";
import { cacheTags } from "@/lib/cache-tags";
import { mockApi } from "@/mocks/server";

import { checkoutSchema, sensitiveCheckoutFields, type CheckoutFormState } from "./schemas";
import type { Order, PaymentDetails } from "./types";

/** Form values as plain strings, minus card details, echoed back so a failed submit keeps what the user typed. */
function readSafeValues(formData: FormData) {
  const values: Record<string, string> = {};
  for (const [key, value] of formData) {
    if (typeof value !== "string" || key.startsWith("$")) continue;
    if ((sensitiveCheckoutFields as readonly string[]).includes(key)) continue;
    values[key] = value;
  }
  return values;
}

export async function placeOrder(prev: CheckoutFormState, formData: FormData): Promise<CheckoutFormState> {
  // Server Actions are public endpoints: always re-check the user here, never trust the client.
  const user = await requireUser();
  const attempt = prev.attempt + 1;
  const values = readSafeValues(formData);

  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    // sessionIds is a hidden field, so its errors would otherwise be invisible.
    const message = fieldErrors.sessionIds ? "Your cart changed. Go back to your cart and try again." : undefined;
    return { status: "error", attempt, values, message, fieldErrors };
  }

  const { sessionIds, name, email, phone } = parsed.data;
  const payment: PaymentDetails =
    parsed.data.paymentMethod === "card"
      ? { method: "card", cardNumber: parsed.data.cardNumber, expiry: parsed.data.cardExpiry, cvc: parsed.data.cardCvc }
      : { method: "upi", upiId: parsed.data.upiId };
  // Prices are never sent from the browser: the backend charges what the sessions cost.
  const input = { sessionIds, attendee: { name, email, phone }, payment };

  let order: Order;
  try {
    // Real gateway: collect card details with the provider's hosted fields (Razorpay, Stripe…) and send
    // only its payment token here, so raw card numbers never touch this server.
    order = env.USE_MOCK_API
      ? await mockApi.createOrder(user.id, input)
      : await apiClient.post<Order>(endpoints.orders.create, input);
  } catch (error) {
    // Expected API failures (class full, already booked…) carry a user-facing message; log anything else.
    if (!isApiError(error)) console.error("[checkout] placeOrder failed", error);
    return { status: "error", attempt, values, message: getErrorMessage(error) };
  }

  // Paid classes leave the cart; anything added in another tab meanwhile stays.
  await writeCartIds((await readCartIds()).filter((id) => !sessionIds.includes(id)));
  // Fewer spots left in the timetable.
  updateTag(cacheTags.schedule);
  redirect(`/orders/${order.id}`);
}
