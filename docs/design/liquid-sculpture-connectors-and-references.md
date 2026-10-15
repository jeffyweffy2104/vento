# Vento liquid sculpture — connector and reference implementation map

Companion to [the authoritative engineering spec](./vento-liquid-sculpture.md). **Do not install everything listed.** First audit current repo, select minimal compatible dependencies, inspect licenses, and record decisions.

## Connected workflow / tools
1. **GitHub connector (available)** — repository https://github.com/jeffyweffy2104/vento . Read existing files and CI; Codex opens a separate implementation branch and PR. Do not push directly to main. Use review and status checks.
2. **Figma connector (available)** — editable exploratory file https://www.figma.com/design/omEnDApPq1lCRuBVYAXuRM . Inspect typography/spacing only; the two user-supplied screenshots are more authoritative than the exploratory Figma frames. Figma does not reproduce the actual live GPU shader.
3. **Codex coding agent** — implement in actual Next.js repository, run development server, capture 10–20s real browser video, iterate until screenshot B material is convincingly matched. Do not accept code-only or screenshot-only validation.
4. **Playwright (already installed in repo)** — https://github.com/microsoft/playwright and https://playwright.dev/ . Test desktop/mobile layouts, no CTA arrow, real signup, keyboard navigation, reduced-motion and fallback.
5. **Vercel** — https://vercel.com/docs . Use existing deployment/preview workflow; no Vercel connector connection is asserted. Check environment variables and preview domain configuration without exposing secrets.
6. **iPhone Safari / WebKit device test** — https://webkit.org/ . Real device or supported device farm required to validate shader fallback, touch, thermals, frame rate. Simulator screenshots alone do not prove real GPU performance.
7. **Approved asset pipeline** — inspect public/ and obtain the user-provided four MP4 nightlife clips if absent. Use ffmpeg https://ffmpeg.org/ for compression/posters if installed. Track source and license; do not scrape or hotlink copyrighted footage.

## Reference projects and docs
- **Codrops Infinite Liquid Glass Grid article** — https://tympanus.net/codrops/2026/09/08/building-an-infinite-liquid-glass-grid-with-three-js-webgpu-and-tsl/ . Study renderer, TSL, normals, refractive treatment and interaction. **Not** the desired grid layout. Follow any source-code link from the article and check the actual license before copying.
- **Three.js** — https://github.com/mrdoob/three.js ; https://threejs.org/docs/ . Primary candidate for WebGPU/TSL, scene textures, ribbon mesh, shaders, WebGL fallback. Verify actual API against installed version.
- **React Three Fiber** — https://github.com/pmndrs/react-three-fiber ; https://r3f.docs.pmnd.rs/ . Optional React scene abstraction; weigh bundle size and React 19 compatibility.
- **Drei** — https://github.com/pmndrs/drei . Optional scene helpers only.
- **Next.js** — https://github.com/vercel/next.js ; https://nextjs.org/docs . Keep existing Next.js 15 application architecture and SSR-safe dynamic import.
- **WebGPU spec** — https://www.w3.org/TR/webgpu/ . Feature detection, failure and device-loss handling; provide WebGL2/static fallback.
- **Motion** — https://github.com/motiondivision/motion . Optional form/DOM transitions, not ribbon rendering.
- **GSAP** — https://github.com/greensock/GSAP . Optional controlled timing, verify license/bundle impact; not required.
- **liquid-glass-react** — https://github.com/aberhamm/liquid-glass-react . Useful to understand UI glass refraction, **not** a replacement for flowing 3D ribbon.
- **Liquid Glass Design visual reference** — https://liquidglassdesign.com . User's second screenshot is the specific material target; do not assume rights to reuse its imagery.
- **Figma exploration** — https://www.figma.com/design/omEnDApPq1lCRuBVYAXuRM . Secondary to user screenshots.

## Library selection decision record required in implementation PR
For every added library, note: intended responsibility, version compatibility with Next.js 15/React 19, bundle/runtime cost, license, WebGPU and WebGL fallback, mobile Safari behavior, and why existing code cannot suffice. Prefer Three.js plus minimal helpers over adding many UI glass libraries.

## Agent startup checklist
1. Read docs/design/vento-liquid-sculpture.md and inspect current source.
2. Get the two original reference screenshots into docs/design/references/ with provenance; request if unavailable.
3. Inventory licensed footage in public/; request missing clips.
4. Build a standalone *single flowing ribbon* shader spike and provide moving proof before changing layout.
5. Integrate while retaining existing Supabase waitlist, referrals, consent, and email verification.
6. Test desktop/iPhone, reduced motion, WebGL2 and static fallback, then open PR with evidence.

**Reject** rounded glass pills, grid cards, generic blobs, chrome torus, rainbow gradients, static mockups, fake waitlist confirmation, and unverified performance claims.
