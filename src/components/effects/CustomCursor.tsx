"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (typeof window === "undefined" || window.matchMedia("(hover: none)").matches) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    // Set initial positions
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(dot, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });
    
    const xDotTo = gsap.quickTo(dot, "x", { duration: 0.05, ease: "power3" });
    const yDotTo = gsap.quickTo(dot, "y", { duration: 0.05, ease: "power3" });

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xDotTo(e.clientX);
      yDotTo(e.clientY);
    };

    const handleHoverEnter = () => cursor.classList.add("hovering");
    const handleHoverLeave = () => cursor.classList.remove("hovering");

    window.addEventListener("mousemove", onMouseMove);

    // Initial check for interactive elements
    const addHoverListeners = () => {
      const interactives = document.querySelectorAll('a, button, input, textarea, .faq-trigger, [data-lucide="menu"]');
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", handleHoverEnter);
        el.addEventListener("mouseleave", handleHoverLeave);
      });
      return interactives;
    };

    let interactives = addHoverListeners();

    // DOM observer to catch newly added elements (e.g. hydrated components)
    const observer = new MutationObserver(() => {
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverEnter);
        el.removeEventListener("mouseleave", handleHoverLeave);
      });
      interactives = addHoverListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverEnter);
        el.removeEventListener("mouseleave", handleHoverLeave);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor hidden sm:block"></div>
      <div ref={dotRef} className="cursor-dot hidden sm:block"></div>
    </>
  );
}
