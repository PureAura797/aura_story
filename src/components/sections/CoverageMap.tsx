"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function CoverageMap() {
  const containerRef = useRef<HTMLElement>(null);
  const countersRef = useRef<HTMLElement[]>([]);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const coverageMap = document.getElementById("coverage-map");
    if (!coverageMap) return;

    const oblastPath = coverageMap.querySelector(".oblast-path");
    const innerZone = coverageMap.querySelector(".inner-zone");
    const moscowCircle = coverageMap.querySelector(".moscow-circle");
    const mapPins = coverageMap.querySelectorAll(".map-pin");
    const mapStats = document.querySelectorAll(".map-stat");

    gsap.set(mapPins, { opacity: 0, scale: 0 });
    gsap.set(innerZone, { opacity: 0 });
    gsap.set(moscowCircle, { scale: 0, transformOrigin: "center" });
    gsap.set(mapStats, { x: -30, opacity: 0 });

    const mapTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 65%",
        toggleActions: "play none none reverse",
      },
    });

    if (oblastPath) {
      mapTl.to(oblastPath, {
        strokeDashoffset: 0,
        duration: 2,
        ease: "power2.inOut",
      });
    }

    mapTl
      .to(innerZone, { opacity: 1, duration: 0.8, ease: "power2.out" }, "-=1.2")
      .to(moscowCircle, { scale: 1, duration: 0.6, ease: "back.out(1.7)" }, "-=0.8")
      .to(
        mapPins,
        {
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.4,
          ease: "back.out(2)",
        },
        "-=0.4"
      )
      .to(
        mapStats,
        {
          x: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "expo.out",
        },
        "-=0.5"
      );

    // Counter animation
    if (countersRef.current.length > 0) {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 65%",
        once: true,
        onEnter: () => {
          countersRef.current.forEach((counter) => {
            const target = parseInt(counter.getAttribute("data-target") || "0", 10);
            gsap.to(counter, {
              innerHTML: target,
              duration: 2,
              ease: "power2.out",
              snap: { innerHTML: 1 },
              onUpdate: function () {
                counter.innerHTML = Math.round(this.targets()[0].innerHTML).toString();
              },
            });
          });
        },
      });
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="section-card bg-[#0b0c0f] text-white py-24 md:py-32 w-full z-[48] relative rounded-t-[40px] md:rounded-t-[60px] -mt-36 md:-mt-48">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16 md:mb-20 section-header">
          <h2 className="text-[32px] md:text-[48px] font-medium tracking-tight mb-6">Зона покрытия</h2>
          <p className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            Работаем по всей Москве и Московской области. Среднее время прибытия — менее 60 минут.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="bg-[#121418] border border-white/5 rounded-2xl p-6 map-stat transition-transform hover:-translate-y-1 hover:border-[rgba(94,234,212,0.15)] duration-300">
              <div
                className="text-[36px] md:text-[44px] font-semibold mb-1 map-counter"
                style={{ color: "var(--accent)" }}
                data-target="14"
                ref={(el) => { if (el) countersRef.current[0] = el; }}
              >
                0
              </div>
              <p className="text-neutral-400 text-[14px] font-light">городов обслуживания</p>
            </div>
            <div className="bg-[#121418] border border-white/5 rounded-2xl p-6 map-stat transition-transform hover:-translate-y-1 hover:border-[rgba(94,234,212,0.15)] duration-300">
              <div className="text-[36px] md:text-[44px] font-semibold text-white mb-1 flex items-center">
                &lt; <span className="map-counter mx-2" data-target="60" ref={(el) => { if (el) countersRef.current[1] = el; }}>0</span> мин
              </div>
              <p className="text-neutral-400 text-[14px] font-light">среднее время прибытия</p>
            </div>
            <div className="bg-[#121418] border border-white/5 rounded-2xl p-6 map-stat transition-transform hover:-translate-y-1 hover:border-[rgba(94,234,212,0.15)] duration-300">
              <div className="flex text-[36px] md:text-[44px] font-semibold text-white mb-1">
                <span className="map-counter" data-target="2400" ref={(el) => { if (el) countersRef.current[2] = el; }}>0</span>+
              </div>
              <p className="text-neutral-400 text-[14px] font-light">объектов обработано</p>
            </div>
          </div>

          <div className="w-full lg:w-2/3 relative" id="coverage-map">
            <svg viewBox="0 0 600 520" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <defs>
                <radialGradient id="map-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(45,212,191,0.15)" />
                  <stop offset="100%" stopColor="rgba(45,212,191,0)" />
                </radialGradient>
                <filter id="pin-glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <circle cx="300" cy="260" r="220" fill="url(#map-glow)" />

              <path
                className="oblast-path"
                d="M 300,30 C 360,28 410,45 445,75 C 480,105 510,140 525,185 C 540,230 545,270 535,310 C 525,350 505,385 475,415 C 445,445 410,465 370,478 C 330,491 290,495 250,488 C 210,481 170,465 140,440 C 110,415 85,385 70,345 C 55,305 50,265 55,225 C 60,185 75,150 100,120 C 125,90 155,65 195,48 C 235,31 270,28 300,30 Z"
                fill="none"
                stroke="rgba(45,212,191,0.2)"
                strokeWidth="1.5"
                strokeDasharray="8 4"
                strokeDashoffset="1800"
                style={{ strokeDasharray: 1800, strokeDashoffset: 1800 }}
              />

              <path
                className="inner-zone"
                d="M 300,95 C 345,93 385,110 410,135 C 435,160 452,190 458,225 C 464,260 460,295 445,325 C 430,355 408,378 380,395 C 352,412 320,420 288,420 C 256,420 224,412 198,395 C 172,378 152,355 140,325 C 128,295 124,260 130,225 C 136,190 150,160 175,135 C 200,110 240,93 300,95 Z"
                fill="rgba(45,212,191,0.03)"
                stroke="rgba(45,212,191,0.12)"
                strokeWidth="1"
              />

              <circle
                cx="300"
                cy="255"
                r="38"
                fill="rgba(45,212,191,0.08)"
                stroke="rgba(45,212,191,0.3)"
                strokeWidth="1.5"
                className="moscow-circle"
              />
              <text x="300" y="260" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="11" fontWeight="500" fontFamily="Inter, sans-serif">
                МОСКВА
              </text>

              <g className="map-pin" data-label="Центр">
                <circle cx="300" cy="240" r="12" fill="rgba(45,212,191,0.15)" className="pin-pulse" />
                <circle cx="300" cy="240" r="5" fill="#2dd4bf" filter="url(#pin-glow)" />
              </g>

              <g className="map-pin" data-label="Химки">
                <circle cx="280" cy="175" r="10" fill="rgba(45,212,191,0.12)" className="pin-pulse" />
                <circle cx="280" cy="175" r="4" fill="#2dd4bf" filter="url(#pin-glow)" />
                <text x="280" y="160" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="Inter, sans-serif">
                  Химки
                </text>
              </g>

              <g className="map-pin" data-label="Мытищи">
                <circle cx="345" cy="185" r="10" fill="rgba(45,212,191,0.12)" className="pin-pulse" />
                <circle cx="345" cy="185" r="4" fill="#2dd4bf" filter="url(#pin-glow)" />
                <text x="345" y="170" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="Inter, sans-serif">
                  Мытищи
                </text>
              </g>

              <g className="map-pin" data-label="Балашиха">
                <circle cx="395" cy="250" r="10" fill="rgba(45,212,191,0.12)" className="pin-pulse" />
                <circle cx="395" cy="250" r="4" fill="#2dd4bf" filter="url(#pin-glow)" />
                <text x="395" y="235" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="Inter, sans-serif">
                  Балашиха
                </text>
              </g>

              <g className="map-pin" data-label="Подольск">
                <circle cx="285" cy="355" r="10" fill="rgba(45,212,191,0.12)" className="pin-pulse" />
                <circle cx="285" cy="355" r="4" fill="#2dd4bf" filter="url(#pin-glow)" />
                <text x="285" y="375" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="Inter, sans-serif">
                  Подольск
                </text>
              </g>

              <g className="map-pin" data-label="Одинцово">
                <circle cx="210" cy="245" r="10" fill="rgba(45,212,191,0.12)" className="pin-pulse" />
                <circle cx="210" cy="245" r="4" fill="#2dd4bf" filter="url(#pin-glow)" />
                <text x="210" y="230" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="Inter, sans-serif">
                  Одинцово
                </text>
              </g>

              <g className="map-pin" data-label="Красногорск">
                <circle cx="240" cy="195" r="10" fill="rgba(45,212,191,0.12)" className="pin-pulse" />
                <circle cx="240" cy="195" r="4" fill="#2dd4bf" filter="url(#pin-glow)" />
                <text x="240" y="180" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="Inter, sans-serif">
                  Красногорск
                </text>
              </g>

              <g className="map-pin" data-label="Люберцы">
                <circle cx="370" cy="305" r="10" fill="rgba(45,212,191,0.12)" className="pin-pulse" />
                <circle cx="370" cy="305" r="4" fill="#2dd4bf" filter="url(#pin-glow)" />
                <text x="370" y="325" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="Inter, sans-serif">
                  Люберцы
                </text>
              </g>

              <g className="map-pin" data-label="Домодедово">
                <circle cx="335" cy="385" r="10" fill="rgba(45,212,191,0.12)" className="pin-pulse" />
                <circle cx="335" cy="385" r="4" fill="#2dd4bf" filter="url(#pin-glow)" />
                <text x="335" y="405" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="Inter, sans-serif">
                  Домодедово
                </text>
              </g>

              <g className="map-pin" data-label="Зеленоград">
                <circle cx="225" cy="125" r="10" fill="rgba(45,212,191,0.12)" className="pin-pulse" />
                <circle cx="225" cy="125" r="4" fill="#2dd4bf" filter="url(#pin-glow)" />
                <text x="225" y="112" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="Inter, sans-serif">
                  Зеленоград
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
