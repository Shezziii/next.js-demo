import { ArrowRightIcon, CalendarPlusIcon, MapPinIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { PageTitle } from "@/components/shared/page-title";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RemoveFromCartButton } from "@/features/cart/components/remove-from-cart-button";
import { getCart } from "@/features/cart/server/queries";
import type { CartItem, CartItemStatus } from "@/features/cart/types";
import { PriceBreakdown } from "@/features/checkout/components/price-breakdown";
import { CategoryBadge } from "@/features/classes/components/category-badge";
import { formatDate, formatDuration, formatMoney, formatTime } from "@/lib/format";
import { createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({ title: "Your cart", path: "/cart", noIndex: true });

const statusLabels: Record<Exclude<CartItemStatus, "available">, string> = {
  full: "Class full",
  started: "Already started",
  booked: "Already booked",
};

export default function CartPage() {
  return (
    <Container className="space-y-8 py-10">
      <PageTitle
        title="Your cart"
        description="Classes waiting to be paid for. Spots are only held once you check out."
        actions={
          <Link href="/classes#schedule" className={buttonVariants({ variant: "outline" })}>
            <CalendarPlusIcon data-icon="inline-start" />
            Add more classes
          </Link>
        }
      />
      <Suspense fallback={<CartSkeleton />}>
        <Cart />
      </Suspense>
    </Container>
  );
}

async function Cart() {
  const { items, totals, canCheckout } = await getCart();

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCartIcon}
        title="Your cart is empty"
        description="Add classes from the timetable and pay for them all in one go."
        action={
          <Link href="/classes#schedule" className={buttonVariants()}>
            Browse the timetable
          </Link>
        }
      />
    );
  }

  const payable = items.filter((item) => item.status === "available").length;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
      <ul className="space-y-3">
        {items.map((item) => (
          <CartRow key={item.session.id} item={item} />
        ))}
      </ul>

      <Card className="lg:sticky lg:top-24">
        <CardHeader>
          <CardTitle className="font-heading text-lg font-bold">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <PriceBreakdown totals={totals} itemCount={payable} />
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-3 border-t bg-transparent">
          {!canCheckout && (
            <p className="text-sm text-destructive">Remove the classes that can&apos;t be booked to continue.</p>
          )}
          <Link
            href="/checkout"
            aria-disabled={!canCheckout}
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 text-base",
              !canCheckout && "pointer-events-none opacity-50",
            )}
            tabIndex={canCheckout ? undefined : -1}
          >
            Checkout
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

function CartRow({ item: { session, status } }: { item: CartItem }) {
  const blocked = status !== "available";

  return (
    <li
      className={cn(
        "flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:flex-row sm:items-center",
        blocked && "ring-destructive/40",
      )}
    >
      <div className="flex shrink-0 items-baseline gap-2 sm:w-28 sm:flex-col sm:gap-0">
        <p className="font-heading text-xl font-bold">{formatTime(session.startsAt)}</p>
        <p className="text-xs text-muted-foreground">{formatDate(session.startsAt)}</p>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-semibold">
            <Link href={`/classes/${session.classSlug}`} className="hover:text-primary hover:underline">
              {session.className}
            </Link>
          </h2>
          <CategoryBadge category={session.category} />
          {blocked && <Badge variant="destructive">{statusLabels[status]}</Badge>}
        </div>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <UserIcon className="size-3.5" aria-hidden />
            {session.trainerName}
          </span>
          <span className="flex items-center gap-1">
            <MapPinIcon className="size-3.5" aria-hidden />
            {session.room}
          </span>
          <span>{formatDuration(session.durationMinutes)}</span>
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <p className={cn("font-semibold", blocked && "text-muted-foreground line-through")}>
          {formatMoney(session.price)}
        </p>
        <RemoveFromCartButton sessionId={session.id} />
      </div>
    </li>
  );
}

function CartSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]" aria-busy="true" aria-label="Loading your cart">
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}
