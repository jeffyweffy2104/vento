import { NextResponse } from "next/server";
import { adminDatabase } from "../../../../lib/supabase";

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let db;
  try { db = adminDatabase(); } catch { return NextResponse.json({ error: "not configured" }, { status: 503 }); }
  const { data: auth, error: authError } = await db.auth.getUser(token);
  if (authError || !auth.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { data: admin } = await db.from("admin_users").select("role").eq("user_id", auth.user.id).maybeSingle();
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { data, error } = await db.from("waitlist").select("id,email,status,email_verified_at,referred_by,source,campaign,city,sms_consent,created_at").neq("status", "deleted").order("created_at", { ascending: false }).limit(10_000);
  if (error) return NextResponse.json({ error: "unable to load dashboard" }, { status: 500 });
  const users = data ?? [];
  const referralCounts = new Map<string, number>();
  for (const user of users) if (user.referred_by && user.status === "verified") referralCounts.set(user.referred_by, (referralCounts.get(user.referred_by) ?? 0) + 1);
  const daily = new Map<string, number>();
  for (const user of users) { const day = user.created_at.slice(0, 10); daily.set(day, (daily.get(day) ?? 0) + 1); }
  await db.from("audit_events").insert({ actor_id: auth.user.id, action: "admin.stats.viewed" });
  return NextResponse.json({
    totals: { all: users.length, verified: users.filter((u) => u.status === "verified").length, sms: users.filter((u) => u.sms_consent).length, nyc: users.filter((u) => /new york|nyc/i.test(u.city ?? "")).length },
    daily: [...daily].map(([date, signups]) => ({ date, signups })).sort((a, b) => a.date.localeCompare(b.date)),
    sources: Object.entries(users.reduce<Record<string, number>>((acc, user) => { const key = user.campaign || user.source || "direct"; acc[key] = (acc[key] ?? 0) + 1; return acc; }, {})).map(([name, signups]) => ({ name, signups })).sort((a, b) => b.signups - a.signups),
    leaderboard: users.map((user) => ({ email: user.email, referrals: referralCounts.get(user.id) ?? 0 })).filter((item) => item.referrals > 0).sort((a, b) => b.referrals - a.referrals).slice(0, 20),
    recent: users.slice(0, 100).map((user) => ({ email:user.email,status:user.status,email_verified_at:user.email_verified_at,source:user.source,campaign:user.campaign,city:user.city,sms_consent:user.sms_consent,created_at:user.created_at })),
    role: admin.role,
  });
}
