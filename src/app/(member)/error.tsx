"use client";

import { useEffect } from "react";

import { Container } from "@/components/shared/container";
import { ErrorState } from "@/components/shared/error-state";

/** Catches unexpected errors in any member page and offers a retry. */
export default function MemberError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    // Hook up an error reporting service (Sentry etc.) here.
    console.error(error);
  }, [error]);

  return (
    <Container className="py-16">
      <ErrorState onRetry={retry} />
    </Container>
  );
}
