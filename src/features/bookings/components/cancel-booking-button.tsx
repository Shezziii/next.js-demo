"use client";

import { CalendarXIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";

import { cancelBooking } from "../actions";
import type { Booking } from "../types";
import { SessionSummary } from "./session-summary";

export function CancelBookingButton({ booking, className }: { booking: Booking; className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="destructive" size="sm" className={className} onClick={() => setOpen(true)}>
        <XIcon data-icon="inline-start" />
        Cancel
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        variant="destructive"
        icon={CalendarXIcon}
        title="Cancel this booking?"
        description="Your spot will be released to other members."
        confirmLabel="Yes, cancel booking"
        cancelLabel="Keep booking"
        pendingLabel="Cancelling…"
        onConfirm={async () => {
          const result = await cancelBooking(booking.id);
          if (result.ok) toast.success(result.message);
          else toast.error(result.message);
          return result.ok;
        }}
      >
        <SessionSummary session={booking.session} />
      </ConfirmDialog>
    </>
  );
}
