import { ArrowLeftIcon, CircleAlertIcon, ShieldCheckIcon, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { PageTitle } from "@/components/shared/page-title";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { env } from "@/config/env";
import { getCart } from "@/features/cart/server/queries";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";
import { OrderItems } from "@/features/checkout/components/order-items";
import { PriceBreakdown } from "@/features/checkout/components/price-breakdown";
import { requireUser } from "@/lib/auth/dal";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Checkout", path: "/checkout", noIndex: true });

export default function CheckoutPage() {
  return (
    <Container className="space-y-8 py-10">
      <div className="space-y-4">
        <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon className="size-4" aria-hidden />
          Back to cart
        </Link>
        <PageTitle title="Checkout" description="Pay for your classes to lock in your spots." />
      </div>
      {/* The cart and the member are per request, so everything below streams in. */}
      <Suspense fallback={<CheckoutSkeleton />}>
        <Checkout />
      </Suspense>
    </Container>
  );
}

async function Checkout() {
  const [user, { items, totals, canCheckout }] = await Promise.all([requireUser(), getCart()]);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCartIcon}
        title="Your cart is empty"
        description="Add classes from the timetable first."
        action={
          <Link href="/classes#schedule" className={buttonVariants()}>
            Browse the timetable
          </Link>
        }
      />
    );
  }

  if (!canCheckout) {
    return (
      <EmptyState
        icon={CircleAlertIcon}
        title="Some classes can't be booked"
        description="A class in your cart is full, has started or is already booked. Remove it to continue."
        action={
          <Link href="/cart" className={buttonVariants()}>
            Review cart
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
      <aside className="lg:sticky lg:top-24 lg:order-last">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg font-bold">Order summary</CardTitle>
            <CardAction>
              <Link href="/cart" className={buttonVariants({ variant: "link", size: "sm" })}>
                Edit
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-5">
            <OrderItems items={items.map(({ session }) => ({ session, price: session.price }))} />
            <PriceBreakdown totals={totals} itemCount={items.length} />
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheckIcon className="size-4 shrink-0 text-primary" aria-hidden />
              Your spots are reserved as soon as payment goes through.
            </p>
          </CardContent>
        </Card>
      </aside>

      <Card>
        <CardContent>
          <CheckoutForm
            sessionIds={items.map(({ session }) => session.id)}
            total={totals.total}
            defaultValues={{ name: user.name, email: user.email }}
            testMode={env.USE_MOCK_API}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]" aria-busy="true" aria-label="Loading checkout">
      <Skeleton className="h-72 lg:order-last" />
      <Skeleton className="h-[36rem]" />
    </div>
  );
}
