"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { authRoutes, safeRedirectPath } from "@/config/routes";
import { createSession, deleteSession } from "@/lib/auth/session";

import { loginSchema, type LoginFormState } from "./schemas";
import { verifyCredentials } from "./server/users";

export async function login(prev: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "");
  const attempt = prev.attempt + 1;
  const parsed = loginSchema.safeParse({ email, password: formData.get("password") });

  if (!parsed.success) {
    return { attempt, email, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const user = await verifyCredentials(parsed.data.email, parsed.data.password);
  if (!user) {
    // Same message for wrong email and wrong password, so accounts can't be enumerated.
    return { attempt, email, message: "Incorrect email or password." };
  }

  await createSession(user.id);
  redirect(safeRedirectPath(formData.get("from")));
}

export async function logout() {
  await deleteSession();
  redirect(authRoutes.afterLogout);
}
