'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scProps } from '@/lib/scrollProps';

export default function ScrollChoreography() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const matchMedia = gsap.matchMedia();

    // Initial state: particles hidden until preloader finishes
    scProps.entranceProgress = 0;

    const handlePreloaderComplete = () => {
      gsap.to(scProps, {
        entranceProgress: 1,
        duration: 2.0,
        ease: "power3.out",
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

      // === 0 → 1: Hero → TrustMarquee ===
      // Ring → Vortex, shift right, speed up, brand sand → teal
      tl.to(scProps, {
        formation: 1,
        groupX: 3,
        speedMul: 4.0,
        lightColor: '#5eead4',
        lightIntensity: 12,
        bgColor: '#0b0d10',
        ease: "power2.inOut",
      }, 0);

      // === 1 → 2: TrustMarquee → Stories ===
      // Sustain Vortex, shift slightly left, warm sand
      tl.to(scProps, {
        formation: 2,
        groupX: 2,
        speedMul: 3.0,
        lightColor: '#a67c52',
        lightIntensity: 9,
        bgColor: '#0f0d0c',
        ease: "power2.inOut",
      }, 1);

      // === 2 → 3: Stories → Services ===
      // Vortex → Scatter, shift far left (content right), slow, sand
      tl.to(scProps, {
        formation: 3,
        groupX: -3,
        speedMul: 0.5,
        lightColor: '#d4a574',
        lightIntensity: 8,
        bgColor: '#0e0d0b',
        ease: "power3.inOut",
      }, 2);

      // === 3 → 4: Services → Expertise ===
      // Scatter → Column, shift right (content left), slow, sand-dim
      tl.to(scProps, {
        formation: 4,
        groupX: 3,
        speedMul: 0.2,
        rotX: Math.PI / 6,
        lightColor: '#a67c52',
        lightIntensity: 7,
        bgColor: '#0d0c0b',
        ease: "power3.inOut",
      }, 3);

      // === 4 → 5: Expertise → Team ===
      // Column → Cross, center (content right), medium, white
      tl.to(scProps, {
        formation: 5,
        groupX: -3,
        rotX: 0,
        rotY: Math.PI / 8,
        speedMul: 1.5,
        lightColor: '#e0e0e0',
        lightIntensity: 10,
        bgColor: '#0c0c0e',
        ease: "power2.inOut",
      }, 4);

      // === 5 → 6: Team → Process ===
      // Cross → Grid, shift right (content left), resume, cool white
      tl.to(scProps, {
        formation: 6,
        groupX: 3,
        rotY: 0,
        speedMul: 1.5,
        lightColor: '#e0e0e0',
        lightIntensity: 10,
        bgColor: '#0c0c0d',
        ease: "power2.inOut",
      }, 5);

      // === 6 → 7: Process → Portfolio ===
      // Grid → Helix, shift left (content right), teal
      tl.to(scProps, {
        formation: 7,
        groupX: -4,
        speedMul: 1.0,
        lightColor: '#5eead4',
        lightIntensity: 12,
        bgColor: '#0a0d0f',
        ease: "power2.inOut",
      }, 6);

      // === 7 → 8: Portfolio → Equipment ===
      // Helix → Sphere, shift right (content left), fast spin, teal-deep
      tl.to(scProps, {
        formation: 8,
        groupX: 3,
        speedMul: 5.0,
        rotY: Math.PI / 6,
        lightColor: '#14b8a6',
        lightIntensity: 14,
        bgColor: '#0a0c0e',
        ease: "power2.inOut",
      }, 7);

      // === 8 → 9: Equipment → Certificate ===
      // Sphere → Dome, shift left (content right), slow elegant, warm sand
      tl.to(scProps, {
        formation: 9,
        groupX: -3,
        rotY: 0,
        speedMul: 0.4,
        lightColor: '#d4a574',
        lightIntensity: 8,
        bgColor: '#0e0d0b',
        ease: "power3.inOut",
      }, 8);

      // === 9 → 10: Certificate → Pricing ===
      // Dome → Panel, shift right (content left), slow, sand
      tl.to(scProps, {
        formation: 10,
        groupX: 3,
        speedMul: 0.3,
        lightColor: '#a67c52',
        lightIntensity: 7,
        bgColor: '#0f0d0b',
        ease: "power3.inOut",
      }, 9);

      // === 10 → 11: Pricing → Reviews ===
      // Panel → Cross, shift left (content right), teal
      tl.to(scProps, {
        formation: 11,
        groupX: -4,
        groupY: 1,
        speedMul: 0.8,
        rotX: Math.PI / 8,
        rotZ: Math.PI / 12,
        lightColor: '#5eead4',
        lightIntensity: 10,
        bgColor: '#0b0d10',
        ease: "power2.inOut",
      }, 10);

      // === 11 → 12: Reviews → FAQ ===
      // Cross → Large Ring, shift right (content left), slow, sand-dim
      tl.to(scProps, {
        formation: 12,
        groupX: 3,
        groupY: 0,
        rotX: 0,
        rotZ: 0,
        speedMul: 0.3,
        lightColor: '#a67c52',
        lightIntensity: 6,
        bgColor: '#0e0c0b',
        ease: "power2.inOut",
      }, 11);

      // === 12 → 13: FAQ → Contact ===
      // Ring → Pulse Ring, shift left (content right), bright teal, speed up
      tl.to(scProps, {
        formation: 13,
        groupX: -3,
        speedMul: 2.0,
        lightColor: '#5eead4',
        lightIntensity: 14,
        bgColor: '#0a0d0f',
        ease: "power2.inOut",
      }, 12);

      // === 13 → 14: Contact → Footer/Outro ===
      // Pulse Ring → Rain, dim everything
      tl.to(scProps, {
        formation: 14,
        groupX: 0,
        groupY: 0,
        speedMul: 0.5,
        lightColor: '#333333',
        lightIntensity: 4,
        bgColor: '#080808',
        ease: "power3.in",
      }, 13);
    });

    return () => {
      window.removeEventListener("preloaderComplete", handlePreloaderComplete);
      matchMedia.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return null;
}
