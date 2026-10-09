import "server-only";
import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_BASE_URL: z.url(),
  API_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),
  USE_MOCK_API: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters."),
});

const parsed = serverSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid server environment variables:",
    z.flattenError(parsed.error).fieldErrors,
  );
  throw new Error("Invalid server environment variables. See .env.example.");
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === "production";
