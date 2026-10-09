"use client";

import { CircleAlertIcon, LoaderCircleIcon, SendIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import { SelectField, TextField } from "@/components/shared/form-fields";
import { StatusDialog } from "@/components/shared/status-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

import { submitContact } from "../actions";
import { enquiryTopics, type EnquiryFormState } from "../schemas";
import { useSuccessDialog } from "./use-success-dialog";

const initialState: EnquiryFormState = { status: "idle", attempt: 0 };

export function ContactForm({ plans }: { plans: { value: string; label: string }[] }) {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const dialog = useSuccessDialog(state);
  const searchParams = useSearchParams();

  // Pre-fill from links like /contact?topic=trial or /contact?plan=pln_pro.
  const values = state.values ?? {
    topic: searchParams.get("topic") ?? (searchParams.get("plan") ? "membership" : ""),
    planId: searchParams.get("plan") ?? "",
  };
  const errors = state.fieldErrors ?? {};

  return (
    <>
      {/* Remount after each submit so fields reflect the latest echoed values (or clear on success). */}
      <form key={state.attempt} action={formAction} noValidate>
        <FieldGroup>
          {state.status === "error" && state.message && (
            <Alert variant="destructive">
              <CircleAlertIcon />
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField name="name" label="Full name" autoComplete="name" defaultValue={values.name} errors={errors.name} />
            <TextField
              name="phone"
              label="Mobile number"
              type="tel"
              autoComplete="tel"
              placeholder="98765 43210"
              defaultValue={values.phone}
              errors={errors.phone}
            />
          </div>
          <TextField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            defaultValue={values.email}
            errors={errors.email}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              name="topic"
              label="What can we help with?"
              options={enquiryTopics}
              defaultValue={values.topic}
              errors={errors.topic}
            />
            <SelectField
              name="planId"
              label="Interested plan (optional)"
              placeholder="Not sure yet"
              options={plans}
              defaultValue={values.planId}
            />
          </div>
          <TextField
            name="message"
            label="Message"
            multiline
            placeholder="Tell us about your goals, preferred timings or any questions."
            defaultValue={values.message}
            errors={errors.message}
          />
          <Button type="submit" size="lg" className="h-11 w-full sm:w-auto sm:self-start" disabled={pending}>
            {pending ? (
              <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
            ) : (
              <SendIcon data-icon="inline-start" />
            )}
            {pending ? "Sending…" : "Send enquiry"}
          </Button>
        </FieldGroup>
      </form>

      <StatusDialog
        {...dialog}
        status="success"
        title="Enquiry sent!"
        description={state.message}
        actions={
          <>
            <Link href="/classes" className={buttonVariants({ variant: "outline" })}>
              Browse classes
            </Link>
            <Button onClick={() => dialog.onOpenChange(false)}>Done</Button>
          </>
        }
      />
    </>
  );
}
