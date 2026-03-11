"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function SmoothScroller() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // Setup scroll progress bar logic
    const progressBar = document.getElementById("scroll-progress");
    lenis.on("scroll", (e: any) => {
      if (progressBar) {
        progressBar.style.width = `${e.progress * 100}%`;
      }
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Handle anchor links manually for Lenis
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute("href");
      // Must be an internal anchor link
      if (href && href.startsWith("#") && href.length > 1) {
        e.preventDefault();
        lenis.scrollTo(href, { offset: 0 }); // Smooth scroll to target ID
      }
    };

    // Attach listener to document to catch dynamically added anchors or mobile menu links
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (target) {
        handleAnchorClick(e);
      }
    };
    
    document.addEventListener("click", handleDocumentClick);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return null;
}
