"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const LiquidSculpture = dynamic(() => import("./LiquidSculpture"), { ssr: false });

export function HeroStage() {
  return <div className="hero-stage" aria-hidden="true">
    <Image className="hero-poster" src="/liquid-ribbon-fallback.svg" alt="" fill priority sizes="100vw" />
    <LiquidSculpture />
  </div>;
}
