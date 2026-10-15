# ADR 0002: Liquid sculpture renderer

- Status: accepted for initial production implementation
- Date: 2026-10-14

## Context

The approved landing direction requires a continuously deforming, optically dimensional ribbon with GPU rendering, interaction, reduced-motion handling, and broad mobile fallback support. The repository has no 3D runtime or licensed nightlife footage. The original visual-reference screenshots and four owner-provided MP4 files are also not present in the repository.

## Decision

Adopt Three.js `0.186.1` under its MIT license as the only new runtime dependency. Implement a client-only `WebGLRenderer` boundary with custom GLSL ribbon deformation and a physically motivated screen-space material approximation. Use bounded device-pixel ratio, visibility throttling, context-loss recovery, reduced-motion still rendering, and an authored SVG poster underneath the canvas.

Do not add React Three Fiber, Drei, GSAP, Motion, or a UI glass library. The scene is one mesh and one camera; direct Three.js lifecycle management is smaller and makes per-frame mutation explicit.

Three.js documents `WebGPURenderer` as experimental and states that custom `ShaderMaterial` is unsupported there; it requires a TSL/node-material port. The first production renderer therefore uses maintained WebGL2/WebGL with an intentional static fallback. A WebGPU/TSL backend is a follow-up optimization only after the visual material is accepted and measured on real devices. This avoids maintaining two unapproved shaders before the missing references are restored.

## Optical tradeoff

Until licensed footage is supplied, the shader refracts an internal low-exposure procedural field rather than an environment video texture. This is a real GPU shader, not a CSS blob or masked video, but it is not represented as final footage integration. The final media pass must use the asset manifest and preserve licensing metadata.

## Evidence and references

- Three.js WebGPU renderer and fallback documentation: https://threejs.org/manual/en/webgpurenderer.html
- Three.js WebGL renderer documentation: https://threejs.org/docs/#api/en/renderers/WebGLRenderer
- Next.js client-only dynamic import guidance: https://nextjs.org/docs/app/guides/lazy-loading
- Dependency record: Three.js 0.186.1, MIT, approximately 20.4 MB unpacked package size; production bundle is tree-shaken and measured during build.

## Consequences

The implementation works without missing media and fails deliberately to the authored poster when GPU setup or context recovery fails. Final material matching, nightlife refraction, WebGPU parity, and real iPhone thermal/FPS acceptance remain gated by owner assets and device testing.
