"use client";

import { useEffect, useRef, useState } from "react";
import { Mesh, PerspectiveCamera, Scene, Vector2, WebGLRenderer } from "three";
import { createRibbonGeometry } from "./RibbonGeometry";
import { createLiquidMaterial } from "./materials/liquidMaterial";

type RendererState = "loading" | "ready" | "fallback";

export default function LiquidSculpture() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RendererState>("loading");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let renderer: WebGLRenderer | undefined;
    let frame = 0;
    let visible = true;
    let disposed = false;
    let start = performance.now();

    if (new URLSearchParams(window.location.search).get("gpu") === "off") {
      setState("fallback");
      return;
    }

    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: true });
    } catch {
      setState("fallback");
      return;
    }

    const scene = new Scene();
    const camera = new PerspectiveCamera(34, 1, 0.1, 40);
    camera.position.set(0, 0, 10.2);
    const geometry = createRibbonGeometry();
    const material = createLiquidMaterial();
    const mesh = new Mesh(geometry, material);
    mesh.rotation.z = -0.13;
    scene.add(mesh);
    renderer.setClearColor(0x070708, 0);
    renderer.domElement.className = "liquid-canvas";
    renderer.domElement.setAttribute("data-renderer", "webgl");
    host.appendChild(renderer.domElement);

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height || !renderer) return;
      const mobile = width < 700;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 1.75));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = mobile ? 12.8 : 10.2;
      mesh.scale.set(mobile ? .82 : 1, mobile ? .92 : 1, 1);
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.05 });
    intersectionObserver.observe(host);

    const target = new Vector2(.5, .5);
    const onPointerMove = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect();
      target.set((event.clientX - bounds.left) / bounds.width, 1 - (event.clientY - bounds.top) / bounds.height);
    };
    host.addEventListener("pointermove", onPointerMove, { passive: true });
    const onContextLost = (event: Event) => { event.preventDefault(); cancelAnimationFrame(frame); setState("fallback"); };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    const render = (now: number) => {
      if (disposed || !renderer) return;
      const motion = reducedMotion.matches ? 0 : 1;
      material.uniforms.uMotion.value = motion;
      material.uniforms.uPointer.value.lerp(target, motion ? .045 : 1);
      material.uniforms.uTime.value = motion ? (now - start) / 1000 : 2.4;
      if (visible || reducedMotion.matches) renderer.render(scene, camera);
      if (!reducedMotion.matches) frame = requestAnimationFrame(render);
    };
    setState("ready");
    frame = requestAnimationFrame(render);

    const onMotionChange = () => { start = performance.now(); cancelAnimationFrame(frame); frame = requestAnimationFrame(render); };
    reducedMotion.addEventListener("change", onMotionChange);
    return () => {
      disposed = true; cancelAnimationFrame(frame); resizeObserver.disconnect(); intersectionObserver.disconnect();
      reducedMotion.removeEventListener("change", onMotionChange); host.removeEventListener("pointermove", onPointerMove);
      renderer?.domElement.removeEventListener("webglcontextlost", onContextLost);
      geometry.dispose(); material.dispose(); renderer?.dispose(); renderer?.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className={`liquid-sculpture is-${state}`} data-state={state} data-testid="liquid-sculpture" />;
}
