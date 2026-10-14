import { z } from "zod";

const serverSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  ABUSE_HASH_SECRET: z.string().min(32),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://vento-us.com"),
});

export function serverConfig() {
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Server configuration error: ${parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")}`);
  }
  return parsed.data;
}

export function emailConfig() {
  const parsed = z.object({
    RESEND_API_KEY: z.string().min(10),
    RESEND_FROM_EMAIL: z.string().min(3),
    RESEND_REPLY_TO_EMAIL: z.string().email().optional(),
  }).safeParse(process.env);
  return parsed.success ? parsed.data : null;
}
