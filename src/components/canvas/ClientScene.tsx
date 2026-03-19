"use client";

import dynamic from "next/dynamic";

// Dynamic imports: Three.js scene (~500KB) loads async, not blocking FCP/LCP
const Scene = dynamic(() => import("@/components/canvas/Scene"), { ssr: false });
const ScrollChoreography = dynamic(() => import("@/components/canvas/ScrollChoreography"), { ssr: false });

export default function ClientScene() {
  return (
    <>
      <Scene />
      <ScrollChoreography />
    </>
  );
}
