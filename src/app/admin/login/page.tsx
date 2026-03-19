"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, AlertCircle, Eye, EyeOff } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Link from "next/link";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        setError("Неверный пароль");
      }
    } catch {
      setError("Ошибка сервера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <p className="text-[11px] text-neutral-500 uppercase tracking-[0.2em]">Панель управления</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] text-neutral-500 uppercase tracking-[0.15em] font-medium block mb-2">
              Пароль
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                autoFocus
                className="w-full bg-white/[0.04] border border-white/10 px-4 py-3 pr-11 text-sm text-white placeholder-neutral-600 outline-none transition-colors focus:border-white/30"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors"
                tabIndex={-1}
              >
                {showPass ? (
                  <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                ) : (
                  <Eye className="w-4 h-4" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs">
              <AlertCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                Войти
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-between mt-6">
          <p className="text-[10px] text-neutral-700">
            Доступ только для администратора
          </p>
          <Link
            href="/admin/recovery"
            className="text-[10px] text-neutral-600 hover:text-neutral-400 transition-colors"
          >
            Забыли пароль?
          </Link>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[11px] text-neutral-600 hover:text-neutral-300 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" strokeWidth={1.5} />
            Вернуться на сайт
          </Link>
        </div>
      </div>
    </div>
  );
}
