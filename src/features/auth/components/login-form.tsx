"use client";

import { CircleAlertIcon, LoaderCircleIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { login } from "../actions";
import type { LoginFormState } from "../schemas";

const toErrors = (messages?: string[]) => messages?.map((message) => ({ message }));

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, { attempt: 0 } satisfies LoginFormState);
  const from = useSearchParams().get("from") ?? "";


  return (
    <form key={state.attempt} action={formAction} noValidate>
      <input type="hidden" name="from" value={from} />
      <FieldGroup>
        {state.message && (
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        <Field data-invalid={!!state.fieldErrors?.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            defaultValue={state.email}
            aria-invalid={!!state.fieldErrors?.email}
            required
          />
          <FieldError errors={toErrors(state.fieldErrors?.email)} />
        </Field>

        <Field data-invalid={!!state.fieldErrors?.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!state.fieldErrors?.password}
            required
          />
          <FieldError errors={toErrors(state.fieldErrors?.password)} />
        </Field>

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending && <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />}
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </FieldGroup>
    </form>
  );
}
