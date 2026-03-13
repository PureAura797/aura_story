"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

const team = [
  {
    name: "Алексей Кравцов",
    role: "Руководитель бригады",
    status: "На выезде",
    online: true,
    experience: "12 лет",
    objects: "2 400+",
    specialization: "Биоочистка, дезинфекция",
    avatar: "/team/alexey.png",
    color: "#5eead4",
  },
  {
    name: "Марина Волкова",
    role: "Санитарный инженер",
    status: "Доступна",
    online: true,
    experience: "8 лет",
    objects: "1 800+",
    specialization: "АТФ-контроль, протоколы",
    avatar: "/team/marina.png",
    color: "#d4a574",
  },
  {
    name: "Дмитрий Орлов",
    role: "Техник-дезинфектор",
    status: "На объекте",
    online: true,
    experience: "6 лет",
    objects: "900+",
    specialization: "Озонирование, ULV",
    avatar: "/team/dmitry.png",
    color: "#a78bfa",
  },
  {
    name: "Елена Сотникова",
    role: "Логист-координатор",
    status: "В офисе",
    online: true,
    experience: "5 лет",
    objects: "3 000+",
    specialization: "Координация, документооборот",
    avatar: "/team/elena.png",
    color: "#fb7185",
  },
  {
    name: "Игорь Белов",
    role: "Старший дезинфектор",
    status: "На выезде",
    online: true,
    experience: "10 лет",
    objects: "2 100+",
    specialization: "Биожидкости, утилизация",
    avatar: "/team/igor.png",
    color: "#14b8a6",
  },
  {
    name: "Анна Климова",
    role: "Контроль качества",
    status: "Доступна",
    online: true,
    experience: "7 лет",
    objects: "1 500+",
    specialization: "Финальная приёмка, АТФ",
    avatar: "/team/anna.png",
    color: "#38bdf8",
  },
];

export default function Team() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cards = gsap.utils.toArray(".team-card") as HTMLElement[];
    gsap.set(cards, { y: 30, opacity: 0 });

    ScrollTrigger.batch(cards, {
      start: "top 90%",
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: "power3.out",
        }),
      once: true,
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef}>
      {/* Section label */}
      <p
        className="text-[10px] tracking-[0.2em] uppercase font-medium mb-4"
        style={{ color: "var(--accent)" }}
      >
        Команда
      </p>

      <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">
        Наши специалисты
      </h2>
      <p className="text-neutral-500 text-sm font-light mt-4 mb-12 max-w-md">
        Сертифицированные профессионалы с опытом от 5 лет. Каждый прошёл обучение по протоколам биобезопасности.
      </p>

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((member, idx) => (
          <div
            key={idx}
            className="team-card border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 p-6 group"
          >
            {/* Top row: avatar + info */}
            <div className="flex items-center gap-4 mb-5">
              {/* Avatar with gradient ring + real photo */}
              <div className="relative w-12 h-12 rounded-full p-[2px] shrink-0">
                <div
                  className="absolute inset-0 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${member.color}, ${member.color}44)`,
                  }}
                />
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[var(--bg-deep)]">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105"
                  />
                </div>
              </div>

              {/* Name + role */}
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white truncate group-hover:text-[var(--accent)] transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-[11px] text-neutral-500 truncate">
                  {member.role}
                </p>
              </div>
            </div>

            {/* Status line */}
            <div className="flex items-center gap-2 mb-5">
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50"
                  style={{ backgroundColor: "var(--accent)" }}
                />
                <span
                  className="relative inline-flex rounded-full h-1.5 w-1.5"
                  style={{ backgroundColor: "var(--accent)" }}
                />
              </span>
              <span className="text-[10px] text-neutral-400 tracking-wide">
                {member.status}
              </span>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/5 mb-5" />

            {/* Stats row */}
            <div className="flex items-center gap-6 mb-4">
              <div>
                <p className="text-lg font-bold text-white tracking-tight">{member.experience}</p>
                <p className="text-[9px] text-neutral-600 uppercase tracking-wider">Опыт</p>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div>
                <p className="text-lg font-bold text-white tracking-tight">{member.objects}</p>
                <p className="text-[9px] text-neutral-600 uppercase tracking-wider">Объектов</p>
              </div>
            </div>

            {/* Specialization tag */}
            <p className="text-[10px] text-neutral-500 tracking-wide">
              {member.specialization}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
