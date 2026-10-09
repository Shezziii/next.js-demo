import { cn } from "@/lib/utils";

import { Container } from "./container";

type SectionProps = React.ComponentProps<"section"> & {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Slot on the right of the heading, e.g. a "View all" link. */
  action?: React.ReactNode;
  align?: "left" | "center";
  containerClassName?: string;
};

export function Section({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  const hasHeader = eyebrow || title || description || action;

  return (
    <section className={cn("py-16 sm:py-20", className)} {...props}>
      <Container className={containerClassName}>
        {hasHeader && (
          <div
            className={cn(
              "mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
              align === "center" && "items-center text-center sm:flex-col sm:items-center",
            )}
          >
            <div className="max-w-2xl space-y-2">
              {eyebrow && (
                <p className="text-sm font-semibold tracking-wide text-primary uppercase">{eyebrow}</p>
              )}
              {title && <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>}
              {description && <p className="text-muted-foreground">{description}</p>}
            </div>
            {action}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}