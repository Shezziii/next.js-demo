"use client";

import { CalendarXIcon } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { ClassSession } from "../types";
import { SessionCard } from "./session-card";

export type ScheduleDay = {
  key: string;
  /** e.g. "Today", "Fri" */
  label: string;
  /** e.g. "10 Oct" */
  sublabel: string;
  sessions: ClassSession[];
};

type ScheduleTabsProps = {
  days: ScheduleDay[];
  bookedSessionIds: string[];
  isAuthenticated: boolean;
  showClassLink?: boolean;
};

/** Day-by-day timetable. Data is prepared on the server; this only handles tab switching. */
export function ScheduleTabs({ days, bookedSessionIds, isAuthenticated, showClassLink }: ScheduleTabsProps) {
  const booked = new Set(bookedSessionIds);

  return (
    <Tabs defaultValue={days[0]?.key}>
      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <TabsList className="h-auto! w-max">
          {days.map((day) => (
            <TabsTrigger key={day.key} value={day.key} className="flex-col gap-0 px-4 py-1.5">
              <span className="font-semibold">{day.label}</span>
              <span className="text-xs font-normal opacity-70">{day.sublabel}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {days.map((day) => (
        <TabsContent key={day.key} value={day.key} className="mt-4 space-y-3">
          {day.sessions.length === 0 ? (
            <EmptyState
              icon={CalendarXIcon}
              title="No more classes this day"
              description="Pick another day to see what's on."
            />
          ) : (
            day.sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isBooked={booked.has(session.id)}
                isAuthenticated={isAuthenticated}
                showClassLink={showClassLink}
              />
            ))
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
