"use client";

import { LoaderCircleIcon, Trash2Icon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { removeFromCart } from "../actions";

export function RemoveFromCartButton({ sessionId, className }: { sessionId: string; className?: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await removeFromCart(sessionId);
          if (!result.ok) toast.error(result.message);
        })
      }
    >
      {pending ? <LoaderCircleIcon data-icon="inline-start" className="animate-spin" /> : <Trash2Icon data-icon="inline-start" />}
      Remove
    </Button>
  );
}
