import { NextResponse } from "next/server";
import { Resend } from "resend";
import { adminDatabase } from "../../../lib/supabase";
import { emailConfig, serverConfig } from "../../../lib/config";
import { verificationEmailText, waitlistVerificationEmail } from "../../../lib/email-template";
import { privateHash, referralCode, requestIp, verificationToken, waitlistInput } from "../../../lib/waitlist";

export const runtime = "nodejs";

function response(error: string, status: number, fieldErrors?: Record<string, string[] | undefined>) {
  return NextResponse.json({ error, fieldErrors }, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return response("Invalid request.", 400); }
  const parsed = waitlistInput.safeParse(body);
  if (!parsed.success) return response("Check the highlighted details.", 422, parsed.error.flatten().fieldErrors);
  if (parsed.data.website) return NextResponse.json({ ok: true, pendingVerification: true });

  let config: ReturnType<typeof serverConfig>;
  try { config = serverConfig(); } catch { return response("Waitlist service is temporarily unavailable.", 503); }
  const db = adminDatabase();
  const ipHash = privateHash(requestIp(request), config.ABUSE_HASH_SECRET);
  const emailHash = privateHash(parsed.data.email, config.ABUSE_HASH_SECRET);
  const since = new Date(Date.now() - 15 * 60_000).toISOString();
  const [{ count: ipCount }, { count: emailCount }] = await Promise.all([
    db.from("waitlist_attempts").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since),
    db.from("waitlist_attempts").select("id", { count: "exact", head: true }).eq("email_hash", emailHash).gte("created_at", since),
  ]);
  if ((ipCount ?? 0) >= 10 || (emailCount ?? 0) >= 4) {
    return response("Too many attempts. Please try again later.", 429);
  }

  let referrerId: string | null = null;
  if (parsed.data.ref) {
    const { data } = await db.from("waitlist").select("id,email").eq("referral_code", parsed.data.ref).maybeSingle();
    if (data && data.email !== parsed.data.email) referrerId = data.id;
  }

  const { data: existing } = await db.from("waitlist").select("id,referral_code,status,email_verified_at").eq("email", parsed.data.email).maybeSingle();
  let subscriber = existing;
  let isNew = false;
  if (!subscriber) {
    const { data, error } = await db.from("waitlist").insert({
      email: parsed.data.email,
      phone: parsed.data.phone,
      sms_consent: Boolean(parsed.data.phone && parsed.data.smsConsent),
      sms_consent_at: parsed.data.phone && parsed.data.smsConsent ? new Date().toISOString() : null,
      referred_by: referrerId,
      referral_code: referralCode(),
      source: parsed.data.source,
      campaign: parsed.data.campaign,
      medium: parsed.data.medium,
      content: parsed.data.content,
      city: parsed.data.city,
    }).select("id,referral_code,status,email_verified_at").single();
    if (error || !data) {
      await db.from("waitlist_attempts").insert({ ip_hash: ipHash, email_hash: emailHash, accepted: false });
      return response("We could not save your invitation. Please try again.", 500);
    }
    subscriber = data;
    isNew = true;
  }
  await db.from("waitlist_attempts").insert({ ip_hash: ipHash, email_hash: emailHash, accepted: true });

  const referralUrl = `${config.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/?ref=${subscriber.referral_code}`;
  if (subscriber.email_verified_at) return NextResponse.json({ ok: true, alreadyRegistered: true, referralUrl });

  const token = verificationToken();
  const tokenHash = privateHash(token, config.ABUSE_HASH_SECRET);
  const deliveryKey = `verify:${subscriber.id}:${new Date().toISOString().slice(0, 13)}`;
  const { data: delivery } = await db.from("email_deliveries").upsert({
    subscriber_id: subscriber.id, template: "verify-email-v1", idempotency_key: deliveryKey,
    status: "queued", next_attempt_at: new Date().toISOString(),
  }, { onConflict: "idempotency_key", ignoreDuplicates: true }).select("id,status").maybeSingle();

  const mail = emailConfig();
  if (delivery && mail) {
    await db.from("email_verifications").insert({ subscriber_id: subscriber.id, token_hash: tokenHash, expires_at: new Date(Date.now() + 24 * 60 * 60_000).toISOString() });
    const verificationUrl = `${config.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/verify?token=${encodeURIComponent(token)}`;
    const resend = new Resend(mail.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: mail.RESEND_FROM_EMAIL, to: parsed.data.email, replyTo: mail.RESEND_REPLY_TO_EMAIL,
      subject: "confirm your vento. invitation", html: waitlistVerificationEmail(verificationUrl), text: verificationEmailText(verificationUrl),
      headers: { "X-Entity-Ref-ID": deliveryKey },
    });
    await db.from("email_deliveries").update({
      status: error ? "failed" : "sent", provider_message_id: data?.id ?? null,
      attempt_count: 1, last_error: error ? "provider_send_failed" : null,
      next_attempt_at: error ? new Date(Date.now() + 15 * 60_000).toISOString() : null,
    }).eq("id", delivery.id);
  }

  return NextResponse.json({ ok: true, pendingVerification: true, alreadyRegistered: !isNew, emailConfigured: Boolean(mail) });
}
