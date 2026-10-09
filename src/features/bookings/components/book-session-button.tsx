"use client";

import { CalendarCheckIcon, CheckIcon, LockKeyholeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusDialog } from "@/components/shared/status-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import type { ClassSession } from "@/features/classes/types";

import { bookSession } from "../actions";
import { SessionSummary } from "./session-summary";

type BookSessionButtonProps = {
  session: ClassSession;
  isBooked: boolean;
  /** Guests see a "log in to book" modal instead of the booking confirmation. */
  isAuthenticated: boolean;
  className?: string;
};

export function BookSessionButton({ session, isBooked, isAuthenticated, className }: BookSessionButtonProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isFull = session.spotsLeft <= 0;

  if (isBooked) {
    return (
      <Button variant="secondary" disabled className={className}>
        <CheckIcon data-icon="inline-start" />
        Booked
      </Button>
    );
  }

  return (
    <>
      <Button className={className} disabled={isFull} onClick={() => setOpen(true)}>
        {isFull ? "Class full" : "Book"}
      </Button>

      {isAuthenticated ? (
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          icon={CalendarCheckIcon}
          title="Confirm your booking"
          description="You can cancel any time before the class starts."
          confirmLabel="Confirm booking"
          pendingLabel="Booking…"
          onConfirm={async () => {
            const result = await bookSession(session.id);
            if (result.ok) toast.success(result.message);
            else toast.error(result.message);
            return result.ok;
          }}
        >
          <SessionSummary session={session} />
        </ConfirmDialog>
      ) : (
        <StatusDialog
          open={open}
          onOpenChange={setOpen}
          icon={LockKeyholeIcon}
          title="Log in to book"
          description={`Members can reserve a spot in ${session.className} in a couple of taps.`}
          actions={
            <>
              <Link href="/register" className={buttonVariants({ variant: "outline" })}>
                Become a member
              </Link>
              <Link href={`/login?from=${encodeURIComponent(pathname)}`} className={buttonVariants()}>
                Log in
              </Link>
            </>
          }
        >
          <SessionSummary session={session} />
        </StatusDialog>
      )}
    </>
  );
}
