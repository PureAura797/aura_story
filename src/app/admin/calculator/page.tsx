"use client";

import { useState, useEffect } from "react";
import { Save, Check, Plus, Trash2 } from "lucide-react";

interface CalcService {
  id: string;
  label_ru: string;
  label_en: string;
  base_price: number;
  sort_order: number;
  active: boolean;
}

interface CalcExtra {
  id: string;
  label_ru: string;
  label_en: string;
  price: number;
  sort_order: number;
  active: boolean;
}

interface CalcCoefficients {
  area_coeff: number;
  area_threshold: number;
  urgent_mult: number;
}

interface CalculatorConfig {
  services: CalcService[];
  extras: CalcExtra[];
  coefficients: CalcCoefficients;
}

export default function CalculatorAdmin() {
  const [config, setConfig] = useState<CalculatorConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const res = await fetch("/api/admin/calculator");
      if (res.ok) setConfig(await res.json());
    } catch {
      console.error("Failed to load calculator config");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      alert("Ошибка сохранения");
    }
    setSaving(false);
  };

  const updateService = (idx: number, field: keyof CalcService, value: string | number | boolean) => {
    if (!config) return;
    const services = [...config.services];
    services[idx] = { ...services[idx], [field]: value };
    setConfig({ ...config, services });
  };

  const addService = () => {
    if (!config) return;
    const newService: CalcService = {
      id: `service_${Date.now()}`,
      label_ru: "Новая услуга",
      label_en: "New service",
      base_price: 10000,
      sort_order: config.services.length,
      active: true,
    };
    setConfig({ ...config, services: [...config.services, newService] });
  };

  const removeService = (idx: number) => {
    if (!config) return;
    setConfig({ ...config, services: config.services.filter((_, i) => i !== idx) });
  };

  const updateExtra = (idx: number, field: keyof CalcExtra, value: string | number | boolean) => {
    if (!config) return;
    const extras = [...config.extras];
    extras[idx] = { ...extras[idx], [field]: value };
    setConfig({ ...config, extras });
  };

  const addExtra = () => {
    if (!config) return;
    const newExtra: CalcExtra = {
      id: `extra_${Date.now()}`,
      label_ru: "Новая опция",
      label_en: "New option",
      price: 5000,
      sort_order: config.extras.length,
      active: true,
    };
    setConfig({ ...config, extras: [...config.extras, newExtra] });
  };

  const removeExtra = (idx: number) => {
    if (!config) return;
    setConfig({ ...config, extras: config.extras.filter((_, i) => i !== idx) });
  };

  const updateCoeff = (field: keyof CalcCoefficients, value: number) => {
    if (!config) return;
    setConfig({ ...config, coefficients: { ...config.coefficients, [field]: value } });
  };

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Калькулятор</h1>
          <p className="text-xs text-neutral-500">Цены, коэффициенты и дополнительные услуги</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            saved
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-white text-black hover:bg-white/90"
          }`}
        >
          {saved ? (
            <><Check className="w-3.5 h-3.5" strokeWidth={2} /> Сохранено</>
          ) : saving ? (
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <><Save className="w-3.5 h-3.5" strokeWidth={1.5} /> Сохранить</>
          )}
        </button>
      </div>

      {/* Coefficients */}
      <div className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-6 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 mb-4">Формула расчёта</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] text-neutral-500 block mb-1.5">Коэфф. площади (за м²)</label>
            <input
              type="number"
              step="0.001"
              value={config.coefficients.area_coeff}
              onChange={(e) => updateCoeff("area_coeff", parseFloat(e.target.value) || 0)}
              className="w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white focus-visible:outline-none focus:border-white/25"
            />
          </div>
          <div>
            <label className="text-[11px] text-neutral-500 block mb-1.5">Порог (м²)</label>
            <input
              type="number"
              value={config.coefficients.area_threshold}
              onChange={(e) => updateCoeff("area_threshold", parseInt(e.target.value) || 0)}
              className="w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white focus-visible:outline-none focus:border-white/25"
            />
          </div>
          <div>
            <label className="text-[11px] text-neutral-500 block mb-1.5">Множитель срочности</label>
            <input
              type="number"
              step="0.1"
              value={config.coefficients.urgent_mult}
              onChange={(e) => updateCoeff("urgent_mult", parseFloat(e.target.value) || 1)}
              className="w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white focus-visible:outline-none focus:border-white/25"
            />
          </div>
        </div>
        <p className="text-[11px] text-neutral-600 mt-3">
          Итого = базовая_цена × (1 + (площадь − порог) × коэфф) × множитель_срочности + допуслуги
        </p>
      </div>

      {/* Services */}
      <div className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400">Основные услуги</h2>
          <button onClick={addService} className="flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> Добавить
          </button>
        </div>
        <div className="space-y-3">
          {config.services.map((s, idx) => (
            <div key={s.id} className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 px-4 py-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <input
                  type="text"
                  value={s.label_ru}
                  onChange={(e) => updateService(idx, "label_ru", e.target.value)}
                  className="flex-1 bg-transparent border-b border-white/10 text-sm text-white focus-visible:outline-none focus:border-white/30 py-1"
                  placeholder="Название (РУ)"
                />
                <input
                  type="text"
                  value={s.label_en}
                  onChange={(e) => updateService(idx, "label_en", e.target.value)}
                  className="flex-1 bg-transparent border-b border-white/10 text-sm text-white focus-visible:outline-none focus:border-white/30 py-1"
                  placeholder="Label (EN)"
                />
                <div className="flex items-center justify-between sm:justify-start gap-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={s.base_price}
                      onChange={(e) => updateService(idx, "base_price", parseInt(e.target.value) || 0)}
                      className="w-24 bg-white/[0.04] border border-white/10 px-2 py-1.5 text-sm text-white text-right focus-visible:outline-none focus:border-white/25"
                    />
                    <span className="text-[11px] text-neutral-600">₽</span>
                  </div>
                  <button onClick={() => removeService(idx)} className="text-neutral-700 hover:text-red-400 transition-colors cursor-pointer p-1">
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extras */}
      <div className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400">Дополнительные услуги</h2>
          <button onClick={addExtra} className="flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> Добавить
          </button>
        </div>
        <div className="space-y-3">
          {config.extras.map((e, idx) => (
            <div key={e.id} className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 px-4 py-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <input
                  type="text"
                  value={e.label_ru}
                  onChange={(ev) => updateExtra(idx, "label_ru", ev.target.value)}
                  className="flex-1 bg-transparent border-b border-white/10 text-sm text-white focus-visible:outline-none focus:border-white/30 py-1"
                  placeholder="Название (РУ)"
                />
                <input
                  type="text"
                  value={e.label_en}
                  onChange={(ev) => updateExtra(idx, "label_en", ev.target.value)}
                  className="flex-1 bg-transparent border-b border-white/10 text-sm text-white focus-visible:outline-none focus:border-white/30 py-1"
                  placeholder="Label (EN)"
                />
                <div className="flex items-center justify-between sm:justify-start gap-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={e.price}
                      onChange={(ev) => updateExtra(idx, "price", parseInt(ev.target.value) || 0)}
                      className="w-24 bg-white/[0.04] border border-white/10 px-2 py-1.5 text-sm text-white text-right focus-visible:outline-none focus:border-white/25"
                    />
                    <span className="text-[11px] text-neutral-600">₽</span>
                  </div>
                  <button onClick={() => removeExtra(idx)} className="text-neutral-700 hover:text-red-400 transition-colors cursor-pointer p-1">
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
