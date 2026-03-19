export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
      {/* Branded pulse animation */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border border-white/[0.08]" />
        <div className="absolute inset-0 border border-white/[0.08] animate-ping" style={{ animationDuration: "1.5s" }} />
        <div className="absolute inset-[6px] border border-white/[0.12]" />
        <div className="absolute inset-[6px] border border-white/[0.12] animate-ping" style={{ animationDuration: "1.5s", animationDelay: "0.3s" }} />
        <div className="absolute inset-[12px] bg-[var(--accent)] opacity-40 animate-pulse" />
      </div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-600 font-medium animate-pulse">Загрузка</p>
    </div>
  );
}
