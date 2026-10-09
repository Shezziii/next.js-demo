import "server-only";

import { formatDate, toDateKey } from "@/lib/format";

import type { ScheduleDay } from "../components/schedule-tabs";
import type { ClassSession } from "../types";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Groups future sessions into one tab per day, labelled "Today", "Tomorrow", then weekday names. */
export function groupSessionsByDay(sessions: ClassSession[], now = Date.now()): ScheduleDay[] {
  const today = toDateKey(new Date(now).toISOString());
  const tomorrow = toDateKey(new Date(now + DAY_MS).toISOString());
  const days = new Map<string, ScheduleDay>();

  for (const session of sessions) {
    const key = toDateKey(session.startsAt);
    if (!days.has(key)) {
      const label =
        key === today ? "Today" : key === tomorrow ? "Tomorrow" : formatDate(session.startsAt, { day: undefined, month: undefined });
      days.set(key, { key, label, sublabel: formatDate(session.startsAt, { weekday: undefined }), sessions: [] });
    }
    // Keep today's tab even if every class has started, so the schedule always opens on today.
    if (new Date(session.startsAt).getTime() > now) days.get(key)!.sessions.push(session);
  }

  return [...days.values()];
}
