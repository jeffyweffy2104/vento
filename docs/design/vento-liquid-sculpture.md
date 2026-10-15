# Vento — Cinematic Liquid Glass Sculpture: Codex Engineering Specification

Status: design/engineering handoff, documentation only. 2026-10-14.



## Non-negotiable visual references

**Reference A — user screenshot 1 (Vento editorial mockup):** near-black canvas; vento. top left, 01 / NYC top right; dominant sculpture stage; centered 'this night has potential.' then 'find your people anywhere.' then one-line plain-text 'join the waitlist.' Footer: 'nyc first. everywhere next.' and 'good things happen offline.' The layout, typography, hierarchy and restraint come from this screenshot.

**Reference B — user screenshot 2 (liquidglassdesign.com):** one flowing, elongated, glossy, almost-black/transparent liquid-glass ribbon with sharp white/silver/blue specular streaks and restrained spectral cyan, violet, red iridescence on pure black. The fluid geometry, continuous organic movement, highlights and material come from THIS image. It is NOT a chrome torus, glass button, floating bubble or grid.

**Reference C — Codrops Infinite Liquid Glass Grid:** https://tympanus.net/codrops/2026/09/08/building-an-infinite-liquid-glass-grid-with-three-js-webgpu-and-tsl/ . Inspiration for real-time refraction, shader normals, fluid interaction and GPU rendering ONLY. DO NOT copy the grid layout.

Existing approved landing-page screenshot and copy supersede earlier unapproved assistant prototypes. The existing Figma experiment (https://www.figma.com/design/omEnDApPq1lCRuBVYAXuRM) is exploratory, not the source of truth.



## Product goal and rejection criteria

Replace/augment the EXISTING Next.js landing hero with a continuous GPU-rendered liquid ribbon, retaining the approved Vento visual composition. The ribbon should stretch and fold across a black visual stage, partially disappear into black negative space, refract a subtly moving black-and-white nightlife world, and change its optical highlights continuously. Cinematic Berlin-underground editorial tone, not SaaS glassmorphism.

FAIL if the hero resembles: rectangular glass tiles, pill/buttons, a CSS gradient blob, jelly orb, chrome torus, generic rainbow fog, static PNG, or video merely masked inside a shape. FAIL if the CTA gains an arrow, icon, underline or pill. FAIL if the existing waitlist stops working.



## Audit and preserve the existing application

Repo: jeffyweffy2104/vento. Next.js 15, React 19, Supabase, Resend, existing /api/waitlist, attribution/referral flows and Playwright tests. Read app/page.tsx, stylesheet, layout, public assets, package.json, tests and API before edits. Preserve the backend request schema, referral/UTM capture, email verification, consent, privacy/terms links, honeypot and success/error behavior. Current page rotates city names and has a CTA arrow; reconcile copy/layout to the approved reference WITHOUT rewriting backend. Keep HTML heading and CTA outside WebGL canvas for SEO/accessibility. No backend migrations or secrets changes.



## Visual composition

Desktop target 1440x900, mobile 390x844. Background #070708 near-black, editorial typography, generous negative space. Small vento. brand at upper left, 01 / NYC upper right. Wide central visual sculpture: a thin continuous S-shaped ribbon/film passing diagonally through the frame, with asymmetrical folds, tapered sections and overlapping near/far contours; not a rectangular image. Beneath/around stage place centered exact headline 'this night has potential.', smaller 'find your people anywhere.', then 'join the waitlist.' as a one-line plain text CTA. Footer fine rule and exact lines 'nyc first. everywhere next.' and 'good things happen offline.' Keep approved visual choices elsewhere. No decorative UI additions.

Use muted, black-and-white footage of Berlin, NYC, Paris and London nightlife subtly behind/around the glass. User previously provided four MP4 files in chat; inspect repo public assets first, do not assume uploaded chat assets are already in GitHub. If absent, create asset manifest with expected filenames and ask for assets. No hotlinking or unlicensed downloads. Clips should cut/crossfade every 1–3 seconds with muted inline autoplay, compressed H.264 MP4/WebM options and poster fallback. Keep footage low-exposure and secondary to the glass.



## Technical rendering requirements

Client-only isolated rendering boundary dynamically imported into existing Next.js app. Preferred Three.js with WebGPU/TSL shaders if supported; feature-detect WebGPU and implement a tested WebGL2 fallback, plus deliberate static poster fallback. Do not assume WebGPU works on iPhone Safari. React Three Fiber optional, only if appropriate to existing architecture. Pin compatible dependency versions.

Ribbon geometry: parametric spline/strip with sufficiently dense segments, variable width and taper, asymmetrical self-overlapping folds, smooth normals and a thin-film silhouette. Continuous temporally coherent deformation via low-frequency traveling waves/curl noise, not a single repeating sine wobble or simple rotation. Maintain an art-directed overall silhouette similar to screenshot B.

Material: mostly clear/graphite transmissive glass; Fresnel edge reflections; scene/environment refraction with dynamic normal distortion; spatially variable roughness; sharp animated specular highlights; restrained chromatic dispersion at grazing angles; subtle cyan/blue/violet with rare red spectral accents. Aim for narrow bright streaks against black, not diffuse glowing gradients. Use a physically motivated screen-space approximation if full transmission is prohibitively costly, document tradeoffs and show comparisons. CSS backdrop-filter or SVG turbulence alone is not acceptable.

Motion: continuously flowing 12–25 second non-obviously looping deformation; mostly stationary camera; shape flows rather than spins. Pointer/touch creates gentle localized ripple/bend with spring recovery, not a draggable button or a massive scene shift. Drive interaction via refs/uniforms, avoid React rerender each frame. Stop or throttle offscreen/hidden. Respect prefers-reduced-motion with composed still.

Lighting: dark studio environment with tight silver/white highlights, selective prismatic spectral edges. Avoid broad colorful ambient fog. Optional environment map must be properly licensed and optimized.



## Proposed module boundaries

- components/hero/LiquidSculpture.tsx — client boundary, feature detection, ResizeObserver, fallback.

- components/hero/LiquidScene.tsx — camera, render loop, renderer lifecycle, device loss.

- components/hero/RibbonGeometry.ts — spline, width profile, mesh and normals.

- components/hero/materials/liquidMaterial.ts — TSL/shader optical parameters.

- components/hero/NightlifeReel.tsx — approved footage, muted looping/cuts, poster.

- components/hero/StaticSculptureFallback.tsx — intentional art-directed fallback.

- lib/hero/performance.ts — DPR, adaptive quality, visibility and reduced-motion.

Adjust exact paths to repo conventions; no unnecessary framework rewrite.



## Performance, accessibility, responsive

Target 60 fps desktop and at least 30 fps contemporary supported iPhones. Cap DPR around 1.75 desktop / 1.5 mobile, adapt to actual frame time. Minimize multipass buffers and video texture sizes. Poster loads first without layout shift or black flash. Canvas must not intercept CTA/form pointer or keyboard input. Ensure heading/CTA remain accessible HTML and contrast remains readable. Test iPhone Safari, desktop Safari/Chrome/Firefox, unsupported WebGPU, low-power and reduced-motion. Provide graceful WebGL2/poster fallback; handle device loss.



## Codex implementation sequence

1. Inspect code/assets/tests; record current landing screenshot and npm run verify baseline.

2. Build a standalone geometry+optics spike FIRST. Capture 10–20 seconds of idle animation and interaction. Compare against screenshot B; reject blob/grid/torus/card results BEFORE integration.

3. Integrate approved editorial layout (screenshot A) and real monochrome nightlife footage. Keep existing functional waitlist form/API, validation, consent, referral and verification intact.

4. Add mobile quality tier, reduced motion, device-loss/unsupported GPU fallback, adaptive DPR and asset handling.

5. Record screenshots at 1440x900 and 390x844, 10–20s motion clips, FPS measurements and browser compatibility matrix. Include before/after comparison in implementation PR.

6. Run npm run verify and npm run test:e2e. Add regression coverage for exact CTA (no arrow), functional signup, unsupported GPU, reduced motion and no horizontal overflow.



## Definition of done

Single physically dimensional, fluid glass ribbon; realistic animated normals, refraction and moving specular streaks; composition matches screenshot A, material/motion matches screenshot B; actual approved B&W footage or clearly documented missing assets; exact copy and one-line text CTA; functional existing backend; mobile and fallback quality; screenshot/video proof and passing tests. Do not present a CSS simulation as completed shader implementation.



## Handoff notes

The two reference screenshots were supplied in the 2026-10-14 ChatGPT conversation and are not necessarily in this repository. Obtain and commit approved image references to docs/design/references before judging visual acceptance. If needed ask for missing footage; never substitute stock clips silently. Preserve everything not explicitly changed. This PR is ONLY the engineering spec, not a claim that the liquid shader has been built.