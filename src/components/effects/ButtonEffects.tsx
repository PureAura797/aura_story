"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * ButtonEffects — "Living Glass" AAA interaction system
 *
 * Layer 1: Magnetic Pull — button physically follows cursor (±5px)
 * Layer 2: Cursor Spotlight Border — radial-gradient light traces along border
 * Layer 3: Inner Luminance — soft glow follows cursor inside button
 * Click:   Elastic Snap — scale(0.96) crush → spring snap-back
 * Leave:   Smooth cooldown — all effects fade out gracefully
 *
 * Targeted: .btn-primary, .btn-ghost, .mag-btn
 */

const SELECTORS = ".btn-primary, .btn-ghost, .mag-btn";
const MAGNETIC_STRENGTH = 0.35;
const MAGNETIC_MAX = 5;

const isLight = () =>
  document.documentElement.getAttribute("data-theme") === "light";

export default function ButtonEffects() {
  const frameIds = useRef<Map<HTMLElement, number>>(new Map());

  useEffect(() => {
    // ─── Helpers ──────────────────────────────────────────
    const getBtnData = (btn: HTMLElement) => {
      const rect = btn.getBoundingClientRect();
      return {
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
        hw: rect.width / 2,
        hh: rect.height / 2,
        rect,
      };
    };

    // Ensure the btn has overlay elements for spotlight + luminance
    const ensureOverlays = (btn: HTMLElement) => {
      if (btn.querySelector(".lg-spotlight")) return;

      // Border spotlight overlay
      const spotlight = document.createElement("div");
      spotlight.className = "lg-spotlight";
      Object.assign(spotlight.style, {
        position: "absolute",
        inset: "-1px",
        borderRadius: "inherit",
        pointerEvents: "none",
        opacity: "0",
        transition: "opacity 0.3s ease",
        zIndex: "0",
        // Gradient border via mask trick
        background: "transparent",
        border: "1px solid transparent",
      });
      btn.style.position = "relative";
      btn.style.overflow = "visible";
      btn.insertBefore(spotlight, btn.firstChild);

      // Inner luminance overlay
      const luminance = document.createElement("div");
      luminance.className = "lg-luminance";
      Object.assign(luminance.style, {
        position: "absolute",
        inset: "0",
        borderRadius: "inherit",
        pointerEvents: "none",
        opacity: "0",
        transition: "opacity 0.3s ease",
        zIndex: "0",
      });
      btn.insertBefore(luminance, btn.firstChild);

      // Ensure text content is above overlays
      Array.from(btn.children).forEach((child) => {
        if (
          child instanceof HTMLElement &&
          !child.classList.contains("lg-spotlight") &&
          !child.classList.contains("lg-luminance")
        ) {
          child.style.position = "relative";
          child.style.zIndex = "1";
        }
      });
    };

    // ─── MOUSE MOVE — Magnetic + Spotlight + Luminance ───
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target || typeof target.closest !== "function") return;
      const btn = target.closest<HTMLElement>(SELECTORS);
      if (!btn) return;

      // Cancel any pending frame
      const prevFrame = frameIds.current.get(btn);
      if (prevFrame) cancelAnimationFrame(prevFrame);

      const frameId = requestAnimationFrame(() => {
        const { cx, cy, hw, hh, rect } = getBtnData(btn);

        // Relative cursor position inside button (-1 to 1)
        const dx = (e.clientX - cx) / hw;
        const dy = (e.clientY - cy) / hh;

        // ── Layer 1: Magnetic Pull ──
        const tx = Math.max(-MAGNETIC_MAX, Math.min(MAGNETIC_MAX, dx * hw * MAGNETIC_STRENGTH));
        const ty = Math.max(-MAGNETIC_MAX, Math.min(MAGNETIC_MAX, dy * hh * MAGNETIC_STRENGTH));

        gsap.to(btn, {
          x: tx,
          y: ty - 1, // slight lift
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });

        // ── Layer 2: Cursor Spotlight Border ──
        const spotlight = btn.querySelector<HTMLElement>(".lg-spotlight");
        if (spotlight) {
          const localX = e.clientX - rect.left;
          const localY = e.clientY - rect.top;

          const isPrimary = btn.classList.contains("btn-primary");
          const light = isLight();
          const spotColor = isPrimary
            ? (light ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.7)")
            : (light ? "rgba(13, 148, 136, 0.5)" : "rgba(94, 234, 212, 0.6)");
          const spotColorDim = isPrimary
            ? (light ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.08)")
            : (light ? "rgba(13, 148, 136, 0.05)" : "rgba(94, 234, 212, 0.06)");

          spotlight.style.background = `radial-gradient(circle 120px at ${localX}px ${localY}px, ${spotColor}, ${spotColorDim} 50%, transparent 70%)`;
          // Use mask to show only border area
          spotlight.style.mask =
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)";
          spotlight.style.maskComposite = "exclude";
          spotlight.style.webkitMaskComposite = "xor";
          spotlight.style.padding = "1px";
          spotlight.style.opacity = "1";
        }

        // ── Layer 3: Inner Luminance ──
        const luminance = btn.querySelector<HTMLElement>(".lg-luminance");
        if (luminance) {
          const localX = e.clientX - rect.left;
          const localY = e.clientY - rect.top;

          const isPrimary2 = btn.classList.contains("btn-primary");
          const light2 = isLight();
          const glowColor = isPrimary2
            ? (light2 ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.06)")
            : (light2 ? "rgba(13, 148, 136, 0.06)" : "rgba(94, 234, 212, 0.04)");

          luminance.style.background = `radial-gradient(circle 100px at ${localX}px ${localY}px, ${glowColor}, transparent 70%)`;
          luminance.style.opacity = "1";
        }
      });

      frameIds.current.set(btn, frameId);
    };

    // ─── MOUSE ENTER — Init overlays + soft glow ─────────
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target || typeof target.closest !== "function") return;
      const btn = target.closest<HTMLElement>(SELECTORS);
      if (!btn) return;

      ensureOverlays(btn);

      // Subtle box glow
      const isPrimary = btn.classList.contains("btn-primary");
      const light = isLight();
      const glowColor = isPrimary
        ? (light ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.06)")
        : (light ? "rgba(13, 148, 136, 0.08)" : "rgba(94, 234, 212, 0.08)");

      gsap.to(btn, {
        boxShadow: `0 4px 24px ${glowColor}`,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    // ─── MOUSE LEAVE — Graceful cooldown ─────────────────
    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target || typeof target.closest !== "function") return;
      const btn = target.closest<HTMLElement>(SELECTORS);
      if (!btn) return;

      // Cancel pending frames
      const prevFrame = frameIds.current.get(btn);
      if (prevFrame) cancelAnimationFrame(prevFrame);
      frameIds.current.delete(btn);

      // Return to origin — smooth easeOut
      gsap.to(btn, {
        x: 0,
        y: 0,
        boxShadow: "0 0 0 0 transparent",
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
        overwrite: "auto",
      });

      // Fade overlays
      const spotlight = btn.querySelector<HTMLElement>(".lg-spotlight");
      const luminance = btn.querySelector<HTMLElement>(".lg-luminance");
      if (spotlight) spotlight.style.opacity = "0";
      if (luminance) luminance.style.opacity = "0";
    };

    // ─── MOUSE DOWN — Elastic snap press ──────────────────
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target || typeof target.closest !== "function") return;
      const btn = target.closest<HTMLElement>(SELECTORS);
      if (!btn) return;

      gsap.to(btn, {
        scale: 0.96,
        duration: 0.1,
        ease: "power3.in",
        overwrite: "auto",
      });

      // Border flash
      const isPrimary = btn.classList.contains("btn-primary");
      const light = isLight();
      const flashColor = isPrimary
        ? (light ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.2)")
        : (light ? "rgba(13, 148, 136, 0.3)" : "rgba(94, 234, 212, 0.25)");

      gsap.to(btn, {
        boxShadow: `inset 0 0 0 1.5px ${flashColor}, 0 0 20px ${flashColor}`,
        duration: 0.08,
        ease: "power2.out",
      });
    };

    // ─── MOUSE UP — Spring snap-back ──────────────────────
    const handleMouseUp = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target || typeof target.closest !== "function") return;
      const btn = target.closest<HTMLElement>(SELECTORS);
      if (!btn) return;

      // Spring snap-back with overshoot
      gsap.to(btn, {
        scale: 1,
        duration: 0.6,
        ease: "elastic.out(1.2, 0.4)",
        overwrite: "auto",
      });

      // Glow fade
      const isPrimary = btn.classList.contains("btn-primary");
      const light = isLight();
      const glowColor = isPrimary
        ? (light ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.06)")
        : (light ? "rgba(13, 148, 136, 0.08)" : "rgba(94, 234, 212, 0.08)");

      gsap.to(btn, {
        boxShadow: `0 4px 24px ${glowColor}`,
        duration: 0.5,
        ease: "power3.out",
        delay: 0.05,
      });
    };

    // ─── Event Delegation ────────────────────────────────
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);
    document.addEventListener("mousedown", handleMouseDown, true);
    document.addEventListener("mouseup", handleMouseUp, true);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
      document.removeEventListener("mousedown", handleMouseDown, true);
      document.removeEventListener("mouseup", handleMouseUp, true);
      // Cleanup frames
      frameIds.current.forEach((id) => cancelAnimationFrame(id));
      frameIds.current.clear();
    };
  }, []);

  return null;
}
