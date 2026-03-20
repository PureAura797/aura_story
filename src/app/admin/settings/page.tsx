"use client";

import { useState, useEffect } from "react";
import { Check, AlertCircle, Lock, Shield, Eye, EyeOff, Mail, Phone, Save, Loader2, ShieldCheck, ShieldOff, Copy, KeyRound } from "lucide-react";

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 pr-10 text-sm text-white placeholder-neutral-600 focus:focus-visible:outline-none focus:border-white/20 transition-colors"
          placeholder={placeholder}
          required
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-3.5 h-3.5" strokeWidth={1.5} /> : <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />}
        </button>
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Admin profile settings
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [originalProfile, setOriginalProfile] = useState({ recoveryEmail: "", adminPhone: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // 2FA state
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(true);
  const [setupData, setSetupData] = useState<{ qrDataUrl: string; secret: string; backupCodes: string[] } | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [twoFAMsg, setTwoFAMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [disablePassword, setDisablePassword] = useState("");
  const [showDisable, setShowDisable] = useState(false);
  const [backupsCopied, setBackupsCopied] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setRecoveryEmail(data.recoveryEmail || "");
        setAdminPhone(data.adminPhone || "");
        setOriginalProfile({ recoveryEmail: data.recoveryEmail || "", adminPhone: data.adminPhone || "" });
      })
      .catch(() => {});

    // Load 2FA status
    fetch("/api/admin/2fa")
      .then((r) => r.json())
      .then((data) => setTwoFAEnabled(data.enabled))
      .catch(() => {})
      .finally(() => setTwoFALoading(false));
  }, []);

  const profileChanged = recoveryEmail !== originalProfile.recoveryEmail || adminPhone !== originalProfile.adminPhone;

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recoveryEmail, adminPhone }),
      });
      if (res.ok) {
        setOriginalProfile({ recoveryEmail, adminPhone });
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2000);
      }
    } catch { /* ignore */ }
    setProfileSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Минимум 6 символов" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Пароли не совпадают" });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change", currentPassword, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Пароль успешно изменён" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: data.error || "Ошибка" });
      }
    } catch {
      setMessage({ type: "error", text: "Ошибка сервера" });
    }
    setSaving(false);
  };

  /* ── 2FA Handlers ── */
  const handleSetup2FA = async () => {
    setTwoFAMsg(null);
    setTwoFALoading(true);
    try {
      const res = await fetch("/api/admin/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setup" }),
      });
      const data = await res.json();
      setSetupData(data);
    } catch {
      setTwoFAMsg({ type: "error", text: "Ошибка генерации" });
    }
    setTwoFALoading(false);
  };

  const handleEnable2FA = async () => {
    if (!verifyCode || verifyCode.length !== 6) {
      setTwoFAMsg({ type: "error", text: "Введите 6-значный код" });
      return;
    }
    setTwoFALoading(true);
    setTwoFAMsg(null);
    try {
      const res = await fetch("/api/admin/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "enable", code: verifyCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setTwoFAEnabled(true);
        setSetupData(null);
        setVerifyCode("");
        setTwoFAMsg({ type: "success", text: "2FA успешно активирована!" });
      } else {
        setTwoFAMsg({ type: "error", text: data.error || "Неверный код" });
      }
    } catch {
      setTwoFAMsg({ type: "error", text: "Ошибка сервера" });
    }
    setTwoFALoading(false);
  };

  const handleDisable2FA = async () => {
    if (!disablePassword) {
      setTwoFAMsg({ type: "error", text: "Введите пароль" });
      return;
    }
    setTwoFALoading(true);
    setTwoFAMsg(null);
    try {
      const res = await fetch("/api/admin/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disable", password: disablePassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setTwoFAEnabled(false);
        setShowDisable(false);
        setDisablePassword("");
        setTwoFAMsg({ type: "success", text: "2FA отключена" });
      } else {
        setTwoFAMsg({ type: "error", text: data.error || "Ошибка" });
      }
    } catch {
      setTwoFAMsg({ type: "error", text: "Ошибка сервера" });
    }
    setTwoFALoading(false);
  };

  const copyBackupCodes = () => {
    if (setupData?.backupCodes) {
      navigator.clipboard.writeText(setupData.backupCodes.join("\n"));
      setBackupsCopied(true);
      setTimeout(() => setBackupsCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Настройки</h1>
        <p className="text-xs text-neutral-500">Безопасность, профиль администратора</p>
      </div>

      {/* ── Admin Profile ── */}
      <div className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-6">
          <Shield className="w-4 h-4 text-teal-400" strokeWidth={1.5} />
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-300">Профиль администратора</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-[11px] text-neutral-500 uppercase tracking-wider mb-1.5">
              <Mail className="w-3 h-3" strokeWidth={1.5} />
              Email для восстановления пароля
            </label>
            <input
              type="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:focus-visible:outline-none focus:border-white/20 transition-colors"
              placeholder="admin@pureaura.ru"
            />
            <p className="text-[11px] text-neutral-600 mt-1">На этот адрес придёт код для восстановления пароля</p>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-[11px] text-neutral-500 uppercase tracking-wider mb-1.5">
              <Phone className="w-3 h-3" strokeWidth={1.5} />
              Телефон администратора
            </label>
            <input
              type="tel"
              value={adminPhone}
              onChange={(e) => setAdminPhone(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:focus-visible:outline-none focus:border-white/20 transition-colors"
              placeholder="+7 (900) 000-00-00"
            />
            <p className="text-[11px] text-neutral-600 mt-1">Личный телефон владельца/админа (не отображается на сайте)</p>
          </div>

          {profileChanged && (
            <button
              onClick={handleSaveProfile}
              disabled={profileSaving}
              className="w-full py-2.5 bg-white text-black text-xs font-bold uppercase tracking-[0.15em] hover:bg-neutral-200 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
            >
              {profileSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : profileSaved ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Save className="w-3.5 h-3.5" strokeWidth={1.5} />
              )}
              {profileSaved ? "Сохранено" : "Сохранить профиль"}
            </button>
          )}
        </div>
      </div>

      {/* ── 2FA ── */}
      <div className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-6 mb-4">
        <div className="flex items-center gap-2.5 mb-6">
          <KeyRound className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-300">Двухфакторная аутентификация</h2>
        </div>

        {twoFALoading && !setupData ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
          </div>
        ) : twoFAEnabled ? (
          /* ── 2FA is ON ── */
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 py-3 px-4 bg-teal-400/5 border border-teal-400/10">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" strokeWidth={1.5} />
              <p className="text-xs text-teal-400">2FA активна. Вход защищён кодом из приложения.</p>
            </div>

            {!showDisable ? (
              <button
                onClick={() => setShowDisable(true)}
                className="w-full py-2.5 bg-white/[0.04] border border-white/[0.06] text-xs text-neutral-400 hover:text-red-400 hover:border-red-400/20 transition-all cursor-pointer"
              >
                Отключить 2FA
              </button>
            ) : (
              <div className="space-y-3">
                <PasswordInput label="Подтвердите пароль" value={disablePassword} onChange={setDisablePassword} placeholder="Введите текущий пароль" />
                <div className="flex gap-2">
                  <button
                    onClick={handleDisable2FA}
                    disabled={twoFALoading}
                    className="flex-1 py-2.5 bg-red-500/10 border border-red-500/20 text-xs text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                  >
                    Подтвердить отключение
                  </button>
                  <button
                    onClick={() => { setShowDisable(false); setDisablePassword(""); }}
                    className="px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] text-xs text-neutral-500 hover:text-white transition-all cursor-pointer"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : setupData ? (
          /* ── Setup flow ── */
          <div className="space-y-5">
            {/* Step 1: QR Code */}
            <div>
              <p className="text-xs text-neutral-400 mb-3">1. Отсканируйте QR-код в Google Authenticator или Яндекс Ключ:</p>
              <div className="flex justify-center py-4 bg-white/[0.02] border border-white/[0.06]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={setupData.qrDataUrl} alt="QR код для 2FA" className="w-48 h-48" />
              </div>
              <p className="text-[11px] text-neutral-600 mt-2 text-center font-mono break-all">
                Или введите вручную: {setupData.secret}
              </p>
            </div>

            {/* Step 2: Backup codes */}
            <div>
              <p className="text-xs text-neutral-400 mb-3">2. Сохраните бэкап-коды (на случай потери телефона):</p>
              <div className="bg-white/[0.02] border border-white/[0.06] p-4">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {setupData.backupCodes.map((code, i) => (
                    <code key={i} className="text-xs text-teal-400 font-mono bg-teal-400/5 px-2 py-1.5 text-center">{code}</code>
                  ))}
                </div>
                <button
                  onClick={copyBackupCodes}
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-white/[0.04] border border-white/[0.06] text-xs text-neutral-400 hover:text-white transition-all cursor-pointer"
                >
                  {backupsCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" strokeWidth={1.5} />}
                  {backupsCopied ? "Скопировано!" : "Скопировать все"}
                </button>
              </div>
            </div>

            {/* Step 3: Verify */}
            <div>
              <p className="text-xs text-neutral-400 mb-3">3. Введите код из приложения для подтверждения:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-sm text-white font-mono text-center tracking-[0.3em] placeholder-neutral-600 focus:focus-visible:outline-none focus:border-teal-400/30 transition-colors"
                />
                <button
                  onClick={handleEnable2FA}
                  disabled={twoFALoading || verifyCode.length !== 6}
                  className="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-[0.1em] hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {twoFALoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Активировать"}
                </button>
              </div>
            </div>

            <button
              onClick={() => setSetupData(null)}
              className="w-full text-center text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors cursor-pointer"
            >
              Отменить настройку
            </button>
          </div>
        ) : (
          /* ── 2FA is OFF ── */
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 py-3 px-4 bg-amber-400/5 border border-amber-400/10">
              <ShieldOff className="w-4 h-4 text-amber-400 shrink-0" strokeWidth={1.5} />
              <p className="text-xs text-neutral-400">2FA не активна. Рекомендуем включить для защиты аккаунта.</p>
            </div>
            <button
              onClick={handleSetup2FA}
              disabled={twoFALoading}
              className="w-full py-2.5 bg-white text-black text-xs font-bold uppercase tracking-[0.15em] hover:bg-neutral-200 disabled:opacity-30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
              Включить 2FA
            </button>
          </div>
        )}

        {twoFAMsg && (
          <div
            className={`flex items-center gap-2 py-2.5 px-3 text-xs mt-4 ${
              twoFAMsg.type === "success"
                ? "text-green-400 bg-green-400/5 border border-green-400/10"
                : "text-red-400 bg-red-400/5 border border-red-400/10"
            }`}
          >
            {twoFAMsg.type === "success" ? (
              <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
            )}
            {twoFAMsg.text}
          </div>
        )}
      </div>

      {/* ── Change password ── */}
      <div className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-6">
        <div className="flex items-center gap-2.5 mb-6">
          <Lock className="w-4 h-4 text-neutral-400" strokeWidth={1.5} />
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-300">Смена пароля</h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <PasswordInput label="Текущий пароль" value={currentPassword} onChange={setCurrentPassword} placeholder="Введите текущий пароль" />
          <PasswordInput label="Новый пароль" value={newPassword} onChange={setNewPassword} placeholder="Минимум 6 символов" />
          <PasswordInput label="Подтверждение" value={confirmPassword} onChange={setConfirmPassword} placeholder="Повторите новый пароль" />

          {message && (
            <div
              className={`flex items-center gap-2 py-2.5 px-3 text-xs ${
                message.type === "success"
                  ? "text-green-400 bg-green-400/5 border border-green-400/10"
                  : "text-red-400 bg-red-400/5 border border-red-400/10"
              }`}
            >
              {message.type === "success" ? (
                <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              )}
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={saving || !currentPassword || !newPassword || !confirmPassword}
            className="w-full py-2.5 bg-white text-black text-xs font-bold uppercase tracking-[0.15em] hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {saving ? "Сохранение..." : "Изменить пароль"}
          </button>
        </form>
      </div>

      {/* Security info */}
      <div className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-4 mt-4">
        <div className="flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-neutral-600 mt-0.5 shrink-0" strokeWidth={1.5} />
          <div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Пароль хранится в хешированном виде (SHA-256). TOTP-секрет хранится зашифрованно.
              Бэкап-коды — одноразовые, после использования удаляются.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
