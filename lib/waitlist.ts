import { createHmac, randomBytes } from "node:crypto";
import { z } from "zod";

const phonePattern = /^\+[1-9]\d{7,14}$/;

export const waitlistInput = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.string().trim().max(32).nullable().optional().transform((value) => value || null),
  smsConsent: z.boolean().default(false),
  ref: z.string().trim().regex(/^[a-f0-9]{16}$/).nullable().optional().catch(null),
  source: z.string().trim().max(100).nullable().optional().catch(null),
  campaign: z.string().trim().max(100).nullable().optional().catch(null),
  medium: z.string().trim().max(100).nullable().optional().catch(null),
  content: z.string().trim().max(100).nullable().optional().catch(null),
  city: z.string().trim().max(100).nullable().optional().catch(null),
  website: z.string().max(0).optional().default(""),
}).superRefine((value, context) => {
  if (value.phone && !phonePattern.test(value.phone)) {
    context.addIssue({ code: "custom", path: ["phone"], message: "Use international format, for example +12125550123." });
  }
  if (value.smsConsent && !value.phone) {
    context.addIssue({ code: "custom", path: ["smsConsent"], message: "A phone number is required for text consent." });
  }
});

export type WaitlistInput = z.infer<typeof waitlistInput>;

export function referralCode() {
  return randomBytes(8).toString("hex");
}

export function verificationToken() {
  return randomBytes(32).toString("base64url");
}

export function privateHash(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function requestIp(request: Request) {
  return request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
}
