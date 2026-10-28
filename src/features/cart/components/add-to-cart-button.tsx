"use client";

import { CheckIcon, LoaderCircleIcon, LockKeyholeIcon, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { StatusDialog } from "@/components/shared/status-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { SessionSummary } from "@/features/bookings/components/session-summary";
import type { ClassSession } from "@/features/classes/types";
import { cn } from "@/lib/utils";

import { addToCart } from "../actions";

type AddToCartButtonProps = {
  session: ClassSession;
  isBooked: boolean;
  isInCart: boolean;
  /** Guests see a "log in to book" modal instead. */
  isAuthenticated: boolean;
  className?: string;
};

export function AddToCartButton({ session, isBooked, isInCart, isAuthenticated, className }: AddToCartButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  if (isBooked) {
    return (
      <Button variant="secondary" disabled className={className}>
        <CheckIcon data-icon="inline-start" />
        Booked
      </Button>
    );
  }

  if (isInCart) {
    return (
      <Link href="/cart" className={cn(buttonVariants({ variant: "secondary" }), className)}>
        <CheckIcon data-icon="inline-start" />
        In cart
      </Link>
    );
  }

  if (session.spotsLeft <= 0) {
    return (
      <Button className={className} disabled>
        Class full
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <Button
        className={className}
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await addToCart(session.id);
            if (!result.ok) toast.error(result.message);
            else toast.success(result.message, { action: { label: "View cart", onClick: () => router.push("/cart") } });
          })
        }
      >
        {pending ? (
          <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
        ) : (
          <ShoppingCartIcon data-icon="inline-start" />
        )}
        Add
      </Button>
    );
  }

  return (
    <>
      <Button className={className} onClick={() => setOpen(true)}>
        <ShoppingCartIcon data-icon="inline-start" />
        Add
      </Button>
      <StatusDialog
        open={open}
        onOpenChange={setOpen}
        icon={LockKeyholeIcon}
        title="Log in to book"
        description={`Log in to add ${session.className} to your cart and check out.`}
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
    </>
  );
}
