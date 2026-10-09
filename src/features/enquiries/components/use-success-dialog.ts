"use client";

import { useState } from "react";

import type { EnquiryFormState } from "../schemas";

/** Opens a modal after each successful submit, without effects: open until that attempt is dismissed. */
export function useSuccessDialog(state: EnquiryFormState) {
  const [dismissedAttempt, setDismissedAttempt] = useState(0);
  return {
    open: state.status === "success" && state.attempt !== dismissedAttempt,
    onOpenChange: (open: boolean) => {
      if (!open) setDismissedAttempt(state.attempt);
    },
  };
}
