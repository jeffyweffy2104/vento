# vento.

Vento helps people find curated experiences and meaningful connection offline. This repository contains the public launch site, verified waitlist and referral system, email lifecycle, and founder dashboard.

## Local development

1. Install Node.js 22 and run `npm ci`.
2. Copy `.env.example` to `.env.local` and provide the required values.
3. Apply `supabase/migrations/0001_waitlist.sql` to a Supabase project.
4. Run `npm run dev`.

Use `npm run verify` before pushing. It runs lint, TypeScript, tests, and a production build.

## Production setup

- Deploy the Next.js app to Vercel.
- Set `NEXT_PUBLIC_SITE_URL=https://vento-us.com` and every variable listed in `.env.example`.
- Add `vento-us.com` in Vercel and use only the DNS records Vercel displays. Preserve existing MX/TXT mail records.
- Verify a Resend sending domain, configure the webhook URL as `/api/resend/webhook`, and store its signing secret.
- Create the founder in Supabase Auth, then insert that user ID into `public.admin_users` with role `owner`.
- Never expose `SUPABASE_SERVICE_ROLE_KEY`, `ABUSE_HASH_SECRET`, or Resend secrets to the browser.

The dashboard is available at `/admin`. The public health endpoint is `/api/health`.
