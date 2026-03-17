"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, AlertCircle, Check, Mail, KeyRound, Lock, Eye, EyeOff } from "lucide-react";
import Logo from "@/components/ui/Logo";

type Step = "email" | "code" | "newpass" | "done";

export default function AdminRecovery() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_recovery", email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("code");
      } else {
        setError(data.error || "Ошибка");
      }
    } catch {
      setError("Ошибка сервера");
    }
    setLoading(false);
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (step === "code") {
      if (code.length !== 6) {
        setError("Код должен содержать 6 цифр");
        return;
      }
      setStep("newpass");
      return;
    }

    // step === "newpass"
    if (newPassword.length < 6) {
      setError("Минимум 6 символов");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset", code, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("done");
      } else {
        setError(data.error || "Ошибка");
      }
    } catch {
      setError("Ошибка сервера");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="absolute inset-0 border border-white/[0.03] m-3 pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <p className="text-[11px] text-neutral-500 uppercase tracking-[0.2em]">Восстановление доступа</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(["email", "code", "newpass"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold border transition-all ${
                  step === s
                    ? "border-white text-white"
                    : step === "done" || (["email", "code", "newpass"].indexOf(step) > i)
                    ? "border-green-500/40 text-green-400 bg-green-400/5"
                    : "border-white/10 text-neutral-600"
                }`}
              >
                {step === "done" || (["email", "code", "newpass"].indexOf(step) > i) ? "✓" : i + 1}
              </div>
              {i < 2 && <div className="w-8 h-px bg-white/[0.08]" />}
            </div>
          ))}
        </div>

        {/* Step: email */}
        {step === "email" && (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-[10px] text-neutral-500 uppercase tracking-wider mb-2">
                <Mail className="w-3 h-3" strokeWidth={1.5} />
                Email администратора
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/20 transition-colors"
                placeholder="admin@pureaura.ru"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs py-2">
                <AlertCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-[0.15em] hover:bg-neutral-200 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Отправка..." : "Отправить код"}
              {!loading && <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />}
            </button>
          </form>
        )}

        {/* Step: code */}
        {step === "code" && (
          <form onSubmit={handleVerifyAndReset} className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Код отправлен на <span className="text-white">{email}</span>
              </p>
              <p className="text-[10px] text-neutral-600 mt-1">
                Не получили? Проверьте спам или консоль сервера
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] text-neutral-500 uppercase tracking-wider mb-2">
                <KeyRound className="w-3 h-3" strokeWidth={1.5} />
                6-значный код
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-2xl text-white text-center tracking-[0.5em] font-mono placeholder-neutral-600 focus:outline-none focus:border-white/20 transition-colors"
                placeholder="000000"
                maxLength={6}
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs py-2">
                <AlertCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={code.length !== 6}
              className="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-[0.15em] hover:bg-neutral-200 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
            >
              Подтвердить
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </form>
        )}

        {/* Step: new password */}
        {step === "newpass" && (
          <form onSubmit={handleVerifyAndReset} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-[10px] text-neutral-500 uppercase tracking-wider mb-2">
                <Lock className="w-3 h-3" strokeWidth={1.5} />
                Новый пароль
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] px-4 py-3 pr-11 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="Минимум 6 символов"
                  required
                  minLength={6}
                  autoFocus
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors" tabIndex={-1}>
                  {showPass ? <EyeOff className="w-3.5 h-3.5" strokeWidth={1.5} /> : <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] text-neutral-500 uppercase tracking-wider mb-2">
                <Lock className="w-3 h-3" strokeWidth={1.5} />
                Подтверждение
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] px-4 py-3 pr-11 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="Повторите пароль"
                  required
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors" tabIndex={-1}>
                  {showConfirm ? <EyeOff className="w-3.5 h-3.5" strokeWidth={1.5} /> : <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs py-2">
                <AlertCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              className="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-[0.15em] hover:bg-neutral-200 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Сохранение..." : "Сохранить пароль"}
              {!loading && <Check className="w-3.5 h-3.5" strokeWidth={2} />}
            </button>
          </form>
        )}

        {/* Step: done */}
        {step === "done" && (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-14 h-14 border border-green-500/20 bg-green-400/5">
              <Check className="w-7 h-7 text-green-400" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm text-white font-bold mb-1">Пароль изменён</p>
              <p className="text-[11px] text-neutral-500">Войдите с новым паролем</p>
            </div>
            <button
              onClick={() => router.push("/admin/login")}
              className="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-[0.15em] hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
            >
              Войти
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
        )}

        {/* Back to login */}
        {step !== "done" && (
          <button
            onClick={() => router.push("/admin/login")}
            className="flex items-center gap-1.5 text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors mt-6 mx-auto"
          >
            <ArrowLeft className="w-3 h-3" strokeWidth={1.5} />
            Назад ко входу
          </button>
        )}

        {/* Offline note */}
        <p className="text-center text-[10px] text-neutral-700 mt-8">
          Оффлайн-режим: код отображается в консоли сервера
        </p>
      </div>
    </div>
  );
}
