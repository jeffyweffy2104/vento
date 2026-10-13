import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
export async function GET(req: Request) {
  if (!process.env.ADMIN_TOKEN || req.headers.get('authorization') !== 'Bearer ' + process.env.ADMIN_TOKEN) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: 'not configured' }, { status: 503 });
  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await db.from('waitlist').select('id,email,referred_by');
  const users = data || [];
  return NextResponse.json({ total: users.length, leaderboard: users.map(u => ({ email: u.email, referrals: users.filter(x => x.referred_by === u.id).length })).sort((a,b) => b.referrals - a.referrals).slice(0,20) });
}
