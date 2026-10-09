import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(1, "Enter your password."),
});

export type LoginFormState = {
  /** Echo the email back so the field isn't cleared after a failed attempt. */
  email?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof loginSchema>, string[]>>;
  message?: string;
  /** Increments on every submit; the form uses it as a key so inputs remount with the echoed email. */
  attempt: number;
};
