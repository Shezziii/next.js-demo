"use client";

import { CircleAlertIcon, CreditCardIcon, LoaderCircleIcon, LockIcon, SmartphoneIcon } from "lucide-react";
import { useActionState, useState } from "react";

import { CheckboxField, TextField } from "@/components/shared/form-fields";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { formatMoney } from "@/lib/format";
import type { Money } from "@/types/common";

import { placeOrder } from "../actions";
import type { CheckoutFormState } from "../schemas";
import type { PaymentMethod } from "../types";

const initialState: CheckoutFormState = { status: "idle", attempt: 0 };

const paymentMethods: { value: PaymentMethod; label: string; hint: string; icon: typeof CreditCardIcon }[] = [
  { value: "card", label: "Card", hint: "Debit or credit", icon: CreditCardIcon },
  { value: "upi", label: "UPI", hint: "GPay, PhonePe, Paytm…", icon: SmartphoneIcon },
];

/** "4242424242424242" → "4242 4242 4242 4242" as the member types. */
function formatCardNumber(event: React.FormEvent<HTMLInputElement>) {
  const input = event.currentTarget;
  const formatted = input.value.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
  if (formatted !== input.value) input.value = formatted;
}

/** "1228" → "12/28" as the member types. */
function formatExpiry(event: React.FormEvent<HTMLInputElement>) {
  const input = event.currentTarget;
  const digits = input.value.replace(/\D/g, "").slice(0, 4);
  const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  if (formatted !== input.value) input.value = formatted;
}

type CheckoutFormProps = {
  /** The classes shown in the summary, so the member pays for exactly what they saw. */
  sessionIds: string[];
  total: Money;
  /** Pre-filled from the member's account. */
  defaultValues: { name: string; email: string };
  /** Mock payments: tell the member any details will do. */
  testMode?: boolean;
};

export function CheckoutForm({ sessionIds, total, defaultValues, testMode }: CheckoutFormProps) {
  const [state, formAction, pending] = useActionState(placeOrder, initialState);
  const values: Record<string, string | undefined> = state.values ?? defaultValues;
  const errors = state.fieldErrors ?? {};
  const [method, setMethod] = useState<PaymentMethod>(values.paymentMethod === "upi" ? "upi" : "card");

  return (
    // Remount after each submit so fields reflect the latest echoed values. Card details are never echoed.
    <form key={state.attempt} action={formAction} noValidate>
      <input type="hidden" name="sessionIds" value={sessionIds.join(",")} />
      <FieldGroup>
        {state.status === "error" && state.message && (
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        <FieldSet>
          <FieldLegend className="font-heading text-lg font-bold">Your details</FieldLegend>
          <FieldGroup>
            <TextField name="name" label="Full name" autoComplete="name" defaultValue={values.name} errors={errors.name} />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
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
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend className="font-heading text-lg font-bold">Payment</FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map(({ value, label, hint, icon: Icon }) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-3 ring-1 ring-foreground/10 transition-colors has-checked:bg-primary/5 has-checked:ring-2 has-checked:ring-primary has-focus-visible:outline-2 has-focus-visible:outline-ring"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={method === value}
                    onChange={() => setMethod(value)}
                    className="sr-only"
                  />
                  <Icon className="size-5 shrink-0 text-primary" aria-hidden />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="block truncate text-xs text-muted-foreground">{hint}</span>
                  </span>
                </label>
              ))}
            </div>

            {method === "card" ? (
              <>
                <TextField
                  name="cardNumber"
                  label="Card number"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                  onInput={formatCardNumber}
                  errors={errors.cardNumber}
                />
                <div className="grid grid-cols-2 gap-5">
                  <TextField
                    name="cardExpiry"
                    label="Expiry"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    onInput={formatExpiry}
                    errors={errors.cardExpiry}
                  />
                  <TextField
                    name="cardCvc"
                    label="CVC"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    errors={errors.cardCvc}
                  />
                </div>
              </>
            ) : (
              <TextField
                name="upiId"
                label="UPI ID"
                autoComplete="off"
                placeholder="yourname@okhdfc"
                description="You'll get a payment request in your UPI app."
                defaultValue={values.upiId}
                errors={errors.upiId}
              />
            )}

            {testMode && (
              <p className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                Test mode, no real payment is taken. Any card number, expiry and CVC will work, or any UPI ID.
              </p>
            )}
          </FieldGroup>
        </FieldSet>

        <CheckboxField
          name="terms"
          label="I agree to the class booking and cancellation policy."
          defaultValue={values.terms}
          errors={errors.terms}
        />

        <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={pending}>
          {pending ? (
            <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
          ) : (
            <LockIcon data-icon="inline-start" />
          )}
          {pending ? "Processing payment…" : `Pay ${formatMoney(total)}`}
        </Button>
      </FieldGroup>
    </form>
  );
}
