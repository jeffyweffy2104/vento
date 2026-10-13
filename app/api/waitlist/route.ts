import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';
export async function POST(req: Request) {
  const { email, phone, smsConsent, ref } = await req.json();
  if (!email || !String(email).includes('@')) return NextResponse.json({ error: 'invalid email' }, { status: 400 });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: 'database not configured' }, { status: 503 });
  const db = createClient(url, key);
  let referred_by = null;
  if (ref) { const { data } = await db.from('waitlist').select('id').eq('referral_code', ref).maybeSingle(); referred_by = data?.id || null; }
  const { data, error } = await db.from('waitlist').insert({ email: String(email).toLowerCase().trim(), phone: phone || null, sms_consent: Boolean(phone && smsConsent), referred_by, referral_code: randomBytes(6).toString('hex') }).select('referral_code').single();
  if (error) return NextResponse.json({ error: 'unable to register' }, { status: 409 });
  return NextResponse.json({ ok: true, referralUrl: (process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin) + '/?ref=' + data.referral_code });
}
