import { cn } from "@/lib/utils";

import { Container } from "./container";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

export function PageHeader({ eyebrow, title, description, children, className }: PageHeaderProps) {
  return (
    <header className={cn("border-b bg-muted/40 py-14 sm:py-20", className)}>
      <Container className="max-w-4xl text-center">
        {eyebrow && (
          <p className="mb-3 text-sm font-semibold tracking-wide text-primary uppercase">{eyebrow}</p>
        )}
        <h1 className="text-4xl font-bold text-balance sm:text-5xl">{title}</h1>
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-pretty text-muted-foreground">{description}</p>
        )}
        {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
      </Container>
    </header>
  );
}