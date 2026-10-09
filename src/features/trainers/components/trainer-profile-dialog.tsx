"use client";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * "View profile" button + modal. The profile body is rendered on the server and passed in as
 * children, so it can contain Server Components like <MediaImage>.
 */
export function TrainerProfileDialog({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" className="w-full" />}>View profile</DialogTrigger>
      <DialogContent className="max-h-[90svh] gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <DialogTitle className="sr-only">{name}</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
}
