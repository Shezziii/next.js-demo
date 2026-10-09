import { z } from "zod";

export const enquiryTopics = [
  { value: "membership", label: "Membership" },
  { value: "trial", label: "Free trial session" },
  { value: "personal-training", label: "Personal training" },
  { value: "corporate", label: "Corporate plans" },
  { value: "other", label: "Something else" },
] as const;

export type EnquiryTopic = (typeof enquiryTopics)[number]["value"];

const topicValues = enquiryTopics.map((t) => t.value) as [EnquiryTopic, ...EnquiryTopic[]];

const base = {
  name: z.string().trim().min(2, "Enter your full name.").max(80),
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  // Indian mobile numbers, with or without +91 / spaces.
  phone: z
    .string()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .pipe(z.string().regex(/^(\+91)?[6-9]\d{9}$/, "Enter a valid 10-digit mobile number.")),
};

/** Contact page: general questions. */
export const contactSchema = z.object({
  ...base,
  topic: z.enum(topicValues, "Choose a topic."),
  planId: z.string().optional(),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters).").max(1000),
});

/** Join page: membership registration request. */
export const registrationSchema = z.object({
  ...base,
  planId: z.string().min(1, "Choose a membership plan."),
  goal: z.string().trim().max(500).optional(),
  consent: z.literal("on", "Please agree so our team can contact you."),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type RegistrationInput = z.infer<typeof registrationSchema>;

/** State shared by both forms' useActionState. */
export type EnquiryFormState = {
  status: "idle" | "success" | "error";
  /** Id of the saved enquiry (success only). */
  submissionId?: string;
  message?: string;
  /** Echo submitted values so fields survive a failed attempt. */
  values?: Record<string, string>;
  fieldErrors?: Record<string, string[] | undefined>;
  /** Increments on every submit; the form uses it as a key to remount with fresh values. */
  attempt: number;
};
