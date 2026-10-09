"use client";

import { CircleCheckBigIcon, CircleXIcon, InfoIcon, type LucideIcon } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const tones = {
  success: { icon: CircleCheckBigIcon, className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  error: { icon: CircleXIcon, className: "bg-destructive/10 text-destructive" },
  info: { icon: InfoIcon, className: "bg-primary/10 text-primary" },
} satisfies Record<string, { icon: LucideIcon; className: string }>;

type StatusDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status?: keyof typeof tones;
  /** Overrides the status icon. */
  icon?: LucideIcon;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Buttons/links. Defaults to a single Close button. */
  actions?: React.ReactNode;
};

/** Reusable result/notice modal: success after a form, "please log in", errors, etc. */
export function StatusDialog({
  open,
  onOpenChange,
  status = "info",
  icon,
  title,
  description,
  children,
  actions,
}: StatusDialogProps) {
  const tone = tones[status];
  const Icon = icon ?? tone.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center pt-2 text-center">
          <span className={cn("mb-2 flex size-14 items-center justify-center rounded-full", tone.className)}>
            <Icon className="size-7" aria-hidden />
          </span>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          {description && <DialogDescription className="text-balance">{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter showCloseButton={!actions}>{actions}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
