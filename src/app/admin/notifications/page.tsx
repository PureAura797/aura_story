"use client";

import { useState, useEffect } from "react";
import { Mail, Send, Link, Save, Loader2, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

interface SmtpSettings {
  host: string;
  port: number;
  user: string;
  pass: string;
}

interface NotificationSettings {
  email: { enabled: boolean; recipients: string; smtp: SmtpSettings };
  telegram: { enabled: boolean; botToken: string; chatIds: string };
  max: { enabled: boolean; botToken: string; chatIds: string };
  webhook: { enabled: boolean; url: string };
}

const DEFAULTS: NotificationSettings = {
  email: { enabled: false, recipients: "", smtp: { host: "", port: 587, user: "", pass: "" } },
  telegram: { enabled: false, botToken: "", chatIds: "" },
  max: { enabled: false, botToken: "", chatIds: "" },
  webhook: { enabled: false, url: "" },
};

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULTS);
  const [original, setOriginal] = useState<NotificationSettings>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ channel: string; ok: boolean; msg: string } | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    email: false,
    telegram: false,
    max: false,
    webhook: false,
  });

  useEffect(() => {
    fetch("/api/admin/notifications")
      .then((r) => r.json())
      .then((data) => {
        const merged = { ...DEFAULTS, ...data };
        setSettings(merged);
        setOriginal(merged);
      })
      .catch(() => {});
  }, []);

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(original);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setOriginal(settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {}
    setSaving(false);
  };

  const handleTest = async (channel: string) => {
    // Save first if there are unsaved changes
    if (hasChanges) {
      await handleSave();
    }
    setTesting(channel);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/test-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel }),
      });
      const data = await res.json();
      setTestResult({
        channel,
        ok: data.ok,
        msg: data.msg || (data.ok ? "Тест отправлен ✓" : "Ошибка отправки"),
      });
      // Log diagnostics to console for debugging
      if (data.diagnostics) {
        console.log(`[Test ${channel}] Diagnostics:`, data.diagnostics);
      }
    } catch {
      setTestResult({ channel, ok: false, msg: "Ошибка сети — не удалось связаться с сервером" });
    }
    setTesting(null);
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleChannel = (channel: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [channel]: { ...prev[channel], enabled: !prev[channel].enabled },
    }));
    if (!expandedSections[channel]) {
      setExpandedSections((prev) => ({ ...prev, [channel]: true }));
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Уведомления</h1>
      <p className="text-sm text-neutral-500 mb-8">
        Настройте каналы доставки заявок с сайта. Заявки отправляются во все включённые каналы одновременно.
      </p>

      <div className="flex flex-col gap-4">

        {/* ── Email ── */}
        <div className="border border-white/10 bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150">
          <div
            onClick={() => toggleSection("email")}
            className="w-full flex items-center justify-between p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && toggleSection("email")}
          >
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-white" strokeWidth={1.5} />
              <div className="text-left">
                <p className="text-sm font-medium">Email</p>
                <p className="text-xs text-neutral-500">Заявки приходят как обычные письма</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); toggleChannel("email"); }}
                className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${settings.email.enabled ? "bg-teal-500" : "bg-neutral-700"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.email.enabled ? "left-5.5" : "left-0.5"}`} />
              </button>
              {expandedSections.email ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
            </div>
          </div>

          {expandedSections.email && (
            <div className="px-5 pb-5 border-t border-white/5 pt-4 flex flex-col gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-[0.15em] text-neutral-500 font-medium block mb-1.5">Email-адреса получателей</label>
                <input
                  type="text"
                  value={settings.email.recipients}
                  onChange={(e) => setSettings({ ...settings, email: { ...settings.email, recipients: e.target.value } })}
                  placeholder="user1@mail.ru, user2@mail.ru"
                  className="w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white placeholder-neutral-600 focus-visible:outline-none focus:border-teal-500/50 transition-colors"
                />
                <p className="text-[11px] text-neutral-600 mt-1">Несколько адресов через запятую</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-[0.15em] text-neutral-500 font-medium block mb-1.5">SMTP-сервер</label>
                  <input
                    type="text"
                    value={settings.email.smtp.host}
                    onChange={(e) => setSettings({ ...settings, email: { ...settings.email, smtp: { ...settings.email.smtp, host: e.target.value } } })}
                    placeholder="smtp.yandex.ru"
                    className="w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white placeholder-neutral-600 focus-visible:outline-none focus:border-teal-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.15em] text-neutral-500 font-medium block mb-1.5">Порт</label>
                  <input
                    type="number"
                    value={settings.email.smtp.port}
                    onChange={(e) => setSettings({ ...settings, email: { ...settings.email, smtp: { ...settings.email.smtp, port: parseInt(e.target.value) || 587 } } })}
                    className="w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white placeholder-neutral-600 focus-visible:outline-none focus:border-teal-500/50 transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-[0.15em] text-neutral-500 font-medium block mb-1.5">Логин (email)</label>
                  <input
                    type="text"
                    value={settings.email.smtp.user}
                    onChange={(e) => setSettings({ ...settings, email: { ...settings.email, smtp: { ...settings.email.smtp, user: e.target.value } } })}
                    placeholder="noreply@pureaura.ru"
                    className="w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white placeholder-neutral-600 focus-visible:outline-none focus:border-teal-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.15em] text-neutral-500 font-medium block mb-1.5">Пароль</label>
                  <input
                    type="password"
                    value={settings.email.smtp.pass}
                    onChange={(e) => setSettings({ ...settings, email: { ...settings.email, smtp: { ...settings.email.smtp, pass: e.target.value } } })}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white placeholder-neutral-600 focus-visible:outline-none focus:border-teal-500/50 transition-colors"
                  />
                </div>
              </div>
              <button
                onClick={() => handleTest("email")}
                disabled={testing === "email" || !settings.email.enabled}
                className="text-xs text-teal-400 hover:text-teal-300 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed self-start flex items-center gap-1.5"
              >
                {testing === "email" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                Отправить тест
              </button>
              {testResult?.channel === "email" && (
                <p className={`text-xs flex items-center gap-1 ${testResult.ok ? "text-green-400" : "text-red-400"}`}>
                  {testResult.ok ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {testResult.msg}
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── Telegram ── */}
        <div className="border border-white/10 bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150">
          <div
            onClick={() => toggleSection("telegram")}
            className="w-full flex items-center justify-between p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && toggleSection("telegram")}
          >
            <div className="flex items-center gap-3">
              <img src="/icons/telegram-mono.svg" alt="Telegram" className="w-5 h-5" style={{ filter: "invert(1)" }} />
              <div className="text-left">
                <p className="text-sm font-medium">Telegram</p>
                <p className="text-xs text-neutral-500">Заявки через бота @BotFather</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); toggleChannel("telegram"); }}
                className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${settings.telegram.enabled ? "bg-teal-500" : "bg-neutral-700"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.telegram.enabled ? "left-5.5" : "left-0.5"}`} />
              </button>
              {expandedSections.telegram ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
            </div>
          </div>

          {expandedSections.telegram && (
            <div className="px-5 pb-5 border-t border-white/5 pt-4 flex flex-col gap-4">
              <div className="bg-sky-500/5 border border-sky-500/10 p-3">
                <p className="text-[11px] text-sky-300/80 leading-relaxed">
                  1. Откройте <a href="https://t.me/BotFather" target="_blank" rel="noopener" className="underline">@BotFather</a> в Telegram → /newbot → скопируйте токен<br />
                  2. Каждый сотрудник нажимает <strong>/start</strong> в чате с ботом<br />
                  3. Узнать chat_id: <a href="https://t.me/userinfobot" target="_blank" rel="noopener" className="underline">@userinfobot</a> → /start
                </p>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.15em] text-neutral-500 font-medium block mb-1.5">Токен бота</label>
                <input
                  type="text"
                  value={settings.telegram.botToken}
                  onChange={(e) => setSettings({ ...settings, telegram: { ...settings.telegram, botToken: e.target.value } })}
                  placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                  className="w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white placeholder-neutral-600 focus-visible:outline-none focus:border-teal-500/50 transition-colors font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.15em] text-neutral-500 font-medium block mb-1.5">Chat ID сотрудников</label>
                <input
                  type="text"
                  value={settings.telegram.chatIds}
                  onChange={(e) => setSettings({ ...settings, telegram: { ...settings.telegram, chatIds: e.target.value } })}
                  placeholder="123456789, 987654321"
                  className="w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white placeholder-neutral-600 focus-visible:outline-none focus:border-teal-500/50 transition-colors font-mono text-xs"
                />
                <p className="text-[11px] text-neutral-600 mt-1">Несколько ID через запятую — каждый получит заявку</p>
              </div>
              <button
                onClick={() => handleTest("telegram")}
                disabled={testing === "telegram" || !settings.telegram.enabled}
                className="text-xs text-teal-400 hover:text-teal-300 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed self-start flex items-center gap-1.5"
              >
                {testing === "telegram" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                Отправить тест
              </button>
              {testResult?.channel === "telegram" && (
                <p className={`text-xs flex items-center gap-1 ${testResult.ok ? "text-green-400" : "text-red-400"}`}>
                  {testResult.ok ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {testResult.msg}
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── MAX ── */}
        <div className="border border-white/10 bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150">
          <div
            onClick={() => toggleSection("max")}
            className="w-full flex items-center justify-between p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && toggleSection("max")}
          >
            <div className="flex items-center gap-3">
              <img src="/icons/max-mono.svg" alt="MAX" className="w-5 h-5" style={{ filter: "invert(1)" }} />
              <div className="text-left">
                <p className="text-sm font-medium">MAX</p>
                <p className="text-xs text-neutral-500">Заявки через MAX Bot API</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); toggleChannel("max"); }}
                className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${settings.max.enabled ? "bg-teal-500" : "bg-neutral-700"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.max.enabled ? "left-5.5" : "left-0.5"}`} />
              </button>
              {expandedSections.max ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
            </div>
          </div>

          {expandedSections.max && (
            <div className="px-5 pb-5 border-t border-white/5 pt-4 flex flex-col gap-4">
              <div className="bg-blue-500/5 border border-blue-500/10 p-3">
                <p className="text-[11px] text-blue-300/80 leading-relaxed">
                  1. Откройте <strong>@MasterBot</strong> в MAX → создайте бота → скопируйте токен<br />
                  2. Каждый сотрудник нажимает <strong>/start</strong> в чате с ботом<br />
                  3. Chat ID можно узнать через API бота
                </p>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.15em] text-neutral-500 font-medium block mb-1.5">Токен бота</label>
                <input
                  type="text"
                  value={settings.max.botToken}
                  onChange={(e) => setSettings({ ...settings, max: { ...settings.max, botToken: e.target.value } })}
                  placeholder="bot_token_from_masterbot"
                  className="w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white placeholder-neutral-600 focus-visible:outline-none focus:border-teal-500/50 transition-colors font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.15em] text-neutral-500 font-medium block mb-1.5">Chat ID сотрудников</label>
                <input
                  type="text"
                  value={settings.max.chatIds}
                  onChange={(e) => setSettings({ ...settings, max: { ...settings.max, chatIds: e.target.value } })}
                  placeholder="123456789, 987654321"
                  className="w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white placeholder-neutral-600 focus-visible:outline-none focus:border-teal-500/50 transition-colors font-mono text-xs"
                />
                <p className="text-[11px] text-neutral-600 mt-1">Несколько ID через запятую</p>
              </div>
              <button
                onClick={() => handleTest("max")}
                disabled={testing === "max" || !settings.max.enabled}
                className="text-xs text-teal-400 hover:text-teal-300 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed self-start flex items-center gap-1.5"
              >
                {testing === "max" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                Отправить тест
              </button>
              {testResult?.channel === "max" && (
                <p className={`text-xs flex items-center gap-1 ${testResult.ok ? "text-green-400" : "text-red-400"}`}>
                  {testResult.ok ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {testResult.msg}
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── Webhook ── */}
        <div className="border border-white/10 bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150">
          <div
            onClick={() => toggleSection("webhook")}
            className="w-full flex items-center justify-between p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && toggleSection("webhook")}
          >
            <div className="flex items-center gap-3">
              <Link className="w-5 h-5 text-white" strokeWidth={1.5} />
              <div className="text-left">
                <p className="text-sm font-medium">Webhook (n8n / Zapier)</p>
                <p className="text-xs text-neutral-500">Пользовательская автоматизация</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); toggleChannel("webhook"); }}
                className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${settings.webhook.enabled ? "bg-teal-500" : "bg-neutral-700"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.webhook.enabled ? "left-5.5" : "left-0.5"}`} />
              </button>
              {expandedSections.webhook ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
            </div>
          </div>

          {expandedSections.webhook && (
            <div className="px-5 pb-5 border-t border-white/5 pt-4 flex flex-col gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-[0.15em] text-neutral-500 font-medium block mb-1.5">URL вебхука</label>
                <input
                  type="url"
                  value={settings.webhook.url}
                  onChange={(e) => setSettings({ ...settings, webhook: { ...settings.webhook, url: e.target.value } })}
                  placeholder="https://n8n.example.com/webhook/..."
                  className="w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white placeholder-neutral-600 focus-visible:outline-none focus:border-teal-500/50 transition-colors font-mono text-xs"
                />
              </div>
              <button
                onClick={() => handleTest("webhook")}
                disabled={testing === "webhook" || !settings.webhook.enabled}
                className="text-xs text-teal-400 hover:text-teal-300 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed self-start flex items-center gap-1.5"
              >
                {testing === "webhook" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                Отправить тест
              </button>
              {testResult?.channel === "webhook" && (
                <p className={`text-xs flex items-center gap-1 ${testResult.ok ? "text-green-400" : "text-red-400"}`}>
                  {testResult.ok ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {testResult.msg}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Save Bar ── */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 backdrop-blur-xl px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <p className="text-xs text-neutral-400">Есть несохранённые изменения</p>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary px-6 py-2.5 flex items-center gap-2"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" strokeWidth={1.5} />
              )}
              {saved ? "Сохранено" : "Сохранить"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
