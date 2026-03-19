"use client";

import dynamic from "next/dynamic";
import ScrollChoreography from "@/components/canvas/ScrollChoreography";

// Only Scene uses Three.js (~500KB) — dynamic to not block FCP/LCP
// ScrollChoreography is lightweight (just GSAP + ScrollTrigger) — keep static
// so it registers the preloaderComplete listener BEFORE the event fires
const Scene = dynamic(() => import("@/components/canvas/Scene"), { ssr: false });

export default function ClientScene() {
  return (
    <>
      <Scene />
      <ScrollChoreography />
    </>
  );
}
