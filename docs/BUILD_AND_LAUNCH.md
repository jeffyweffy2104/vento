# Vento — design, implementation, and launch instructions

## Approved brand (do not change without review)
- Brand: vento. / monogram V. in the supplied original editorial brand board.
- Background: #17191a; off-white type; restrained, high-contrast serif; lower-case supporting copy.
- Homepage: **Find your people in** followed by a large, same-font rotating city, beginning with **new york city.**, then tokyo., berlin., paris., london., amsterdam., copenhagen. The fixed CTA is **join the waitlist.** No secondary phrases or additional explanatory copy on the homepage.
- About: all **30 approved phrases** retained in `app/about/page.tsx`, subtly pulsating in the background behind a legible mission statement. The background is noninteractive and hidden from assistive technology. Reduced-motion users see a still background.
- About philosophy: “we believe technology is most valuable when it brings us closer to real life.” Curated experiences and meaningful offline connections are explained here, not on the homepage.
- Footer: © 2026 vento. / good things happen offline.
- Signup: “you're invited.” / “good things happen offline.”; capture email, optional phone and separate SMS consent; on successful API response show “you're on the list.” and unique referral URL.

## IMPORTANT: logo fidelity
The supplied original image is a **brand board**, not a standalone vector logo. `public/vento-mark.svg` is currently a typographic approximation. The page now references this asset instead of separately typesetting V. **Before production, replace the SVG with an accurately isolated/vectorized export of the approved V. artwork from the user-supplied board**, with proper transparent margins and crisp rendering at 32–64px. Do not substitute a different font or reinterpret the mark. This is an outstanding asset task, not completed.

## Development
1. Clone repository, check out this PR branch, run `npm install`.
2. Copy `.env.example` to `.env.local` and fill the server-side Supabase variables; never commit secrets.
3. Apply `supabase/migrations/0001_waitlist.sql` to your Supabase project.
4. Run `npm run dev`; check homepage, About, signup, mobile widths, and reduced-motion behavior.
5. Run `npm run build` and `npm run lint` where available before merging. No build/test execution has been verified through this GitHub connector.
6. Configure deployment environment variables and domain on Vercel. Deploy from a reviewed branch; no deployment is claimed.

## MVP engineering priorities / acceptance criteria
1. **Waitlist API hardening:** validate/normalize emails, cap input lengths, reject invalid phone data, implement IP/email rate limits, idempotent duplicate registration, unique referral attribution, and abuse protection. Keep service-role key server-only.
2. **Email delivery:** implement the approved Resend confirmation email, verify sending domain DNS, handle webhook events and retries, and avoid double sends. Current backend does not send mail.
3. **Referral system:** preserve ?ref= on entry, link new verified registrations to the referrer, and add anti-self-referral controls. Track verified users separately from raw signups.
4. **Admin dashboard:** secure authentication and role-based access, signup trends, NYC eligibility, sources/UTM, referral leaderboard, campaign performance, consent records, export, and delivery status. Current endpoint returns only basic stats and is not a UI.
5. **Privacy and compliance:** consent language for marketing email/SMS, STOP/HELP workflows before SMS is enabled, retention/deletion requests, privacy policy, terms, and minimal PII exposure.
6. **Quality:** responsive typography, keyboard navigation, contrast, reduced-motion support, unit/integration tests, and basic observability.
7. **Go-to-market:** creator/venue codes, measurable landing URLs, NYC waitlist segmentation, and campaign attribution. No promise of tokens or payment per unverified signup.

## Review checklist for this PR
- [ ] Home retains approved layout and independently rotating city headline
- [ ] Header uses approved V. artwork after asset replacement
- [ ] About includes every approved phrase, no duplicates or removed copy
- [ ] Text remains legible over animation on desktop/mobile
- [ ] prefers-reduced-motion respected
- [ ] Signup and referral flow regression-tested
- [ ] Production email, security, consent, and deploy tasks separately tracked

## Scope and status
This PR implements the About-page atmosphere and its styles. The preceding foundation PR contains the homepage and initial waitlist scaffold. Neither PR should be described as a fully functioning, deployed product. The logo replacement remains pending an exact asset export.

## Production domain and Vercel hosting — vento-us.com
The founder owns **vento-us.com**. Treat this as the canonical production domain. Ownership was verified directly in the GoDaddy account on 2026-10-14; the earlier `vento-u.s.com` entry was incorrect.

1. Connect GitHub repository `jeffyweffy2104/vento` to a new Vercel project; choose the Next.js framework preset and production branch `main` after review/merge.
2. In Vercel project settings, add `vento-us.com` as the production domain. Add `www.vento-us.com` only if desired, with one canonical redirect.
3. At the domain registrar/DNS host, add **the exact A/CNAME/verification records Vercel displays for this project**. Do not guess DNS targets or overwrite existing MX/TXT records.
4. In Vercel, set `NEXT_PUBLIC_SITE_URL=https://vento-us.com`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO_EMAIL`, and the other documented environment values as appropriate. Keep secrets server-side, out of git, and scope to the required environments.
5. Deploy a preview first, confirm successful build and runtime logs, then deploy production and test HTTPS, root page, /about, mobile animation, waitlist POST, and referral URLs. Configure DNS/SSL only after access to registrar and Vercel is available.
6. Verify the chosen apex or www redirect, HTTPS, favicon, metadata, robots policy, analytics and 404 behavior. Add an uptime monitor and error alerting before public launch.

**Status:** No Vercel project, domain DNS record, or production deployment has been created or verified through these commits.

## Official mailbox and branded outgoing email
The founder has an existing official Vento email account; **its exact address and provider are not yet supplied**. Never replace its MX records or presume it is hosted by Resend. Use the actual address for `RESEND_FROM_EMAIL` and optional `RESEND_REPLY_TO_EMAIL` only after confirming the mailbox and sending-domain setup.

- `lib/email-template.ts` contains a reusable charcoal/off-white HTML email shell and the approved waitlist confirmation copy, including the personal referral URL. It is a template, **not a live mail send**.
- Before using Resend, verify the appropriate sending domain/subdomain with the DNS records Resend specifies (SPF/DKIM, and DMARC where applicable). Coordinate with existing mail-provider SPF/DKIM/MX records; don't break inbound email.
- For founder outreach, use the official mailbox with a matching Vento display name, approved **V.** signature/logo asset, and branded footer. HTML email client support varies: include plain-text fallback and a text-based logo fallback; avoid relying on animations in email.
- For automated confirmation, integrate Resend server-side after successful verified registration; log provider IDs, deduplicate sends, handle bounces/complaints and webhooks, and implement retry policy.
- For marketing messages, obtain appropriate consent and include required sender identity, mailing address, and unsubscribe mechanisms. Transactional confirmation and promotional campaigns should be classified and handled separately.
- Confirm that referral links in email use `https://vento-us.com/?ref=CODE`, not localhost or an old placeholder.

### Release checklist
- [ ] Founder supplies exact business email address and mailbox provider
- [ ] Founder connects GitHub and Vercel accounts and adds owned domain
- [ ] Registrar DNS and Vercel domain verified without disrupting email
- [ ] Official sender domain verified and branded email tested across major clients
- [ ] Approved original V. logo exported from supplied brand board and installed as final asset
- [ ] End-to-end waitlist, referral, consent, email and delivery tested
- [ ] Privacy policy, unsubscribe, abuse controls, and secure admin access implemented
- [ ] Preview and production builds pass and are manually reviewed
