import { z } from "zod";

import { contactFields } from "@/features/enquiries/schemas";

/** Most classes one order (and the cart) can hold. */
export const MAX_ORDER_ITEMS = 10;

const digitsOnly = (v: string) => v.replace(/[\s-]/g, "");

const details = {
  ...contactFields,
  /** Comma-separated session ids: exactly what the member saw on the checkout page. */
  sessionIds: z
    .string()
    .transform((v) => [...new Set(v.split(",").filter(Boolean))])
    .pipe(z.array(z.string()).min(1, "Your cart is empty.").max(MAX_ORDER_ITEMS)),
  terms: z.literal("on", "Please accept the booking terms to continue."),
};

// Payments are simulated, so card fields only need to be numbers. Add real checks with a real gateway.
const cardPayment = z.object({
  ...details,
  paymentMethod: z.literal("card"),
  cardNumber: z.string().transform(digitsOnly).pipe(z.string().regex(/^\d+$/, "Enter your card number (numbers only).")),
  cardExpiry: z.string().trim().regex(/^[\d/]+$/, "Enter the expiry date (MM/YY)."),
  cardCvc: z.string().trim().regex(/^\d+$/, "Enter the security code (numbers only)."),
});

const upiPayment = z.object({
  ...details,
  paymentMethod: z.literal("upi"),
  upiId: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[\w.-]{2,256}@[a-z]{2,64}$/, "Enter a valid UPI ID, e.g. name@okhdfc."),
});

export const checkoutSchema = z.discriminatedUnion("paymentMethod", [cardPayment, upiPayment], "Choose a payment method.");

export type CheckoutInput = z.infer<typeof checkoutSchema>;

/** Card fields are never echoed back to the browser, so a failed attempt asks for them again. */
export const sensitiveCheckoutFields = ["cardNumber", "cardExpiry", "cardCvc"] as const;

export type CheckoutFormState = {
  status: "idle" | "error";
  message?: string;
  /** Echo submitted values (minus card details) so fields survive a failed attempt. */
  values?: Record<string, string>;
  fieldErrors?: Record<string, string[] | undefined>;
  /** Increments on every submit; the form uses it as a key to remount with fresh values. */
  attempt: number;
};
