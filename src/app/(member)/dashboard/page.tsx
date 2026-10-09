import {
  ArrowRightIcon,
  CalendarCheckIcon,
  CalendarPlusIcon,
  CrownIcon,
  RefreshCwIcon,
  TrophyIcon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingCard } from "@/features/bookings/components/booking-card";
import { getMyBookings, splitBookings } from "@/features/bookings/server/queries";
import { getSchedule } from "@/features/classes/server/queries";
import { requireUser } from "@/lib/auth/dal";
import { formatDate, formatTime, toDateKey } from "@/lib/format";
import { createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({ title: "Dashboard", path: "/dashboard", noIndex: true });

export default function DashboardPage() {
  return (
    <Container className="space-y-8 py-10">
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </Container>
  );
}

function greeting(now: Date) {
  const hour = Number(new Intl.DateTimeFormat("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }).format(now));
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

async function Dashboard() {
  const user = await requireUser();
  const [bookings, schedule] = await Promise.all([getMyBookings(), getSchedule()]);

  const now = new Date();
  const { upcoming, history } = splitBookings(bookings, now.getTime());
  const attended = history.filter((b) => b.status === "attended").length;
  const todayKey = toDateKey(now.toISOString());
  const laterToday = schedule
    .filter((s) => toDateKey(s.startsAt) === todayKey && new Date(s.startsAt) > now)
    .slice(0, 4);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{formatDate(now.toISOString(), { weekday: "long", month: "long" })}</p>
          <h1 className="text-3xl font-bold tracking-tight">
            {greeting(now)}, {user.name.split(" ")[0]}
          </h1>
        </div>
        <Link href="/classes" className={buttonVariants({ size: "lg" })}>
          <CalendarPlusIcon data-icon="inline-start" />
          Book a class
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarCheckIcon} label="Upcoming bookings" value={upcoming.length} />
        <StatCard icon={TrophyIcon} label="Classes attended" value={attended} />
        <StatCard icon={CrownIcon} label="Membership" value={user.membership.planName} hint={user.membership.status} />
        <StatCard
          icon={RefreshCwIcon}
          label="Renews on"
          value={formatDate(user.membership.renewsOn, { weekday: undefined, year: "numeric" })}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Your upcoming classes</CardTitle>
            <CardDescription>Cancel up to the start time if your plans change.</CardDescription>
            <CardAction>
              <Link href="/bookings" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                View all
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.length === 0 ? (
              <EmptyState
                icon={CalendarPlusIcon}
                title="Nothing booked yet"
                description="Find a class that fits your week."
                action={
                  <Link href="/classes" className={buttonVariants()}>
                    Browse classes
                  </Link>
                }
              />
            ) : (
              upcoming.slice(0, 3).map((booking) => <BookingCard key={booking.id} booking={booking} canCancel />)
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Still on today</CardTitle>
            <CardDescription>Classes starting later today.</CardDescription>
          </CardHeader>
          <CardContent>
            {laterToday.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">That&apos;s it for today. See you tomorrow!</p>
            ) : (
              <ul className="divide-y">
                {laterToday.map((session) => (
                  <li key={session.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{session.className}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(session.startsAt)} · {session.trainerName}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 text-xs text-muted-foreground",
                        session.spotsLeft === 0 && "text-destructive",
                      )}
                    >
                      {session.spotsLeft === 0 ? "Full" : `${session.spotsLeft} spots`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/classes" className={cn(buttonVariants({ variant: "outline" }), "mt-4 w-full")}>
              Full schedule
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function StatCard({ icon: Icon, label, value, hint }: { icon: LucideIcon; label: string; value: React.ReactNode; hint?: string }) {
  return (
    <Card size="sm">
      <CardContent className="flex items-center gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="truncate font-heading text-xl font-bold">
            {value}
            {hint && <span className="ml-2 align-middle text-xs font-medium text-emerald-600 capitalize dark:text-emerald-400">{hint}</span>}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading dashboard">
      <Skeleton className="h-16 w-72" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <Skeleton className="h-80 lg:col-span-3" />
        <Skeleton className="h-80 lg:col-span-2" />
      </div>
    </div>
  );
}
