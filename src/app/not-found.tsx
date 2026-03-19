import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b0c0f] flex flex-col items-center justify-center px-6 text-center">
      {/* Big number */}
      <h1
        className="text-[120px] sm:text-[180px] md:text-[240px] font-bold tracking-tighter leading-none text-white/[0.04] select-none"
        style={{ fontFamily: "var(--font-unbounded), sans-serif" }}
      >
        404
      </h1>

      {/* Message */}
      <div className="-mt-10 sm:-mt-16 md:-mt-20">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-medium mb-4">
          Страница не найдена
        </p>
        <p className="text-sm text-neutral-600 max-w-sm mx-auto mb-10 leading-relaxed">
          Страница была перемещена или больше не существует. 
          Но мы всегда на связи — 24/7, без выходных.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
        >
          На главную
        </Link>
        <a
          href="tel:+74951203456"
          className="px-6 py-3 border border-white/10 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white hover:border-white/30 transition-all"
        >
          Позвонить 24/7
        </a>
      </div>

      {/* Brand */}
      <p
        className="mt-20 text-[10px] uppercase tracking-[0.25em] text-neutral-800"
        style={{ fontFamily: "var(--font-unbounded), sans-serif" }}
      >
        АУРАЧИСТОТЫ.
      </p>
    </div>
  );
}
