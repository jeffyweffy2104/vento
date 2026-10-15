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
- 222 reconstruction PR-1 foundation: architecture boundary ADR, safe capture runbook, ignored raw-evidence area, redaction utility, route/parity templates, and desktop/mobile Playwright smoke coverage.
- 222 reconstruction PR-2 public capture: landing, About, Contact, phone entry, Messages handoff, fallback transition, responsive behavior, and passive REA evidence documented without submitting personal data.

## Live infrastructure

- Vercel Hobby deployment is live at `https://vento-us.com`.
- Supabase project and initial migration are configured; the founder owner is provisioned.
- Resend sending domain `updates.vento-us.com` is verified and the signed webhook is configured.
- The 222 evidence capture and reconstructed product surfaces are not yet production-complete.

## Remaining external launch gates

- Replace the approximate `public/vento-mark.svg` with the approved source export when supplied.
- Review legal copy with counsel before sending marketing SMS; SMS delivery is intentionally not enabled.
- Verify any messaging provider/API and Apple platform requirements before representing an iMessage handoff as functional.
- Observe post-verification behavior only with an owner-controlled test number and explicit authorization; it is not required to design the public Vento foundation.

## Verification

`npm run verify` is the source release gate. `npm run test:e2e:install && npm run test:e2e` verifies browser smoke coverage.
