import { siteConfig } from "@/config/site";
import type { Money } from "@/types/common";

import type { OrderTotals } from "./types";

/** GST on fitness services in India. */
export const GST_RATE = 0.18;

/** Price breakdown for a set of drop-in classes. Used for display and recomputed on the server when charging. */
export function getOrderTotals(prices: Money[]): OrderTotals {
  const currency = prices[0]?.currency ?? siteConfig.currency;
  const subtotal = prices.reduce((sum, price) => sum + price.amount, 0);
  const tax = Math.round(subtotal * GST_RATE);
  return {
    subtotal: { amount: subtotal, currency },
    tax: { amount: tax, currency },
    total: { amount: subtotal + tax, currency },
  };
}
