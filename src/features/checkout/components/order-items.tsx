import type { ClassSession } from "@/features/classes/types";
import { formatDate, formatMoney, formatTime } from "@/lib/format";
import type { Money } from "@/types/common";

type OrderItemsProps = {
  items: { session: Pick<ClassSession, "id" | "className" | "startsAt" | "trainerName" | "room">; price: Money }[];
};

/** Compact list of the classes being bought, used in the checkout summary and on the receipt. */
export function OrderItems({ items }: OrderItemsProps) {
  return (
    <ul className="divide-y text-sm">
      {items.map(({ session, price }) => (
        <li key={session.id} className="flex justify-between gap-4 py-3 first:pt-0 last:pb-0">
          <div className="min-w-0">
            <p className="font-semibold">{session.className}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(session.startsAt)} · {formatTime(session.startsAt)} · {session.room}
            </p>
          </div>
          <p className="shrink-0 font-medium">{formatMoney(price)}</p>
        </li>
      ))}
    </ul>
  );
}
