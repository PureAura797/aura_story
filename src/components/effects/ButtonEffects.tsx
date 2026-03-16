"use client";

import { useEffect } from "react";
import gsap from "gsap";

/**
 * ButtonEffects — "Blur Materialisation" system.
 * 
 * Matches the blur-to-focus aesthetic from Preloader (blur 20→0)
 * and Burger Menu (blur 8→0) — adapted for button micro-interactions.
 *
 * HOVER IN:  text briefly blurs (3px) + fades → snaps back to sharp focus
 * HOVER OUT: quick micro-blur (2px) → resolves back
 * CLICK:     sharp blur pulse (4px) + scale(0.97) → elastic snap-back
 *            + accent border flash with glow
 *
 * Targeted: .btn-primary, .btn-ghost, .mag-btn
 */

const SELECTORS = ".btn-primary, .btn-ghost, .mag-btn";

export default function ButtonEffects() {
  useEffect(() => {
    // Track which buttons are currently animating to prevent conflicts
    const animatingSet = new WeakSet<HTMLElement>();

    // --- HOVER IN: Blur materialisation ---
    const handleMouseEnter = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>(SELECTORS);
      if (!btn || animatingSet.has(btn)) return;
      animatingSet.add(btn);

      // Get all direct text/icon children (skip overlay divs)
      const content = Array.from(btn.children).filter(
        (c) => c instanceof HTMLElement && !c.classList.contains("mag-fill-overlay")
      ) as HTMLElement[];

      const tl = gsap.timeline({
        onComplete: () => { animatingSet.delete(btn); },
      });

      // Phase 1: Instant blur + slight opacity drop
      tl.set(content, {
        filter: "blur(3px)",
        opacity: 0.5,
      });

      // Phase 2: Materialise — snap into focus (like preloader letters landing)
      tl.to(content, {
        filter: "blur(0px)",
        opacity: 1,
        duration: 0.35,
        ease: "power3.out",
        stagger: 0.03,
      });

      // Subtle border glow fade-in
      const isPrimary = btn.classList.contains("btn-primary");
      const glowColor = isPrimary
        ? "rgba(255, 255, 255, 0.12)"
        : "rgba(94, 234, 212, 0.15)";

      tl.to(btn, {
        boxShadow: `0 0 20px ${glowColor}, inset 0 0 0 1px ${glowColor}`,
        duration: 0.4,
        ease: "power2.out",
      }, 0.05);

      // Gentle lift
      tl.to(btn, {
        y: -2,
        duration: 0.4,
        ease: "power3.out",
      }, 0);
    };

    // --- HOVER OUT: Quick blur dissolve ---
    const handleMouseLeave = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>(SELECTORS);
      if (!btn) return;

      const content = Array.from(btn.children).filter(
        (c) => c instanceof HTMLElement && !c.classList.contains("mag-fill-overlay")
      ) as HTMLElement[];

      animatingSet.delete(btn);

      const tl = gsap.timeline();

      // Brief blur out (like menu links fading)
      tl.to(content, {
        filter: "blur(2px)",
        opacity: 0.7,
        duration: 0.1,
        ease: "power2.in",
      });

      // Resolve back to sharp
      tl.to(content, {
        filter: "blur(0px)",
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
      });

      // Reset glow + position
      tl.to(btn, {
        boxShadow: "0 0 0 0 transparent",
        y: 0,
        duration: 0.35,
        ease: "power3.out",
      }, 0);
    };

    // --- CLICK: Impact blur + elastic snap ---
    const handleClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>(SELECTORS);
      if (!btn) return;

      const content = Array.from(btn.children).filter(
        (c) => c instanceof HTMLElement && !c.classList.contains("mag-fill-overlay")
      ) as HTMLElement[];

      const isPrimary = btn.classList.contains("btn-primary");
      const accentColor = isPrimary
        ? "rgba(255, 255, 255, 0.25)"
        : "rgba(94, 234, 212, 0.35)";

      const tl = gsap.timeline();

      // Impact — blur + scale crush
      tl.to(content, {
        filter: "blur(4px)",
        opacity: 0.6,
        duration: 0.08,
        ease: "power2.in",
      });

      tl.to(btn, {
        scale: 0.97,
        duration: 0.08,
        ease: "power2.in",
      }, 0);

      // Snap-back with elastic (like preloader breath pulse)
      tl.to(content, {
        filter: "blur(0px)",
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      });

      tl.to(btn, {
        scale: 1,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      }, "-=0.5");

      // Border flash
      tl.to(btn, {
        boxShadow: `inset 0 0 0 1.5px ${accentColor}, 0 0 24px ${accentColor}`,
        duration: 0.1,
        ease: "power2.out",
      }, 0);

      tl.to(btn, {
        boxShadow: "0 0 0 0 transparent",
        duration: 0.8,
        ease: "power3.out",
      }, 0.15);
    };

    // Event delegation on document (capture phase)
    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return null; // Side-effect-only component
}
