import { CalendarPlusIcon, HistoryIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { PageTitle } from "@/components/shared/page-title";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingCard } from "@/features/bookings/components/booking-card";
import { getMyBookings, splitBookings } from "@/features/bookings/server/queries";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "My bookings", path: "/bookings", noIndex: true });

export default function BookingsPage() {
  return (
    <Container className="space-y-6 py-10">
      <PageTitle
        title="My bookings"
        description="Your upcoming classes and booking history."
        actions={
          <Link href="/classes" className={buttonVariants()}>
            <CalendarPlusIcon data-icon="inline-start" />
            Book a class
          </Link>
        }
      />
      <Suspense fallback={<BookingsSkeleton />}>
        <BookingsList />
      </Suspense>
    </Container>
  );
}

async function BookingsList() {
  const { upcoming, history } = splitBookings(await getMyBookings());

  return (
    <Tabs defaultValue="upcoming">
      <TabsList>
        <TabsTrigger value="upcoming" className="px-4">
          Upcoming ({upcoming.length})
        </TabsTrigger>
        <TabsTrigger value="history" className="px-4">
          History ({history.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="mt-4 space-y-3">
        {upcoming.length === 0 ? (
          <EmptyState
            icon={CalendarPlusIcon}
            title="No upcoming classes"
            description="Book a class and it will show up here."
            action={
              <Link href="/classes" className={buttonVariants()}>
                Browse classes
              </Link>
            }
          />
        ) : (
          upcoming.map((booking) => <BookingCard key={booking.id} booking={booking} canCancel />)
        )}
      </TabsContent>

      <TabsContent value="history" className="mt-4 space-y-3">
        {history.length === 0 ? (
          <EmptyState icon={HistoryIcon} title="No history yet" description="Classes you've attended will appear here." />
        ) : (
          history.map((booking) => <BookingCard key={booking.id} booking={booking} />)
        )}
      </TabsContent>
    </Tabs>
  );
}

function BookingsSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading bookings">
      <Skeleton className="h-8 w-64" />
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} className="h-20" />
      ))}
    </div>
  );
}
