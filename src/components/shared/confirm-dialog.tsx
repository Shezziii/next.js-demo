"use client";

import { LoaderCircleIcon, type LucideIcon } from "lucide-react";
import { useTransition } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  icon?: LucideIcon;
  confirmLabel?: string;
  pendingLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";

  onConfirm: () => Promise<boolean | void> | boolean | void;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  icon: Icon,
  confirmLabel = "Confirm",
  pendingLabel = "Please wait…",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
}: ConfirmDialogProps) {
  const [pending, startTransition] = useTransition();

  return (
    // Block closing while the action is running.
    <AlertDialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {Icon && (
            <AlertDialogMedia
              className={cn(variant === "destructive" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary")}
            >
              <Icon />
            </AlertDialogMedia>
          )}
          <AlertDialogTitle className="text-lg font-semibold">{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{cancelLabel}</AlertDialogCancel>
          <Button
            variant={variant}
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const keepOpen = (await onConfirm()) === false;
                if (!keepOpen) onOpenChange(false);
              })
            }
          >
            {pending && <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />}
            {pending ? pendingLabel : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
