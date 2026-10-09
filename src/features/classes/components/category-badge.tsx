import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { categoryMeta } from "../constants";
import type { ClassCategory } from "../types";

export function CategoryBadge({ category, className }: { category: ClassCategory; className?: string }) {
  const { label, icon: Icon, className: tone } = categoryMeta[category];
  return (
    <Badge variant="secondary" className={cn(tone, className)}>
      <Icon data-icon="inline-start" aria-hidden />
      {label}
    </Badge>
  );
}
