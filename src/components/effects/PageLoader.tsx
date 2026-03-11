"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PageLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide loader smoothly
    if (loaderRef.current) {
      gsap.to(loaderRef.current, {
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          if (loaderRef.current) loaderRef.current.style.display = "none";
        },
      });
    }
  }, []);

  return (
    <div ref={loaderRef} className="page-loader">
      <div className="loader-ring"></div>
    </div>
  );
}
