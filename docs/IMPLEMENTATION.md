# Vento launch foundation

Brand: `v.` expands to `vento.`. Homepage headline: `find your people anywhere.` Existing 30 phrases rotate independently; About page holds the description. Email copy: `you're on the list.` / `we're building a new way to bring people together to meet, connect, and experience more.` / `talk soon.`

Required before production: connect Supabase, implement waitlist API, transactional email via Resend with verified domain, unique referral links and attribution, email verification, idempotent send/outbox, SMS consent, rate limits, privacy policy, founder dashboard with authentication, deliverability webhook tracking, and test deployment. Domain mailboxes `jeffrey@DOMAIN`, `hello@DOMAIN`, `partners@DOMAIN` must be configured by the domain owner.

The current PR is a scaffold, not a live service. Hosting on Vercel Hobby requires checking commercial-use eligibility.

Reference implementations: vercel/next.js, supabase/supabase, steven-tey/dub, useplunk/plunk, PostHog/posthog, shadcn-ui/ui, grammyjs/grammY, twilio/twilio-node.
