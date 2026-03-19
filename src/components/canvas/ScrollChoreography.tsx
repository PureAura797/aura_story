'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scProps } from '@/lib/scrollProps';

/*
  Section-based scroll choreography.
  Each section triggers its own formation + visual state.
  This adapts automatically to page length changes (admin edits, device).
*/

interface ChoreographyStep {
  trigger: string;           // CSS selector for the section
  start?: string;            // ScrollTrigger start (default: "top 80%")
  end?: string;              // ScrollTrigger end (default: "top 20%")
  props: Partial<typeof scProps>;
}

const STEPS: ChoreographyStep[] = [
  // Hero → initial state is set in scProps defaults (formation 0)

  // TrustMarquee / Stories zone — use #services as next anchor
  // The marquee + stories sit between hero and services
  {
    trigger: '#hero',
    start: 'bottom 80%',
    end: 'bottom 20%',
    props: {
      formation: 1,
      groupX: 3,
      speedMul: 4.0,
      lightColor: '#5eead4',
      lightIntensity: 12,
      bgColor: '#0b0d10',
    },
  },

  // Services
  {
    trigger: '#services',
    props: {
      formation: 3,
      groupX: -3,
      speedMul: 0.5,
      lightColor: '#d4a574',
      lightIntensity: 8,
      bgColor: '#0e0d0b',
    },
  },

  // Expertise
  {
    trigger: '#expertise',
    props: {
      formation: 4,
      groupX: 3,
      speedMul: 0.2,
      rotX: Math.PI / 6,
      lightColor: '#a67c52',
      lightIntensity: 7,
      bgColor: '#0d0c0b',
    },
  },

  // Team
  {
    trigger: '#team',
    props: {
      formation: 5,
      groupX: -3,
      rotX: 0,
      rotY: Math.PI / 8,
      speedMul: 1.5,
      lightColor: '#e0e0e0',
      lightIntensity: 10,
      bgColor: '#0c0c0e',
    },
  },

  // Process
  {
    trigger: '#process',
    props: {
      formation: 6,
      groupX: 3,
      rotY: 0,
      speedMul: 1.5,
      lightColor: '#e0e0e0',
      lightIntensity: 10,
      bgColor: '#0c0c0d',
    },
  },

  // Portfolio
  {
    trigger: '#portfolio',
    props: {
      formation: 7,
      groupX: -4,
      speedMul: 1.0,
      lightColor: '#5eead4',
      lightIntensity: 12,
      bgColor: '#0a0d0f',
    },
  },

  // Equipment
  {
    trigger: '#equipment',
    props: {
      formation: 8,
      groupX: 3,
      speedMul: 5.0,
      rotY: Math.PI / 6,
      lightColor: '#14b8a6',
      lightIntensity: 14,
      bgColor: '#0a0c0e',
    },
  },

  // Certificate
  {
    trigger: '#certificate',
    props: {
      formation: 9,
      groupX: -3,
      rotY: 0,
      speedMul: 0.4,
      lightColor: '#d4a574',
      lightIntensity: 8,
      bgColor: '#0e0d0b',
    },
  },

  // Pricing
  {
    trigger: '#pricing',
    props: {
      formation: 10,
      groupX: 3,
      speedMul: 0.3,
      lightColor: '#a67c52',
      lightIntensity: 7,
      bgColor: '#0f0d0b',
    },
  },

  // Reviews
  {
    trigger: '#reviews',
    props: {
      formation: 11,
      groupX: -4,
      groupY: 1,
      speedMul: 0.8,
      rotX: Math.PI / 8,
      rotZ: Math.PI / 12,
      lightColor: '#5eead4',
      lightIntensity: 10,
      bgColor: '#0b0d10',
    },
  },

  // FAQ
  {
    trigger: '#faq',
    props: {
      formation: 12,
      groupX: 3,
      groupY: 0,
      rotX: 0,
      rotZ: 0,
      speedMul: 0.3,
      lightColor: '#a67c52',
      lightIntensity: 6,
      bgColor: '#0e0c0b',
    },
  },

  // Contact
  {
    trigger: '#contact',
    props: {
      formation: 13,
      groupX: -3,
      speedMul: 2.0,
      lightColor: '#5eead4',
      lightIntensity: 14,
      bgColor: '#0a0d0f',
    },
  },

  // Footer — dim everything
  {
    trigger: 'footer',
    props: {
      formation: 14,
      groupX: 0,
      groupY: 0,
      speedMul: 0.5,
      lightColor: '#333333',
      lightIntensity: 4,
      bgColor: '#080808',
    },
  },
];

export default function ScrollChoreography() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

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

    // Create per-section ScrollTriggers
    const triggers: ScrollTrigger[] = [];

    STEPS.forEach((step) => {
      const el = document.querySelector(step.trigger);
      if (!el) return;

      // Each section scrubs its own mini-timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: step.trigger,
          start: step.start || 'top 80%',
          end: step.end || 'top 20%',
          scrub: 0.8,
        },
      });

      tl.to(scProps, {
        ...step.props,
        ease: 'power2.inOut',
      });

      if (tl.scrollTrigger) {
        triggers.push(tl.scrollTrigger);
      }
    });

    return () => {
      window.removeEventListener("preloaderComplete", handlePreloaderComplete);
      triggers.forEach(t => t.kill());
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return null;
}
