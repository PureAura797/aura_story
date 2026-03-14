"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * ButtonEffects — Global event-delegation component.
 * Automatically applies magnetic-fill hover + border-trace click effect
 * to all matching interactive button elements on the page.
 *
 * Targeted selectors:
 *   .btn-primary, .btn-ghost, .mag-btn
 *
 * Technique:
 *   HOVER: accent-colored overlay expands as a circle from cursor position via clipPath
 *   CLICK: border briefly flashes accent + scale bounce (0.97 → 1.0)
 */

const SELECTORS = ".btn-primary, .btn-ghost, .mag-btn";

// Overlay element pool (reuse the same overlay div per button)
const overlayMap = new WeakMap<HTMLElement, HTMLDivElement>();

function getOrCreateOverlay(btn: HTMLElement): HTMLDivElement {
  let overlay = overlayMap.get(btn);
  if (overlay && overlay.parentElement === btn) return overlay;

  overlay = document.createElement("div");
  overlay.className = "mag-fill-overlay";
  overlay.style.cssText = `
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    clip-path: circle(0% at 50% 50%);
  `;

  // Make sure button has relative positioning for overlay
  const computed = getComputedStyle(btn);
  if (computed.position === "static") {
    btn.style.position = "relative";
  }

  // Ensure button content stays above the overlay
  Array.from(btn.children).forEach((child) => {
    if (child !== overlay && child instanceof HTMLElement) {
      if (!child.style.position || child.style.position === "static") {
        child.style.position = "relative";
        child.style.zIndex = "1";
      }
    }
  });

  btn.style.overflow = "hidden";
  btn.appendChild(overlay);
  overlayMap.set(btn, overlay);
  return overlay;
}

function getAccentColor(btn: HTMLElement): string {
  // btn-primary is white bg → accent fill is dark teal on hover
  if (btn.classList.contains("btn-primary")) {
    return "rgba(94, 234, 212, 0.15)";
  }
  // Ghost & mag-btn → accent teal fill
  return "rgba(94, 234, 212, 0.08)";
}

function getBorderColor(btn: HTMLElement): string {
  if (btn.classList.contains("btn-primary")) {
    return "rgba(94, 234, 212, 0.4)";
  }
  return "rgba(94, 234, 212, 0.35)";
}

export default function ButtonEffects() {
  const lastEnterPos = useRef<{ x: string; y: string }>({ x: "50%", y: "50%" });

  useEffect(() => {
    // --- HOVER: Radial fill from cursor ---
    const handleMouseEnter = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>(SELECTORS);
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const pos = { x: `${x}%`, y: `${y}%` };
      lastEnterPos.current = pos;

      const overlay = getOrCreateOverlay(btn);
      overlay.style.background = getAccentColor(btn);

      gsap.killTweensOf(overlay);
      gsap.set(overlay, { clipPath: `circle(0% at ${pos.x} ${pos.y})` });
      gsap.to(overlay, {
        clipPath: `circle(150% at ${pos.x} ${pos.y})`,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>(SELECTORS);
      if (!btn) return;

      const overlay = overlayMap.get(btn);
      if (!overlay) return;

      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      gsap.killTweensOf(overlay);
      gsap.to(overlay, {
        clipPath: `circle(0% at ${x}% ${y}%)`,
        duration: 0.4,
        ease: "power2.in",
      });
    };

    // --- CLICK: Border flash + scale bounce ---
    const handleClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>(SELECTORS);
      if (!btn) return;

      // Scale bounce
      gsap.to(btn, {
        scale: 0.97,
        duration: 0.1,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(btn, {
            scale: 1,
            duration: 0.4,
            ease: "elastic.out(1, 0.4)",
          });
        },
      });

      // Border trace flash
      const borderColor = getBorderColor(btn);
      const origBoxShadow = getComputedStyle(btn).boxShadow;

      gsap.to(btn, {
        boxShadow: `inset 0 0 0 1.5px ${borderColor}, 0 0 16px ${borderColor}`,
        duration: 0.15,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(btn, {
            boxShadow: origBoxShadow === "none" ? "0 0 0 0 transparent" : origBoxShadow,
            duration: 0.6,
            ease: "power3.out",
          });
        },
      });
    };

    // Event delegation on document
    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return null; // This is a side-effect-only component
}
