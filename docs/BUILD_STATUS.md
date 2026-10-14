# Vento build status

## Complete in source

- Responsive approved homepage and 30-phrase About atmosphere.
- Accessible reduced-motion, keyboard, empty, loading, success, and error states.
- Validated waitlist with durable abuse records and privacy-preserving IP/email hashes.
- Idempotent signup handling, referral attribution, campaign/UTM capture, and self-referral prevention.
- Email verification, branded confirmation email, delivery ledger, and signed Resend webhook handling.
- Supabase schema, indexes, constraints, RLS, administrator roles, and audit events.
- Authenticated founder dashboard with totals, trends, sources, referrals, and recent signups.
- Privacy, terms, robots, sitemap, 404, security headers, health endpoint, and social metadata.
- Automated lint, type, unit test, production build, and GitHub Actions verification.

## External launch gates

- Create/configure Supabase project and apply migration.
- Create founder Supabase Auth user and `admin_users` owner row.
- Confirm the exact official mailbox/sender and verify Resend DNS.
- Set production environment values in Vercel.
- Connect `vento-u.s.com` using Vercel-provided DNS values without replacing mail records.
- Replace the approximate `public/vento-mark.svg` with the approved source export when supplied.
- Review legal copy with counsel before sending marketing SMS; SMS delivery is intentionally not enabled.

## Verification

`npm run verify` is the release gate.
