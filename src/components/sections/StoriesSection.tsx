"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StoryModal from "@/components/ui/StoryModal";

const stories = [
  {
    id: 1,
    title: "Дезинфекция",
    subtitle: "Квартира 85 м²",
    gradient: "from-teal-400 to-cyan-600",
    color: "#5eead4",
    videos: [
      "/stories/story-1_1.mp4",
      "/stories/story-1_2.mp4",
      "/stories/story-1_3.mp4",
      "/stories/story-1_4.mp4",
    ],
  },
  {
    id: 2,
    title: "До / После",
    subtitle: "Накопительство",
    gradient: "from-amber-500 to-orange-600",
    color: "#d4a574",
    videos: [
      "/stories/story-2_1.mp4",
      "/stories/story-2_2.mp4",
      "/stories/story-2_3.mp4",
      "/stories/story-2_4.mp4",
    ],
  },
  {
    id: 3,
    title: "Оборудование",
    subtitle: "Обзор техники",
    gradient: "from-teal-500 to-emerald-600",
    color: "#14b8a6",
    videos: [
      "/stories/story-3_1.mp4",
      "/stories/story-3_2.mp4",
      "/stories/story-3_3.mp4",
      "/stories/story-3_4.mp4",
    ],
  },
  {
    id: 4,
    title: "Процесс",
    subtitle: "Озонирование",
    gradient: "from-rose-400 to-pink-600",
    color: "#fb7185",
    videos: [
      "/stories/story-4_1.mp4",
      "/stories/story-4_2.mp4",
      "/stories/story-4_3.mp4",
      "/stories/story-4_4.mp4",
    ],
  },
  {
    id: 5,
    title: "Команда",
    subtitle: "На выезде",
    gradient: "from-violet-400 to-purple-600",
    color: "#a78bfa",
    videos: [
      "/stories/story-5_1.mp4",
      "/stories/story-5_2.mp4",
      "/stories/story-5_3.mp4",
      "/stories/story-5_4.mp4",
    ],
  },
  {
    id: 6,
    title: "Результат",
    subtitle: "Сдача объекта",
    gradient: "from-teal-400 to-teal-600",
    color: "#5eead4",
    videos: [
      "/stories/story-6_1.mp4",
      "/stories/story-6_2.mp4",
      "/stories/story-6_3.mp4",
      "/stories/story-6_4.mp4",
    ],
  },
];

export default function StoriesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

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
  }, []);

  const scrollTo = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "right" ? 160 : -160;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const items = gsap.utils.toArray(".story-item") as HTMLElement[];
    gsap.set(items, { y: 20, opacity: 0 });
    ScrollTrigger.batch(items, {
      start: "top 92%",
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
  }, { scope: containerRef });

  return (
    <>
      <div ref={containerRef} className="w-full py-10 md:py-12 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 md:px-[10vw] mb-5">
          <p
            className="text-[10px] tracking-[0.2em] uppercase font-medium"
            style={{ color: "var(--accent)" }}
          >
            Наша работа
          </p>

          {/* Mobile scroll arrows — only show on small screens */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => scrollTo("left")}
              className={`w-7 h-7 rounded-full border border-white/10 flex items-center justify-center transition-all cursor-pointer ${
                canScrollLeft
                  ? "text-white/60 hover:text-white hover:border-white/30"
                  : "text-white/10 pointer-events-none"
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scrollTo("right")}
              className={`w-7 h-7 rounded-full border border-white/10 flex items-center justify-center transition-all cursor-pointer ${
                canScrollRight
                  ? "text-white/60 hover:text-white hover:border-white/30"
                  : "text-white/10 pointer-events-none"
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
                {/* Ring */}
                <div className="story-ring relative w-16 h-16 md:w-[88px] md:h-[88px] rounded-full p-[2px]">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${story.color}, ${story.color}44)`,
                    }}
                  />
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[var(--bg-deep)]">
                    <div
                      className={`w-full h-full bg-gradient-to-br ${story.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-500`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-2.5 h-2.5 md:w-3 md:h-3 text-white ml-0.5"
                          fill="currentColor"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Label */}
                <div className="text-center min-w-[70px]">
                  <p className="text-[10px] md:text-[11px] text-white/80 font-medium tracking-wide uppercase group-hover:text-white transition-colors leading-tight">
                    {story.title}
                  </p>
                  <p className="text-[8px] md:text-[9px] text-neutral-600 tracking-wider uppercase mt-0.5 leading-tight">
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
