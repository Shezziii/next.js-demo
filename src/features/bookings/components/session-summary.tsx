import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon } from "lucide-react";

import type { ClassSession } from "@/features/classes/types";
import { formatDate, formatDuration, formatTime } from "@/lib/format";

type SessionSummaryProps = {
  session: Pick<ClassSession, "className" | "startsAt" | "durationMinutes" | "trainerName" | "room">;
};

/** Compact details card used inside booking/cancel modals. */
export function SessionSummary({ session }: SessionSummaryProps) {
  const rows = [
    { icon: CalendarIcon, text: formatDate(session.startsAt, { weekday: "long", month: "long" }) },
    { icon: ClockIcon, text: `${formatTime(session.startsAt)} · ${formatDuration(session.durationMinutes)}` },
    { icon: UserIcon, text: session.trainerName },
    { icon: MapPinIcon, text: session.room },
  ];

  return (
    <div className="rounded-lg bg-muted/60 p-3 text-sm">
      <p className="mb-2 font-heading font-bold">{session.className}</p>
      <ul className="grid gap-1.5 text-muted-foreground sm:grid-cols-2">
        {rows.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-2">
            <Icon className="size-4 shrink-0 text-primary" aria-hidden />
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
