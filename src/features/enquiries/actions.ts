"use server";

import { z } from "zod";

import { env } from "@/config/env";
import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoint";
import { getErrorMessage } from "@/lib/api/errors";
import { mockApi } from "@/mocks/server";

import { contactSchema, registrationSchema, type EnquiryFormState } from "./schemas";
import type { Enquiry } from "./types";

type NewEnquiry = Omit<Enquiry, "id" | "createdAt">;

async function saveEnquiry(enquiry: NewEnquiry) {
  if (env.USE_MOCK_API) return mockApi.createEnquiry(enquiry);
  return apiClient.post<Enquiry>(endpoints.enquiries.create, enquiry);
}

/** Form values as plain strings, echoed back so a failed submit keeps what the user typed. */
function readValues(formData: FormData) {
  const values: Record<string, string> = {};
  for (const [key, value] of formData) if (typeof value === "string" && !key.startsWith("$")) values[key] = value;
  return values;
}

export async function submitContact(prev: EnquiryFormState, formData: FormData): Promise<EnquiryFormState> {
  const values = readValues(formData);
  const attempt = prev.attempt + 1;
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", attempt, values, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    const { id } = await saveEnquiry({ kind: "contact", ...parsed.data });
    return {
      status: "success",
      attempt,
      submissionId: id,
      message: `Thanks, ${parsed.data.name.split(" ")[0]}! Our team will get back to you within one working day.`,
    };
  } catch (error) {
    return { status: "error", attempt, values, message: getErrorMessage(error) };
  }
}

export async function submitRegistration(prev: EnquiryFormState, formData: FormData): Promise<EnquiryFormState> {
  const values = readValues(formData);
  const attempt = prev.attempt + 1;
  const parsed = registrationSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", attempt, values, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const { name, email, phone, planId, goal } = parsed.data;
  try {
    const { id } = await saveEnquiry({ kind: "registration", topic: "membership", name, email, phone, planId, message: goal });
    return {
      status: "success",
      attempt,
      submissionId: id,
      message: `Welcome aboard, ${name.split(" ")[0]}! We'll call you on ${phone} to confirm your plan and set up your member login.`,
    };
  } catch (error) {
    return { status: "error", attempt, values, message: getErrorMessage(error) };
  }
}
