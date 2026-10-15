# Vento / 222: evidence-driven reconstruction and redesign master engineering specification
Status: implementation-ready investigation plan; **222 has not yet been fully observed**. Owner: Vento. Date: 2026-10-14.

## 0. Goal and non-goals
Reconstruct the **observable product behavior** of https://222.place/ and https://222.place/recover-abc-onboarding?utm_source=landing (verify all redirects), across marketing, web app, signup, SMS/iMessage handoff, and subsequent consented messaging. Use that evidence to design an independent Vento frontend and backend with our own UX, data, services, branding and media. Do **not** claim access to 222 private source code, algorithms, databases or server infrastructure. No credential bypass, anti-bot circumvention, scraping private user data, or copying proprietary media/branding. Use authorized accounts and test numbers; stop on authentication, rate-limit or access boundaries.

## 1. Existing Vento baseline (audited 2026-10-14)
- Repo: jeffyweffy2104/vento; Next.js 15, React 19, TypeScript, Supabase JS, Resend, Svix, Zod, Vitest; npm run verify executes lint, typecheck, tests, build.
- app/page.tsx has a rotating city headline, join waitlist form, email, optional phone/city, explicit SMS consent, honeypot, UTM/ref attribution, /api/waitlist submit and verification pending state. Preserve these functional semantics.
- app/globals.css uses charcoal #17191a, off-white #f5f2ec, Didot/Bodoni typography and editorial negative space. Existing /about, /admin, /verify, /terms, /privacy, /api routes must not regress.
- README documents Supabase migrations, founder dashboard, Resend webhook, Vercel and vento-us.com. Do not replace existing working integrations. Confirm actual deployment status separately.
- **Design conflict requiring explicit resolution**: current app/page.tsx headline is "Find your people in [city]" and CTA includes an arrow; approved direction is all lowercase, "this night has potential." as a hero concept, "nyc first. everywhere next.", "good things happen offline.", and a single-line plain-text "join the waitlist." with no arrow/underline/icon/pill. Implement design changes in a dedicated reviewed PR, not in this spec PR.

## 2. Tooling: REA (morluto/rea)
Source: https://github.com/morluto/rea; docs/browser-observation.md and docs/web-network-captures.md. REA supports passive CDP website inspection, screenshots, script/bundle analysis, ordered session observations, evidence export and comparisons. **REA passive CDP is not a general browser automation tool**. For repeatable clicks/forms, use a separate owned Playwright browser/scenario harness. For HAR analysis, capture only authorized traffic and redact cookies, bearer tokens, phone numbers, email, identifiers and message bodies.
- Runtime: supported Node.js >=22.19 (or supported 24/26), npm, Chrome-family browser, loopback CDP endpoint, dedicated test profile. Check latest official setup and CLI help; do not assume undocumented commands.
- Setup: `npx rea-agents setup`; register in the chosen agent and restart. Launch dedicated Chrome with `--remote-debugging-port=9222 --user-data-dir=/tmp/rea-222-profile` and manually navigate to the target. Never expose the CDP port to a public interface.
- Inspect via `rea list-browser-targets`, `rea inspect-web-page`, `rea capture-web-screenshot`, `rea observe-web-session`, `rea analyze-web-bundle`, `rea compare-web-captures`, `rea compare-web-screenshots`, and `rea export-evidence-bundle` where supported by installed CLI; verify command syntax with `rea --help` and docs before use.
- REA provides evidence, not authoritative recovery of backend logic. An evidence manifest must accompany each finding.

## 3. Discovery and capture protocol
### 3.1 Target inventory
Seed routes: `/`, `/recover-abc-onboarding?utm_source=landing`. Enumerate links, SPA transitions, redirect chains, relevant robots/sitemap and browser-visible routes; do not fabricate endpoints. Separate public, user-authenticated and inaccessible routes. Record route, query parameters, state, viewport, capture timestamp, auth mode, evidence IDs and limitations.
### 3.2 Viewport matrix
Desktop 1440x900 and 1920x1080; tablet 768x1024; mobile 390x844 and 375x812. Capture initial render, settled render, hover/focus, scroll, loading, errors, validation, success, back-navigation, reload, reduced motion, low bandwidth and no-autoplay fallback.
### 3.3 Behavioral map
For each CTA/input/modal/page: record preconditions, action, next state, visible copy, accessibility tree, URL/history changes, network observations and failure behavior. Run only with owned test identities and consent. For iMessage deep links: capture the URL scheme, fallback path and user-consent boundary; test the conversation on a device with a controlled number, never send messages to arbitrary people.
### 3.4 Browser/network
Collect DOM tree, CSS computed tokens, typography, spacing, breakpoints, motion timing, resource URLs, JS chunk graph, public client-side route candidates, request methods/status and **redacted** request/response schemas. Treat third-party code as untrusted; no server endpoint probing beyond normal app interactions.
### 3.5 Deliverables
`research/222/route-inventory.csv`, `state-machine.md`, `component-catalog.md`, `design-tokens.json`, `network-contracts.md`, `messaging-handoff.md`, `evidence-manifest.json`, `unknowns.md`, `parity-matrix.csv`, redacted screenshot artifacts and test scenario fixtures. Evidence manifest fields: ID, target URL, action, timestamp, viewport, artifact path, SHA-256, finding, confidence [observed|inferred|unknown], redaction status.

## 4. Frontend reference -> Vento design translation
Build a **clean-room, original** implementation using observed interaction patterns, not pixel-perfect copying of 222's proprietary creative assets.
- Retain matte charcoal/near-black background, editorial all-lowercase typography, generous negative space and static approved hero copy; keep city rotation as a subtle secondary line where approved.
- Background film: original/licensed international nightlife footage (NYC, Berlin, Paris, London, Tokyo, Miami). FFmpeg deterministic 12-20s silent montage, 1-2s shots, grayscale, subtle blur/grain, dark overlay, 16:9 desktop and 9:16 mobile crops, H.264 MP4 and poster; preserve rights/source metadata and avoid unverified city labels.
- Vento bot: tiny walking character at bottom edge, oversized Mega-Man-like head, little feet/arms, matte-black 3D shell, smoky reflective face, blinking/peeking/walking/idle/jumping/happy states; should not obscure CTA/forms. Use a performant sprite sheet or rigged model (R3F only if profiling justifies it). No incessant motion; respect prefers-reduced-motion and pointer/touch accessibility.
- Glass effect only as restrained specular highlights/refraction on mascot and occasional interactive surface; **not** glass across the whole site.
- Preserve a single-line unadorned "join the waitlist." CTA, waitlist consent language and referral flow. Confirm brand language in design review; no arbitrary rewrites.
- Implement token system (CSS variables), responsive components, storybook-like component fixtures, Playwright screenshots and image diffs. Target perceptual **design consistency**, not identical 222 brand assets.

## 5. Backend equivalent (independent implementation)
Design entities: users, identities, profiles, cities, interests, venues, experiences, recommendations, invitations, social connections, conversations, messages, onboarding_sessions, onboarding_answers, consents, waitlist_entries, referrals, notification_preferences, outbound_messages, delivery_events, audit_events. **These are proposed Vento entities, not claims about 222 schema**.
- Auth: Supabase Auth or existing strategy; least-privilege RLS, server-side authorization, session expiry, rate limits.
- Onboarding: versioned declarative state machine; persist checkpoints and resume tokens, typed validation, conditional branching, idempotent submit, retries and explicit consent.
- Messaging: provider adapter (e.g. SMS via approved provider); iMessage availability and API rights require separate feasibility verification. Never claim arbitrary programmatic iMessage bot access. Consent capture, opt-out (STOP), quiet hours, delivery webhooks, replay-safe event ingestion, dedupe, audit trail.
- Discovery/recommendations: Vento-owned candidate retrieval, ranking and feedback, opt-in location, cold-start fallback; no unverified claim of reproducing 222 ranking algorithm.
- Social graph and plans: invitations, RSVP states, friend referrals, user blocking/reporting, abuse prevention, privacy controls.
- Agent orchestration: typed tool permissions, explicit confirmation for consequential actions, prompt-injection defenses, audit logs, cost budgets and fallback to deterministic rules.
- Admin/CRM: preserve existing /admin; add cohort funnels, waitlist source/referral, message deliverability, support and moderation, retention controls.
- API contract candidates (not observed 222 endpoints): POST /api/onboarding/sessions; PATCH /api/onboarding/sessions/:id; POST /api/invitations; GET /api/discover; POST /api/messages/webhooks/:provider. Specify Zod schemas, auth, idempotency, pagination, errors, observability and tests before implementation.
- Security: encryption in transit/at rest, secrets only server-side, consent versioning, retention/deletion policies, access logging, PII minimization, user data export/delete; review US SMS rules and platform/provider requirements before sending.

## 6. Deterministic media engine
Input: manifest of user-owned/licensed videos with SHA-256, city tag (only if verified), source/rights, optional start/end. Scene detection may **propose** shots, but selection becomes deterministic only after storing timestamps/seed/version. Emit immutable edit manifest containing sorted clips, in/out points, scale/crop anchors, cut times, filters, encoder/version, source digests. FFmpeg normalizes fps/resolution/colorspace, trims, crops, grades, joins, compresses and creates poster. Outputs: desktop.mp4, mobile.mp4, poster.webp, edit-manifest.json and attribution.json. Re-run with pinned FFmpeg version and assert frame count, dimensions, duration and checksum in CI. Fallback to poster for reduced motion and constrained devices.

## 7. Phased implementation / PR queue
**PR-0 (this PR):** engineering specification only; no production UI changes.
**PR-1 Audit and tooling:** confirm REA environment, enumerate Vento existing routes/migrations/tests, Playwright test harness, artifact redaction, reproducible capture runbook. Gate: safe reproducible baseline.
**PR-2 Reference capture:** 222 marketing, public app, onboarding and consented messaging observations; evidence manifest and unknowns. Gate: every claim linked to artifact; no invented private architecture.
**PR-3 UX parity design:** state diagrams, components, responsive layouts, reference-to-Vento translation, design review. Gate: approved visual tokens and exact approved copy.
**PR-4 Media pipeline:** deterministic FFmpeg engine, fixtures, licensing manifest, desktop/mobile outputs, autoplay/reduced-motion fallback. Gate: repeatable outputs and performance budget.
**PR-5 Mascot:** original character assets, state machine, interaction and accessibility tests. Gate: animation does not block primary conversion.
**PR-6 Landing experience:** layer video and mascot into current Next.js homepage; preserve working waitlist, consent, referrals, email and SEO. Gate: verified signup flow across breakpoints.
**PR-7 App foundation:** profiles, onboarding engine, authenticated flows, Supabase migrations/RLS and typed API. Gate: migrations reversible, integration tests pass.
**PR-8 Messaging and agent:** provider feasibility, opt-in/out, orchestration and safety. Gate: consented end-to-end tests with controlled identities.
**PR-9 Discovery/social beta:** curated experiences, social graph, invitations and recommendation v1. Gate: abuse controls, privacy and event instrumentation.
**PR-10 Production:** observability, alerts, CI, rollout/rollback, accessibility, load and security checks; staged Vercel deployment.

## 8. Test and launch criteria
- CI: `npm run verify`; Playwright E2E smoke flows; visual snapshots; accessibility checks; API contract and RLS tests; migration tests.
- Metrics: LCP target <=2.5s on representative mobile, CLS <=0.1, smooth 30fps+ mascot on low-end mobile (target 60fps on modern), media budget established after profiling, no autoplay audio.
- Funnel: landing_view -> waitlist_open -> waitlist_submit -> verification_sent -> verified -> referral_shared -> onboarding_started -> onboarding_completed -> first_plan_created. Respect consent and privacy settings.
- Explicit release gates: no regression to existing verified waitlist, referral attribution, Resend webhooks, SMS consent or /admin; valid mobile fallback; legal media provenance; ability to disable video/mascot with feature flags; rollback tested.

## 9. Risks and unknowns
1. 222 may gate app routes or messaging behind login/invite; report inaccessible areas rather than invent them.
2. REA is primarily passive for browser analysis; use separate owned Playwright scenarios for interaction.
3. iMessage programmatic capability is not established; verify provider/product constraints before designing a production integration.
4. Public browser requests cannot reveal internal services/data models with certainty.
5. Video and brand asset licenses require provenance.
6. Current Vento homepage does not match all approved copy/styling; protect production until design review.
7. Supabase/Resend/Vercel operational state and external credentials are not validated by reading the repo.

## 10. Immediate operator checklist
1. Read `docs/BUILD_STATUS.md`, `docs/BUILD_AND_LAUNCH.md`, Supabase migration, existing tests and API handlers; inventory baseline.
2. Install/configure official REA in an isolated analysis environment; inspect `docs/browser-observation.md`, `docs/web-network-captures.md`, `docs/website-script-export.md` and `docs/cli.md`.
3. Create test accounts/number only with authorization; map 222 public route tree and onboarding; export redacted evidence.
4. File separate implementation PRs in the above order; do not bundle speculative backend implementation with evidence collection.
5. Require approval on visual mockups and exact hero/CTA copy before modifying the production landing page.

**Definition of done for this spec PR:** plan is actionable, rooted in inspected Vento code and official REA documentation, separates observed vs inferred claims, preserves current infrastructure, and sets measurable phase gates. No 222 capture or Vento product implementation is represented as complete.
