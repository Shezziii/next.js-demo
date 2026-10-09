import { CalendarIcon, MapPinIcon, UserIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/features/classes/components/category-badge";
import { formatDate, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { Booking, BookingStatus } from "../types";
import { CancelBookingButton } from "./cancel-booking-button";

const statusMeta: Record<BookingStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  confirmed: { label: "Confirmed", variant: "default" },
  attended: { label: "Attended", variant: "secondary" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export function BookingCard({ booking, canCancel = false }: { booking: Booking; canCancel?: boolean }) {
  const { session, status } = booking;
  // A confirmed booking in the past is shown as completed.
  const meta = status === "confirmed" && !canCancel ? { label: "Completed", variant: "secondary" as const } : statusMeta[status];

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:flex-row sm:items-center",
        status === "cancelled" && "opacity-70",
      )}
    >
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={cn("text-base font-semibold", status === "cancelled" && "line-through")}>{session.className}</h3>
          <CategoryBadge category={session.category} />
          <Badge variant={meta.variant}>{meta.label}</Badge>
        </div>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarIcon className="size-3.5" aria-hidden />
            {formatDate(session.startsAt)} · {formatTime(session.startsAt)}
          </span>
          <span className="flex items-center gap-1">
            <UserIcon className="size-3.5" aria-hidden />
            {session.trainerName}
          </span>
          <span className="flex items-center gap-1">
            <MapPinIcon className="size-3.5" aria-hidden />
            {session.room}
          </span>
        </p>
      </div>
      {canCancel && <CancelBookingButton booking={booking} className="self-start sm:self-center" />}
    </article>
  );
}
