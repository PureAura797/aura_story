"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, AlertCircle, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Link from "next/link";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  // 2FA state
  const [step, setStep] = useState<"password" | "totp">("password");
  const [tempToken, setTempToken] = useState("");
  const [totpCode, setTotpCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first TOTP input
  useEffect(() => {
    if (step === "totp") {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  /* ── Step 1: Password ── */
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.requires2FA) {
          setTempToken(data.tempToken);
          setStep("totp");
        } else {
          router.push("/admin");
        }
      } else {
        setError(data.error || "Неверный пароль");
      }
    } catch {
      setError("Ошибка сервера");
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 2: TOTP ── */
  const handleTotpDigit = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...totpCode];
    newCode[index] = value.slice(-1);
    setTotpCode(newCode);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    const fullCode = newCode.join("");
    if (fullCode.length === 6) {
      submitTOTP(fullCode);
    }
  };

  const handleTotpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !totpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleTotpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const digits = pasted.split("");
      setTotpCode(digits);
      submitTOTP(pasted);
    }
  };

  const submitTOTP = async (code: string) => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-totp", tempToken, code }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin");
      } else {
        if (data.expired) {
          setStep("password");
          setTempToken("");
        }
        setError(data.error || "Неверный код");
        setTotpCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Ошибка сервера");
    } finally {
      setLoading(false);
    }
  };

  /* ── Backup code entry ── */
  const [showBackupInput, setShowBackupInput] = useState(false);
  const [backupCode, setBackupCode] = useState("");

  const handleBackupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!backupCode.trim()) return;
    await submitTOTP(backupCode.trim());
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

        {/* ── Step: Password ── */}
        {step === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-password" className="text-[11px] text-neutral-500 uppercase tracking-[0.15em] font-medium block mb-2">
                Пароль
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  autoFocus
                  className="w-full bg-white/[0.04] border border-white/10 px-4 py-3 pr-11 text-sm text-white placeholder-neutral-600 focus-visible:outline-none transition-colors focus:border-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors"
                  tabIndex={-1}
                  aria-label={showPass ? "Скрыть пароль" : "Показать пароль"}
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
        )}

        {/* ── Step: TOTP Code ── */}
        {step === "totp" && (
          <div className="space-y-6">
            <div className="text-center">
              <ShieldCheck className="w-8 h-8 text-teal-400 mx-auto mb-3" strokeWidth={1} />
              <p className="text-sm text-neutral-300 mb-1">Двухфакторная аутентификация</p>
              <p className="text-xs text-neutral-500">Введите код из приложения</p>
            </div>

            {!showBackupInput ? (
              <>
                {/* 6-digit code input */}
                <div className="flex gap-2 justify-center" onPaste={handleTotpPaste}>
                  {totpCode.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleTotpDigit(i, e.target.value)}
                      onKeyDown={(e) => handleTotpKeyDown(i, e)}
                      className="w-11 h-13 bg-white/[0.04] border border-white/10 text-center text-lg text-white font-mono focus-visible:outline-none focus:border-teal-400/50 transition-colors"
                      aria-label={`Цифра ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowBackupInput(true)}
                  className="w-full text-center text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors cursor-pointer"
                >
                  Использовать бэкап-код
                </button>
              </>
            ) : (
              /* Backup code input */
              <form onSubmit={handleBackupSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] text-neutral-500 uppercase tracking-[0.15em] font-medium block mb-2">
                    Бэкап-код
                  </label>
                  <input
                    type="text"
                    value={backupCode}
                    onChange={(e) => setBackupCode(e.target.value)}
                    placeholder="Введите 8-символьный код"
                    autoFocus
                    className="w-full bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-white font-mono placeholder-neutral-600 focus-visible:outline-none focus:border-white/30 tracking-widest text-center"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !backupCode}
                  className="w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-[0.15em] hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Подтвердить
                </button>
                <button
                  type="button"
                  onClick={() => { setShowBackupInput(false); setBackupCode(""); }}
                  className="w-full text-center text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors cursor-pointer"
                >
                  Назад к коду из приложения
                </button>
              </form>
            )}

            {error && (
              <div className="flex items-center justify-center gap-2 text-red-400 text-xs">
                <AlertCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                {error}
              </div>
            )}

            {loading && (
              <div className="flex justify-center">
                <div className="w-5 h-5 border-2 border-neutral-700 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <p className="text-[11px] text-neutral-700">
            Доступ только для администратора
          </p>
          <Link
            href="/admin/recovery"
            className="text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors"
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
