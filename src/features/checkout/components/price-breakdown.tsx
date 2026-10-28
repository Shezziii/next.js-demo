import { Separator } from "@/components/ui/separator";
import { formatMoney } from "@/lib/format";

import { GST_RATE } from "../pricing";
import type { OrderTotals } from "../types";

/** Subtotal, GST and total lines, used in the checkout summary and on the receipt. */
export function PriceBreakdown({ totals, itemCount }: { totals: OrderTotals; itemCount: number }) {
  const rows = [
    { label: `${itemCount} drop-in ${itemCount === 1 ? "class" : "classes"}`, value: totals.subtotal },
    { label: `GST (${GST_RATE * 100}%)`, value: totals.tax },
  ];

  return (
    <dl className="text-sm">
      <div className="space-y-2">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{label}</dt>
            <dd>{formatMoney(value)}</dd>
          </div>
        ))}
      </div>
      <Separator className="my-3" />
      <div className="flex items-baseline justify-between gap-4">
        <dt className="font-semibold">Total</dt>
        <dd className="font-heading text-2xl font-bold">{formatMoney(totals.total)}</dd>
      </div>
    </dl>
  );
}
