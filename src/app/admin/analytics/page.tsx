"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle, Plus, Trash2, Code, BarChart3 } from "lucide-react";

interface CustomScript {
  id: string;
  name: string;
  position: "head" | "body";
  code: string;
  enabled: boolean;
}

interface AnalyticsSettings {
  yandexMetrika: string;
  googleAnalytics: string;
  googleTagManager: string;
  vkPixel: string;
  customScripts: CustomScript[];
}

const DEFAULTS: AnalyticsSettings = {
  yandexMetrika: "",
  googleAnalytics: "",
  googleTagManager: "",
  vkPixel: "",
  customScripts: [],
};

export default function AnalyticsPage() {
  const [settings, setSettings] = useState<AnalyticsSettings>(DEFAULTS);
  const [original, setOriginal] = useState<AnalyticsSettings>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingScript, setEditingScript] = useState<CustomScript | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((data) => {
        const merged = { ...DEFAULTS, ...data, customScripts: data.customScripts || [] };
        setSettings(merged);
        setOriginal(merged);
      })
      .catch(() => {});
  }, []);

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(original);

  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/admin/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setOriginal(settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        const data = await res.json().catch(() => ({}));
        setSaveError(data.error || `Ошибка ${res.status}: не удалось сохранить`);
      }
    } catch {
      setSaveError("Ошибка сети: не удалось подключиться к серверу");
    }
    setSaving(false);
  };

  const addScript = () => {
    const newScript: CustomScript = {
      id: Date.now().toString(),
      name: "",
      position: "head",
      code: "",
      enabled: true,
    };
    setEditingScript(newScript);
  };

  const saveScript = (script: CustomScript) => {
    const exists = settings.customScripts.find((s) => s.id === script.id);
    if (exists) {
      setSettings({
        ...settings,
        customScripts: settings.customScripts.map((s) => (s.id === script.id ? script : s)),
      });
    } else {
      setSettings({
        ...settings,
        customScripts: [...settings.customScripts, script],
      });
    }
    setEditingScript(null);
  };

  const deleteScript = (id: string) => {
    setSettings({
      ...settings,
      customScripts: settings.customScripts.filter((s) => s.id !== id),
    });
  };

  const toggleScript = (id: string) => {
    setSettings({
      ...settings,
      customScripts: settings.customScripts.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      ),
    });
  };

  const trackers = [
    { key: "yandexMetrika" as const, label: "Яндекс.Метрика", placeholder: "12345678", hint: "Counter ID из Метрики", color: "#FF0000" },
    { key: "googleAnalytics" as const, label: "Google Analytics (GA4)", placeholder: "G-XXXXXXXXXX", hint: "Measurement ID из GA4", color: "#F9AB00" },
    { key: "googleTagManager" as const, label: "Google Tag Manager", placeholder: "GTM-XXXXXXX", hint: "Container ID из GTM", color: "#4285F4" },
    { key: "vkPixel" as const, label: "VK Pixel", placeholder: "VK-RTRG-XXXXXX-XXXXX", hint: "Пиксель ретаргетинга VK Ads", color: "#0077FF" },
  ];

  return (
    <div className="max-w-2xl pb-24">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Аналитика</h1>
      <p className="text-sm text-neutral-500 mb-8">
        Счётчики аналитики и рекламные пиксели. Рекламщик может настроить всё сам.
      </p>

      {/* ── Tracking IDs ── */}
      <div className="flex flex-col gap-4 mb-8">
        <h2 className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-medium flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5" strokeWidth={1.5} />
          Счётчики и пиксели
        </h2>

        {trackers.map((t) => (
          <div key={t.key} className="border border-white/10 bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ background: t.color }} />
              <label className="text-sm font-medium">{t.label}</label>
            </div>
            <input
              type="text"
              value={settings[t.key]}
              onChange={(e) => setSettings({ ...settings, [t.key]: e.target.value })}
              placeholder={t.placeholder}
              className="w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white placeholder-neutral-600 focus-visible:outline-none focus:border-teal-500/50 transition-colors font-mono text-xs"
            />
            <p className="text-[11px] text-neutral-600 mt-1">{t.hint}</p>
          </div>
        ))}
      </div>

      {/* ── Custom Scripts ── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-medium flex items-center gap-2">
            <Code className="w-3.5 h-3.5" strokeWidth={1.5} />
            Произвольные скрипты
          </h2>
          <button
            onClick={addScript}
            className="text-xs text-teal-400 hover:text-teal-300 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Добавить скрипт
          </button>
        </div>

        {settings.customScripts.length === 0 && !editingScript && (
          <div className="border border-dashed border-white/10 p-8 text-center">
            <Code className="w-6 h-6 text-neutral-700 mx-auto mb-2" strokeWidth={1} />
            <p className="text-xs text-neutral-600">Нет добавленных скриптов</p>
            <p className="text-[11px] text-neutral-700 mt-1">Добавьте скрипт для аналитики, рекламы или трекинга</p>
          </div>
        )}

        {settings.customScripts.map((script) => (
          <div key={script.id} className="border border-white/10 bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleScript(script.id)}
                  className={`w-8 h-4 rounded-full relative transition-colors cursor-pointer ${script.enabled ? "bg-teal-500" : "bg-neutral-700"}`}
                >
                  <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${script.enabled ? "left-4.5" : "left-0.5"}`} />
                </button>
                <span className="text-sm font-medium">{script.name || "Без названия"}</span>
                <span className={`text-[11px] uppercase tracking-wider px-1.5 py-0.5 ${script.position === "head" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                  {"<" + script.position + ">"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingScript({ ...script })}
                  className="text-[11px] text-neutral-500 hover:text-white transition-colors cursor-pointer"
                >
                  Изменить
                </button>
                <button
                  onClick={() => { if (confirm("Удалить скрипт?")) deleteScript(script.id); }}
                  className="text-neutral-600 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </div>
            </div>
            <pre className="text-[11px] text-neutral-600 font-mono bg-black/30 p-2 max-h-16 overflow-hidden">
              {script.code.substring(0, 200)}{script.code.length > 200 ? "…" : ""}
            </pre>
          </div>
        ))}

        {/* ── Script Editor Modal ── */}
        {editingScript && (
          <div className="border border-teal-500/30 bg-teal-500/[0.03] p-5 flex flex-col gap-4">
            <h3 className="text-sm font-medium text-teal-300">
              {settings.customScripts.find((s) => s.id === editingScript.id) ? "Редактировать скрипт" : "Новый скрипт"}
            </h3>
            <div>
              <label className="text-[11px] uppercase tracking-[0.15em] text-neutral-500 font-medium block mb-1.5">Название</label>
              <input
                type="text"
                value={editingScript.name}
                onChange={(e) => setEditingScript({ ...editingScript, name: e.target.value })}
                placeholder="Roistat / Calltouch / Custom Pixel"
                className="w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white placeholder-neutral-600 focus-visible:outline-none focus:border-teal-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.15em] text-neutral-500 font-medium block mb-1.5">Позиция</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingScript({ ...editingScript, position: "head" })}
                  className={`px-4 py-2 text-xs border cursor-pointer transition-colors ${editingScript.position === "head" ? "border-teal-500/50 bg-teal-500/10 text-teal-300" : "border-white/10 text-neutral-500 hover:border-white/20"}`}
                >
                  {"<head>"}
                </button>
                <button
                  onClick={() => setEditingScript({ ...editingScript, position: "body" })}
                  className={`px-4 py-2 text-xs border cursor-pointer transition-colors ${editingScript.position === "body" ? "border-teal-500/50 bg-teal-500/10 text-teal-300" : "border-white/10 text-neutral-500 hover:border-white/20"}`}
                >
                  {"<body>"}
                </button>
              </div>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.15em] text-neutral-500 font-medium block mb-1.5">Код</label>
              <textarea
                value={editingScript.code}
                onChange={(e) => setEditingScript({ ...editingScript, code: e.target.value })}
                placeholder={"<script>\n  // Ваш код\n</script>"}
                rows={6}
                className="w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-xs text-white placeholder-neutral-600 focus-visible:outline-none focus:border-teal-500/50 transition-colors font-mono resize-y"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => saveScript(editingScript)}
                disabled={!editingScript.name || !editingScript.code}
                className="btn-primary px-5 py-2 text-xs disabled:opacity-30"
              >
                Сохранить скрипт
              </button>
              <button
                onClick={() => setEditingScript(null)}
                className="text-xs text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Save Bar ── */}
      {(hasChanges || saved || saveError) && (
        <div className={`fixed bottom-0 left-0 right-0 z-50 border-t px-6 py-4 backdrop-blur-xl transition-all duration-300 ${
          saveError ? "border-red-500/20 bg-red-950/90" :
          saved ? "border-green-500/20 bg-green-950/90" :
          "border-white/10 bg-black/90"
        }`}>
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <p className={`text-xs ${
              saveError ? "text-red-400" :
              saved ? "text-green-400" :
              "text-neutral-400"
            }`}>
              {saveError ? `✕ ${saveError}` : saved ? "✓ Изменения сохранены" : "Есть несохранённые изменения"}
            </p>
            <div className="flex items-center gap-3">
              {saveError?.includes("Unauthorized") && (
                <a href="/admin" className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors">
                  Перелогиниться
                </a>
              )}
              {!saved && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary px-6 py-2.5 flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" strokeWidth={1.5} />
                )}
                {saving ? "Сохранение..." : saveError ? "Повторить" : "Сохранить"}
              </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
