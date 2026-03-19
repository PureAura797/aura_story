'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scProps } from '@/lib/scrollProps';

/*
  Master-timeline scroll choreography.
  
  One GSAP timeline scrubbed by one ScrollTrigger spanning the whole page.
  Each section's formation occupies its proportional slice based on
  actual DOM position — automatically adapts to ANY page length,
  device, or admin config.
  
  No overlapping triggers, no jerking, no early-finish problem.
*/

interface ChoreographyStep {
  trigger: string;           // CSS selector for the section
  props: Partial<typeof scProps>;
}

const STEPS: ChoreographyStep[] = [
  // Hero exit — first transition
  {
    trigger: '#hero',
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

  // Scatter/Fall — blocks fall like leaves below the footer
  {
    trigger: '#site-footer',
    props: {
      formation: 14,
      groupX: 0,
      groupY: -12,
      speedMul: 0.3,
      radiusScale: 2.5,
      lightColor: '#5eead4',
      lightIntensity: 3,
      bgColor: '#0a0a0c',
    },
  },

];

/** Get element's absolute top position */
function getAbsoluteTop(el: HTMLElement): number {
  let top = 0;
  let current: HTMLElement | null = el;
  while (current) {
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return top;
}

export default function ScrollChoreography() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Initial state: particles hidden until preloader finishes
    scProps.entranceProgress = 0;

    let masterTl: gsap.core.Timeline | null = null;
    let scrollTrigger: ScrollTrigger | null = null;

    const buildMasterTimeline = () => {
      // Clean up previous if rebuilding
      scrollTrigger?.kill();
      masterTl?.kill();

      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;

      // Collect valid sections with their DOM positions
      const sections: { progress: number; props: Partial<typeof scProps> }[] = [];

      STEPS.forEach((step) => {
        const el = document.querySelector(step.trigger) as HTMLElement | null;
        if (!el || el.offsetHeight === 0) return;

        const top = getAbsoluteTop(el);
        // Normalize position to 0–1 range (fraction of total scroll)
        const progress = Math.min(top / totalScroll, 1);

        sections.push({ progress, props: step.props });
      });

      if (sections.length === 0) return;

      // Sort by progress (should already be sorted, but safety)
      sections.sort((a, b) => a.progress - b.progress);


      // Build master timeline using normalized time scale (0–100)
      const SCALE = 100;
      masterTl = gsap.timeline({ paused: true });

      sections.forEach((section, i) => {
        // Duration = gap to NEXT section. Last section gets 5% of total.
        const nextProgress = i < sections.length - 1
          ? sections[i + 1].progress
          : Math.min(section.progress + 0.05, 1);

        const duration = Math.max((nextProgress - section.progress) * SCALE, 0.5);

        masterTl!.to(scProps, {
          ...section.props,
          ease: 'power2.inOut',
          duration,
        }, section.progress * SCALE);
      });


      // Single ScrollTrigger for the ENTIRE page
      scrollTrigger = ScrollTrigger.create({
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,  // smoothing factor
        animation: masterTl,
      });
    };

    const handlePreloaderComplete = () => {
      gsap.to(scProps, {
        entranceProgress: 1,
        duration: 2.0,
        ease: 'power3.out',
      });

      // Build timeline after preloader (layout is stable)
      // Large delay ensures API-fetched sections have loaded their data
      setTimeout(() => {
        buildMasterTimeline();

        // Poll page height for changes (API sections loading changes height)
        // Only rebuild if height changed significantly (>200px)
        let lastHeight = document.documentElement.scrollHeight;
        let pollCount = 0;
        const heightPoll = setInterval(() => {
          pollCount++;
          const currentHeight = document.documentElement.scrollHeight;
          if (Math.abs(currentHeight - lastHeight) > 200) {
            lastHeight = currentHeight;
            buildMasterTimeline();
            ScrollTrigger.refresh();
          }
          // Stop polling after 8 checks (16 seconds total)
          if (pollCount >= 8) clearInterval(heightPoll);
        }, 2000);
      }, 1500);
    };

    window.addEventListener('preloaderComplete', handlePreloaderComplete);

    // Rebuild on resize (section heights change on responsive)
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildMasterTimeline();
        ScrollTrigger.refresh();
      }, 300);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('preloaderComplete', handlePreloaderComplete);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      scrollTrigger?.kill();
      masterTl?.kill();
    };
  }, []);

  return null;
}
