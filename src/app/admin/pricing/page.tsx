"use client";

import { useState, useEffect } from "react";
import { Save, Check, Plus, Trash2, Eye, EyeOff } from "lucide-react";

interface PricingItem {
  id: string;
  name: string;
  area: string;
  price: number;
  description: string;
  features: string;
  published: boolean;
  sort_order: number;
}

export default function PricingAdmin() {
  const [items, setItems] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/pricing");
      if (res.ok) setItems(await res.json());
    } catch { console.error("Failed to load"); }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const sorted = items.map((item, i) => ({ ...item, sort_order: i }));
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_all", items: sorted }),
      });
      if (res.ok) { setSaved(true); setItems(sorted); setTimeout(() => setSaved(false), 2000); }
    } catch { alert("Ошибка сохранения"); }
    setSaving(false);
  };

  const addItem = () => {
    setItems([...items, {
      id: Date.now().toString(),
      name: "",
      area: "",
      price: 0,
      description: "",
      features: "",
      published: true,
      sort_order: items.length,
    }]);
  };

  const updateItem = (id: string, field: keyof PricingItem, value: string | number | boolean) => {
    setItems(items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const deleteItem = (id: string) => {
    if (confirm("Удалить?")) setItems(items.filter((item) => item.id !== id));
  };

  const moveItem = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= items.length) return;
    const copy = [...items];
    [copy[idx], copy[next]] = [copy[next], copy[idx]];
    setItems(copy);
  };

  if (loading) return <div className="text-neutral-500 text-sm p-8">Загрузка…</div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Тарифы</h1>
          <p className="text-xs text-neutral-500">Карточки цен на главной странице</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {saved ? <Check className="w-3.5 h-3.5" strokeWidth={2} /> : <Save className="w-3.5 h-3.5" strokeWidth={1.5} />}
          {saved ? "Сохранено" : saving ? "Сохраняю…" : "Сохранить"}
        </button>
      </div>

      <div className="space-y-3">
        {items.sort((a, b) => a.sort_order - b.sort_order).map((item, idx) => (
          <div key={item.id} className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveItem(idx, -1)} className="text-neutral-600 hover:text-white text-[10px] cursor-pointer">▲</button>
                <button onClick={() => moveItem(idx, 1)} className="text-neutral-600 hover:text-white text-[10px] cursor-pointer">▼</button>
              </div>
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(item.id, "name", e.target.value)}
                placeholder="Название тарифа"
                className="flex-1 bg-transparent border-b border-white/10 text-sm font-bold focus:border-white/30 outline-none pb-1 transition-colors"
              />
              <button onClick={() => updateItem(item.id, "published", !item.published)} className="cursor-pointer p-1">
                {item.published
                  ? <Eye className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
                  : <EyeOff className="w-4 h-4 text-neutral-600" strokeWidth={1.5} />}
              </button>
              <button onClick={() => deleteItem(item.id)} className="cursor-pointer p-1">
                <Trash2 className="w-4 h-4 text-neutral-600 hover:text-red-400 transition-colors" strokeWidth={1.5} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[10px] text-neutral-600 uppercase tracking-wider mb-1 block">Цена (₽)</label>
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, "price", parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent border border-white/[0.06] text-sm p-2.5 focus:border-white/20 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-600 uppercase tracking-wider mb-1 block">Площадь</label>
                <input
                  type="text"
                  value={item.area}
                  onChange={(e) => updateItem(item.id, "area", e.target.value)}
                  placeholder="до 120 кв.м"
                  className="w-full bg-transparent border border-white/[0.06] text-sm p-2.5 focus:border-white/20 outline-none transition-colors"
                />
              </div>
            </div>

            <textarea
              value={item.description}
              onChange={(e) => updateItem(item.id, "description", e.target.value)}
              placeholder="Описание"
              rows={2}
              className="w-full bg-transparent border border-white/[0.06] text-xs text-neutral-400 p-3 mb-3 focus:border-white/20 outline-none resize-none transition-colors"
            />

            <input
              type="text"
              value={item.features}
              onChange={(e) => updateItem(item.id, "features", e.target.value)}
              placeholder="Фичи через · (Выезд 60 мин · Хим. дезинфекция · Озонация)"
              className="w-full bg-transparent border border-white/[0.06] text-[11px] text-neutral-500 p-2.5 focus:border-white/20 outline-none transition-colors"
            />
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="w-full mt-3 flex items-center justify-center gap-2 py-3 border border-dashed border-white/10 text-xs text-neutral-500 hover:border-white/20 hover:text-neutral-300 transition-all cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
        Добавить тариф
      </button>
    </div>
  );
}
