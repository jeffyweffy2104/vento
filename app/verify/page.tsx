import Link from "next/link";
import { Resend } from "resend";
import { adminDatabase } from "../../lib/supabase";
import { emailConfig, serverConfig } from "../../lib/config";
import { confirmationEmailText, waitlistConfirmationEmail } from "../../lib/email-template";
import { privateHash } from "../../lib/waitlist";

export const dynamic = "force-dynamic";

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  let state: "verified" | "invalid" | "expired" | "error" = "invalid";
  if (token) {
    try {
      const config = serverConfig();
      const db = adminDatabase();
      const tokenHash = privateHash(token, config.ABUSE_HASH_SECRET);
      const { data: verification } = await db.from("email_verifications").select("id,subscriber_id,expires_at,consumed_at").eq("token_hash", tokenHash).maybeSingle();
      if (verification?.consumed_at) state = "verified";
      else if (!verification) state = "invalid";
      else if (new Date(verification.expires_at).getTime() < Date.now()) state = "expired";
      else {
        const now = new Date().toISOString();
        const { data: subscriber, error } = await db.from("waitlist").update({ status: "verified", email_verified_at: now }).eq("id", verification.subscriber_id).select("id,email,referral_code").single();
        if (error || !subscriber) throw new Error("verification update failed");
        await db.from("email_verifications").update({ consumed_at: now }).eq("id", verification.id).is("consumed_at", null);
        const referralUrl = `${config.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/?ref=${subscriber.referral_code}`;
        const key = `welcome:${subscriber.id}`;
        const { data: delivery } = await db.from("email_deliveries").upsert({ subscriber_id: subscriber.id, template: "welcome-v1", idempotency_key: key, status: "queued", next_attempt_at: now }, { onConflict: "idempotency_key", ignoreDuplicates: true }).select("id").maybeSingle();
        const mail = emailConfig();
        if (delivery && mail) {
          const resend = new Resend(mail.RESEND_API_KEY);
          const result = await resend.emails.send({ from: mail.RESEND_FROM_EMAIL, to: subscriber.email, replyTo: mail.RESEND_REPLY_TO_EMAIL, subject: "you're on the vento. list", html: waitlistConfirmationEmail(referralUrl), text: confirmationEmailText(referralUrl), headers: { "X-Entity-Ref-ID": key } });
          await db.from("email_deliveries").update({ status: result.error ? "failed" : "sent", provider_message_id: result.data?.id ?? null, attempt_count: 1, last_error: result.error ? "provider_send_failed" : null }).eq("id", delivery.id);
        }
        state = "verified";
      }
    } catch { state = "error"; }
  }
  const copy = {
    verified: ["you're on the list.", "your email is confirmed. good things happen offline."],
    expired: ["this invitation expired.", "join again to receive a fresh confirmation link."],
    invalid: ["we couldn't confirm that link.", "check the full link from your email or join again."],
    error: ["something went wrong.", "please try again in a moment."],
  }[state];
  return <main className="shell"><header className="top"><Link className="logo logo-text" href="/">V.</Link><Link href="/about">about</Link></header><section className="center verify-card"><p className="eyebrow">vento.</p><h1>{copy[0]}</h1><p>{copy[1]}</p><Link className="cta" href="/">back home.</Link></section><footer className="foot"><span>© 2026 vento.</span><span>good things happen offline.</span></footer></main>;
}
