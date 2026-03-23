"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StoryModal from "@/components/ui/StoryModal";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface StoryData {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  cover: string;
  videos: string[];
}

export default function StoriesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [stories, setStories] = useState<StoryData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetch("/api/stories")
      .then((res) => res.json())
      .then((data) => setStories(data))
      .catch(() => setStories([]))
      .finally(() => setDataLoading(false));
  }, []);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [stories]);

  const scrollTo = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "right" ? 160 : -160;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  useGSAP(() => {
    if (stories.length === 0) return;
    gsap.registerPlugin(ScrollTrigger);
    const items = gsap.utils.toArray(".story-item") as HTMLElement[];
    gsap.set(items, { y: 20, opacity: 0 });
    ScrollTrigger.batch(items, {
      start: "top 98%",
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.5,
          ease: "power3.out",
        }),
      once: true,
    });
  }, { scope: containerRef, dependencies: [stories] });

  if (dataLoading || stories.length === 0) return null;

  return (
    <>
      <div ref={containerRef} className="w-full py-10 md:py-12 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 md:px-[10vw] mb-5">
          <p
            className="text-[11px] tracking-[0.2em] uppercase font-medium"
            style={{ color: "var(--accent)" }}
          >
            {t("stories.label")}
          </p>

          {/* Mobile scroll arrows — only show on small screens */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => scrollTo("left")}
              className={`w-7 h-7 rounded-full border border-[var(--border)] flex items-center justify-center transition-all cursor-pointer ${
                canScrollLeft
                  ? "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]"
                  : "text-[var(--text-muted)] pointer-events-none"
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scrollTo("right")}
              className={`w-7 h-7 rounded-full border border-[var(--border)] flex items-center justify-center transition-all cursor-pointer ${
                canScrollRight
                  ? "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]"
                  : "text-[var(--text-muted)] pointer-events-none"
              }`}
            >
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Scroll wrapper with fade edges */}
        <div className="relative">
          {/* Left fade */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-6 md:w-0 z-10 pointer-events-none transition-opacity duration-300 ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background: "linear-gradient(to right, var(--bg-deep), transparent)",
            }}
          />
          {/* Right fade — mobile only */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-10 md:w-0 z-10 pointer-events-none transition-opacity duration-300 ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background: "linear-gradient(to left, var(--bg-deep), transparent)",
            }}
          />

          {/* Stories row */}
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible px-5 md:px-[10vw] pb-2 scrollbar-hide"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {stories.map((story, idx) => (
              <button
                key={story.id}
                onClick={() => setActiveStory(idx)}
                className="story-item flex-shrink-0 flex flex-col items-center gap-2.5 group cursor-pointer"
                style={{ scrollSnapAlign: "start" }}
              >
                {/* Rotating gradient ring */}
                <div className="story-ring relative w-16 h-16 md:w-[88px] md:h-[88px] rounded-full p-[2.5px]">
                  <div
                    className="absolute inset-0 rounded-full story-ring-spin"
                    style={{
                      background: `conic-gradient(from 0deg, ${story.color}, ${story.color}44, ${story.color})`,
                    }}
                  />
                  <div className="relative w-full h-full rounded-full overflow-hidden border-[2.5px] border-[var(--bg-deep)]">
                    {/* Thumbnail */}
                    <img
                      src={story.cover}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Darken overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-500" />
                    {/* Logo emblem icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                        <svg
                          viewBox="0 0 638 556"
                          className="w-3 h-3 md:w-3.5 md:h-3.5"
                          fill="white"
                        >
                          <path d="M108 507.24C135.22 499.75 150.82 487.95 166.51 463 170.77 456.23 180.29 436.65 185.54 423.86 188.11 417.61 192.89 406.93 196.16 400.12 199.43 393.32 203.92 383.64 206.14 378.62 208.35 373.61 211.52 366.58 213.19 363 214.86 359.42 218.69 350.88 221.71 344 224.73 337.12 230.3 325.07 234.1 317.21 237.89 309.35 241 302.71 241 302.45 241 302.19 243.48 296.76 246.5 290.37 249.52 283.98 252 278.63 252 278.47 252 278.32 253.8 274.34 256 269.62 258.2 264.9 260 260.84 260 260.58 260 260.33 261.97 255.93 264.37 250.81 266.78 245.69 270.21 238.35 272 234.5 273.8 230.65 276.94 223.9 279 219.5 281.05 215.1 283.74 209.25 284.97 206.5 286.21 203.75 288.52 198.66 290.11 195.18 291.7 191.7 293 188.7 293 188.5 293 188.09 297.9 177.1 301.47 169.5 308.25 155.07 314.02 142.27 326.53 114 331.27 103.28 337.29 90.45 339.91 85.5 345.44 75.05 357.97 56.64 365.09 48.5 367.8 45.39 369.75 42.4 369.41 41.86 368.53 40.43 299.5 41.87 290.5 43.5 263.85 48.33 246.67 58.7 227.58 81.5 213.86 97.89 205.69 111.06 197.44 130.05 194.95 135.8 192.26 141.85 191.46 143.5 177.47 172.55 168.22 192.11 164.27 201 161.68 206.85 160.6 209.25 156.69 218 155.33 221.02 151.19 229.8 147.49 237.5 136.61 260.1 132.11 269.76 126.45 282.64 123.52 289.32 117.55 302.15 113.19 311.14 108.83 320.14 104.13 329.98 102.74 333 101.36 336.02 98.83 341.55 97.12 345.28 95.4 349 94 352.21 94 352.41 94 352.92 86.05 369.85 77.75 387 66.38 410.51 61.47 421.1 58.72 428.02 55.48 436.14 50.97 445.86 38.17 472.21 24.93 499.47 21.73 506.86 22.43 508.67 22.93 509.97 28.01 510.11 61.75 509.73 97.01 509.34 101.18 509.12 108 507.24Z" />
                          <path d="M583 507.99C583 504.66 574.6 485.67 557.78 451 552.31 439.73 544.33 422.62 540.04 413 529.46 389.25 527.39 384.8 517 363.5 512.05 353.35 508 344.84 508 344.58 508 343.9 497.79 321.62 490.78 307 477.06 278.39 471.97 267.41 468.99 260 468 257.52 464.63 250.1 461.5 243.5 450.15 219.56 442.4 202.82 441.84 201.09 441.38 199.65 437 206.05 437 208.15 437 209.8 429.18 224.39 425.61 229.41 417.48 240.86 402.51 254.44 388.79 262.83 381.13 267.51 360.18 278.38 352 281.91 348.98 283.21 344.02 285.39 341 286.75 337.98 288.1 326.95 292.79 316.5 297.17 283.22 311.1 269.18 319.61 254.11 335 245.5 343.79 236.86 358.5 227.1 381 222.28 392.13 219.07 399.25 211.87 414.89 209.74 419.5 208 424.12 208 425.14 208 427.42 211.61 427.66 214.58 425.58 216.68 424.11 235.84 414.39 242 411.68 260.22 403.64 284.93 395.12 313.46 387.04 336.88 380.4 342.33 379.16 355.34 377.55 385.82 373.78 400.25 383.15 416.04 417 423.23 432.41 436.84 458.85 442.29 468 449.67 480.39 461.85 492.16 473.61 498.26 494.12 508.9 499.77 509.81 546.25 509.92 582.42 510 583 509.97 583 507.99Z" />
                          <path d="M362.48 255.12C395.84 238.04 413.65 220.51 421.66 196.88 424.1 189.68 424.5 186.95 424.5 177.5 424.5 162.99 423.26 158.87 410.96 132.5 408.65 127.55 403.51 115.85 399.53 106.5 379.34 59.06 380.82 62.13 378.57 62.94 376.68 63.62 367.3 75.74 364.98 80.5 364.44 81.6 363.44 83.38 362.75 84.46 356.27 94.63 347.77 111.61 340.6 128.73 338.03 134.87 334.79 142.22 330.8 151 327.23 158.85 322.31 175.21 320.95 183.75 318.92 196.5 321.6 208.81 330.8 229 333.51 234.96 338.17 246.07 341.07 253.5 343.96 260.9 344.74 262 347.14 262 348.18 262 355.09 258.9 362.48 255.12Z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Label */}
                <div className="text-center min-w-[70px]">
                  <p className="text-[11px] text-white/80 font-medium tracking-wide uppercase group-hover:text-white transition-colors leading-tight">
                    {story.title}
                  </p>
                  <p className="text-[11px] md:text-xs text-[var(--text-muted)] tracking-wider uppercase mt-0.5 leading-tight">
                    {story.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <StoryModal
        isOpen={activeStory !== null}
        stories={stories}
        initialIndex={activeStory ?? 0}
        onClose={() => setActiveStory(null)}
      />
    </>
  );
}
