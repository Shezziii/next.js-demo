import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Header cart icon with a count badge. */
export function CartButton({ count, className }: { count: number; className?: string }) {
  const label = count === 0 ? "Cart, empty" : `Cart, ${count} ${count === 1 ? "class" : "classes"}`;

  return (
    <Link
      href="/cart"
      aria-label={label}
      title="Cart"
      className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative", className)}
    >
      <ShoppingCartIcon />
      {count > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
          aria-hidden
        >
          {count}
        </span>
      )}
    </Link>
  );
}
