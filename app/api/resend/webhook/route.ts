import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { adminDatabase } from "../../../../lib/supabase";

const statusByType: Record<string, string> = {
  "email.sent": "sent", "email.delivered": "delivered", "email.bounced": "bounced", "email.complained": "complained", "email.delivery_delayed": "sent",
};

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "not configured" }, { status: 503 });
  const body = await request.text();
  let event: { type: string; data?: { email_id?: string } };
  try {
    event = new Webhook(secret).verify(body, {
      "svix-id": request.headers.get("svix-id") ?? "",
      "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
      "svix-signature": request.headers.get("svix-signature") ?? "",
    }) as typeof event;
  } catch { return NextResponse.json({ error: "invalid signature" }, { status: 400 }); }
  const status = statusByType[event.type];
  if (status && event.data?.email_id) {
    const db = adminDatabase();
    await db.from("email_deliveries").update({ status }).eq("provider_message_id", event.data.email_id);
  }
  return NextResponse.json({ ok: true });
}
