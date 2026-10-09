import { cn } from "@/lib/utils";

type PageTitleProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Buttons/links on the right. */
  actions?: React.ReactNode;
  className?: string;
};

/** Compact, left-aligned heading for app (member) pages. Use PageHeader for marketing heroes. */
export function PageTitle({ title, description, actions, className }: PageTitleProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
