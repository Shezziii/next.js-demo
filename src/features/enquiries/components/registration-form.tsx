"use client";

import { CircleAlertIcon, LoaderCircleIcon, PartyPopperIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import { CheckboxField, SelectField, TextField } from "@/components/shared/form-fields";
import { StatusDialog } from "@/components/shared/status-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

import { submitRegistration } from "../actions";
import type { EnquiryFormState } from "../schemas";
import { useSuccessDialog } from "./use-success-dialog";

const initialState: EnquiryFormState = { status: "idle", attempt: 0 };

export function RegistrationForm({ plans }: { plans: { value: string; label: string }[] }) {
  const [state, formAction, pending] = useActionState(submitRegistration, initialState);
  const dialog = useSuccessDialog(state);
  const searchParams = useSearchParams();

  // /register?plan=pln_pro pre-selects the plan chosen on the pricing page.
  const values = state.values ?? { planId: searchParams.get("plan") ?? "" };
  const errors = state.fieldErrors ?? {};

  return (
    <>
      <form key={state.attempt} action={formAction} noValidate>
        <FieldGroup>
          {state.status === "error" && state.message && (
            <Alert variant="destructive">
              <CircleAlertIcon />
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <TextField name="name" label="Full name" autoComplete="name" defaultValue={values.name} errors={errors.name} />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              defaultValue={values.email}
              errors={errors.email}
            />
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
          <SelectField
            name="planId"
            label="Membership plan"
            placeholder="Choose a plan"
            options={plans}
            defaultValue={values.planId}
            errors={errors.planId}
          />
          <TextField
            name="goal"
            label="Your fitness goal (optional)"
            multiline
            placeholder="e.g. Lose 5 kg, get stronger, train for a marathon…"
            defaultValue={values.goal}
            errors={errors.goal}
          />
          <CheckboxField
            name="consent"
            label="I agree to be contacted by Gold's Gym about my membership."
            defaultValue={values.consent}
            errors={errors.consent}
          />
          <Button type="submit" size="lg" className="h-11 w-full" disabled={pending}>
            {pending ? (
              <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
            ) : (
              <UserPlusIcon data-icon="inline-start" />
            )}
            {pending ? "Submitting…" : "Request membership"}
          </Button>
        </FieldGroup>
      </form>

      <StatusDialog
        {...dialog}
        status="success"
        icon={PartyPopperIcon}
        title="Request received!"
        description={state.message}
        actions={
          <>
            <Link href="/classes" className={buttonVariants({ variant: "outline" })}>
              Explore classes
            </Link>
            <Link href="/" className={buttonVariants()}>
              Back to home
            </Link>
          </>
        }
      />
    </>
  );
}
