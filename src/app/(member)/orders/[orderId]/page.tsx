import { CircleCheckBigIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderItems } from "@/features/checkout/components/order-items";
import { PriceBreakdown } from "@/features/checkout/components/price-breakdown";
import { getMyOrder } from "@/features/checkout/server/queries";
import { formatDate, formatTime } from "@/lib/format";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Booking confirmed", path: "/orders", noIndex: true });

/** Where checkout lands after a successful payment. Also works as a receipt to come back to. */
export default function OrderPage({ params }: PageProps<"/orders/[orderId]">) {
  return (
    <Container className="max-w-2xl py-10">
      <Suspense fallback={<OrderSkeleton />}>
        {params.then(({ orderId }) => (
          <OrderConfirmation orderId={orderId} />
        ))}
      </Suspense>
    </Container>
  );
}

async function OrderConfirmation({ orderId }: { orderId: string }) {
  const order = await getMyOrder(orderId);
  if (!order) notFound();

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CircleCheckBigIcon className="size-8" aria-hidden />
        </span>
        <h1 className="text-3xl font-bold tracking-tight">You&apos;re booked!</h1>
        <p className="max-w-md text-balance text-muted-foreground">
          Payment received and{" "}
          {order.items.length === 1
            ? `your spot in ${order.items[0].session.className} is confirmed`
            : `your spots in ${order.items.length} classes are confirmed`}
          . See you there, {order.attendee.name.split(" ")[0]}!
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg font-bold">Order {order.id.toUpperCase()}</CardTitle>
          <CardDescription>
            Paid {formatDate(order.createdAt)} at {formatTime(order.createdAt)} · {order.payment.label}
          </CardDescription>
          <CardAction>
            <Badge>Paid</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-5">
          <OrderItems items={order.items} />
          <PriceBreakdown totals={order} itemCount={order.items.length} />
          <p className="text-xs text-muted-foreground">
            Booked for {order.attendee.name} · {order.attendee.email} · {order.attendee.phone}
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
        <Link href="/classes" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Browse more classes
        </Link>
        <Link href="/bookings" className={buttonVariants({ size: "lg" })}>
          View my bookings
        </Link>
      </div>
    </div>
  );
}

function OrderSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading your booking">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-80" />
      </div>
      <Skeleton className="h-80" />
    </div>
  );
}
