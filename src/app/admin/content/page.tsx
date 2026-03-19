"use client";

import { useState, useEffect, useMemo } from "react";
import { Save, Search, ChevronDown, ChevronRight, Check } from "lucide-react";

interface ContentData {
  [key: string]: string;
}

// Group keys by section prefix
function groupBySection(data: ContentData): Record<string, [string, string][]> {
  const groups: Record<string, [string, string][]> = {};
  for (const [key, value] of Object.entries(data)) {
    const section = key.split(".")[0];
    if (!groups[section]) groups[section] = [];
    groups[section].push([key, value]);
  }
  // Sort sections
  const sorted: Record<string, [string, string][]> = {};
  for (const s of Object.keys(groups).sort()) {
    sorted[s] = groups[s].sort((a, b) => a[0].localeCompare(b[0]));
  }
  return sorted;
}

const SECTION_LABELS: Record<string, string> = {
  nav: "Навигация",
  hero: "Главный экран",
  stories: "Сторис",
  services: "Услуги",
  expertise: "Экспертиза",
  team: "Команда",
  process: "Протокол",
  portfolio: "Портфолио",
  equipment: "Оборудование",
  pricing: "Цены",
  calc: "Калькулятор (тексты)",
  reviews: "Отзывы (тексты)",
  faq: "FAQ",
  contact: "Контактная форма",
  cta: "CTA-блоки",
  bottom: "Нижняя панель",
  lang: "Язык",
  marquee: "Бегущая строка",
  footer: "Футер",
  emergency: "Экстренная кнопка",
};

export default function ContentEditor() {
  const [content, setContent] = useState<ContentData>({});
  const [original, setOriginal] = useState<ContentData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [locale, setLocale] = useState<"ru" | "en">("ru");

  useEffect(() => {
    loadContent();
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadContent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content?locale=${locale}`);
      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
        setOriginal(data.content);
      }
    } catch {
      console.error("Failed to load content");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, content }),
      });
      if (res.ok) {
        setSaved(true);
        setOriginal({ ...content });
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      alert("Ошибка сохранения");
    }
    setSaving(false);
  };

  const hasChanges = useMemo(() => {
    return JSON.stringify(content) !== JSON.stringify(original);
  }, [content, original]);

  const grouped = useMemo(() => groupBySection(content), [content]);

  const filteredGroups = useMemo(() => {
    if (!search) return grouped;
    const q = search.toLowerCase();
    const result: Record<string, [string, string][]> = {};
    for (const [section, entries] of Object.entries(grouped)) {
      const filtered = entries.filter(
        ([key, val]) => key.toLowerCase().includes(q) || val.toLowerCase().includes(q)
      );
      if (filtered.length > 0) result[section] = filtered;
    }
    return result;
  }, [grouped, search]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const updateValue = (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Контент</h1>
          <p className="text-xs text-neutral-500">Все тексты сайта • {Object.keys(content).length} полей</p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            saved
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : hasChanges
              ? "bg-white text-black hover:bg-white/90"
              : "bg-white/[0.04] text-neutral-600 border border-white/[0.06] cursor-not-allowed"
          }`}
        >
          {saved ? (
            <>
              <Check className="w-3.5 h-3.5" strokeWidth={2} /> Сохранено
            </>
          ) : saving ? (
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-3.5 h-3.5" strokeWidth={1.5} /> Сохранить
            </>
          )}
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        {/* Locale switch */}
        <div className="flex border border-white/10">
          {(["ru", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                locale === l ? "bg-white/[0.1] text-white" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600" strokeWidth={1.5} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по ключу или тексту..."
            className="w-full bg-white/[0.04] border border-white/10 pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-600 outline-none focus:border-white/20"
          />
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-1">
        {Object.entries(filteredGroups).map(([section, entries]) => {
          const isOpen = openSections.has(section) || !!search;
          const label = SECTION_LABELS[section] || section;
          const changedCount = entries.filter(([key]) => content[key] !== original[key]).length;

          return (
            <div key={section} className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150">
              <button
                onClick={() => toggleSection(section)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-500" strokeWidth={1.5} />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-500" strokeWidth={1.5} />
                  )}
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{label}</span>
                  <span className="text-[10px] text-neutral-600">{entries.length}</span>
                </div>
                {changedCount > 0 && (
                  <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 font-medium">
                    {changedCount} изменено
                  </span>
                )}
              </button>

              {isOpen && (
                <div className="border-t border-white/[0.04] divide-y divide-white/[0.04]">
                  {entries.map(([key, _]) => {
                    const isChanged = content[key] !== original[key];
                    const isLong = (content[key]?.length || 0) > 80;
                    return (
                      <div key={key} className={`px-4 py-3 ${isChanged ? "bg-blue-500/[0.04]" : ""}`}>
                        <label className="text-[10px] text-neutral-500 font-mono block mb-1.5">{key}</label>
                        {isLong ? (
                          <textarea
                            value={content[key] || ""}
                            onChange={(e) => updateValue(key, e.target.value)}
                            rows={3}
                            className="w-full bg-white/[0.03] border border-white/10 px-3 py-2 text-xs text-white placeholder-neutral-600 outline-none focus:border-white/25 resize-y transition-colors"
                          />
                        ) : (
                          <input
                            type="text"
                            value={content[key] || ""}
                            onChange={(e) => updateValue(key, e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 px-3 py-2 text-xs text-white placeholder-neutral-600 outline-none focus:border-white/25 transition-colors"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
