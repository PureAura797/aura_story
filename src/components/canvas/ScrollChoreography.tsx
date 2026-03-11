'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scProps } from '@/lib/scrollProps';

export default function ScrollChoreography() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const matchMedia = gsap.matchMedia();

    // Initial state before preloader finishes
    scProps.radiusScale = 0;

    const handlePreloaderComplete = () => {
      gsap.to(scProps, {
        radiusScale: 1.0,
        duration: 2.5,
        ease: "elastic.out(1, 0.5)",
      });
    };

    window.addEventListener("preloaderComplete", handlePreloaderComplete);

    matchMedia.add("(min-width: 320px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "main",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.0,
        }
      });

      // === Sec 1: Hero → Services ===
      // Ring → Vortex, shift right, speed up, teal glow
      tl.to(scProps, {
        formation: 1,
        groupX: 3,
        speedMul: 4.0,
        lightColor: '#5eead4',
        lightIntensity: 12,
        ease: "power2.inOut",
      }, 0);

      // === Sec 2: Services → Expertise ===
      // Vortex → Scatter, shift left, slow down, warm sand
      tl.to(scProps, {
        formation: 2,
        groupX: -3,
        speedMul: 0.2,
        rotX: Math.PI / 6,
        lightColor: '#d4a574',
        lightIntensity: 8,
        ease: "power3.inOut",
      }, 1);

      // === Sec 3: Expertise → Process ===
      // Scatter → Column, center, resume speed, cool white
      tl.to(scProps, {
        formation: 3,
        groupX: 0,
        rotX: 0,
        speedMul: 1.5,
        lightColor: '#e0e0e0',
        lightIntensity: 10,
        ease: "power2.inOut",
      }, 2);

      // === Sec 4: Process → Portfolio ===
      // Column → Grid, shift left, accent teal
      tl.to(scProps, {
        formation: 4,
        groupX: -4,
        speedMul: 1.0,
        lightColor: '#5eead4',
        lightIntensity: 12,
        ease: "power2.inOut",
      }, 3);

      // === Sec 5: Portfolio → Equipment ===
      // Grid → Helix, shift right, speed up, bright teal
      tl.to(scProps, {
        formation: 5,
        groupX: 3,
        speedMul: 5.0,
        rotY: Math.PI / 6,
        lightColor: '#14b8a6',
        lightIntensity: 14,
        ease: "power2.inOut",
      }, 4);

      // === Sec 6: Equipment → Pricing ===
      // Helix → Panel, far right, slow, warm sand
      tl.to(scProps, {
        formation: 6,
        groupX: 5,
        rotY: 0,
        speedMul: 0.3,
        lightColor: '#d4a574',
        lightIntensity: 8,
        ease: "power3.inOut",
      }, 5);

      // === Sec 7: Pricing → Reviews ===
      // Panel → Dome, shift left, teal
      tl.to(scProps, {
        formation: 7,
        groupX: -2,
        groupY: 1,
        speedMul: 0.8,
        rotX: Math.PI / 8,
        rotZ: Math.PI / 12,
        lightColor: '#5eead4',
        lightIntensity: 10,
        ease: "power2.inOut",
      }, 6);

      // === Sec 8: Reviews → FAQ ===
      // Dome → Ring, center, minimal rotation, soft sand
      tl.to(scProps, {
        formation: 8,
        groupX: 2,
        groupY: 0,
        rotX: 0,
        rotZ: 0,
        speedMul: 0.3,
        lightColor: '#a67c52',
        lightIntensity: 6,
        ease: "power2.inOut",
      }, 7);

      // === Sec 9: FAQ → Contact ===
      // Ring → Pulse Ring, center, bright teal
      tl.to(scProps, {
        formation: 9,
        groupX: 0,
        speedMul: 2.0,
        lightColor: '#5eead4',
        lightIntensity: 14,
        ease: "power2.inOut",
      }, 8);

      // === Sec 10: Contact → Footer ===
      // Pulse Ring → Rain, dim
      tl.to(scProps, {
        formation: 10,
        groupY: 0,
        speedMul: 0.5,
        lightColor: '#333333',
        lightIntensity: 4,
        ease: "power3.in",
      }, 9);
    });

    return () => {
      window.removeEventListener("preloaderComplete", handlePreloaderComplete);
      matchMedia.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return null;
}
