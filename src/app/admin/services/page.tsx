"use client";

import { useState, useEffect } from "react";
import { Save, Check, Plus, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import AdminLoader from "../AdminLoader";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  meta: string;
  published: boolean;
  sort_order: number;
}

export default function ServicesAdmin() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/services");
      if (res.ok) setItems(await res.json());
    } catch { console.error("Failed to load"); }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const sorted = items.map((item, i) => ({ ...item, sort_order: i }));
      const res = await fetch("/api/admin/services", {
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
      title: "",
      description: "",
      meta: "",
      published: true,
      sort_order: items.length,
    }]);
  };

  const updateItem = (id: string, field: keyof ServiceItem, value: string | boolean) => {
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

  if (loading) return <AdminLoader />;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Услуги</h1>
          <p className="text-xs text-neutral-500">Карточки направлений на главной странице</p>
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
                <button onClick={() => moveItem(idx, -1)} className="text-neutral-600 hover:text-white text-[11px] cursor-pointer p-2 min-w-[36px] min-h-[36px] flex items-center justify-center">▲</button>
                <button onClick={() => moveItem(idx, 1)} className="text-neutral-600 hover:text-white text-[11px] cursor-pointer p-2 min-w-[36px] min-h-[36px] flex items-center justify-center">▼</button>
              </div>
              <span className="text-[11px] font-mono text-neutral-600 w-6">{String(idx + 1).padStart(2, "0")}</span>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(item.id, "title", e.target.value)}
                placeholder="Название услуги"
                className="flex-1 bg-transparent border-b border-white/10 text-sm font-bold focus:border-white/30 focus-visible:outline-none pb-1 transition-colors"
              />
              <button
                onClick={() => updateItem(item.id, "published", !item.published)}
                className="cursor-pointer p-1"
                title={item.published ? "Скрыть" : "Опубликовать"}
              >
                {item.published
                  ? <Eye className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
                  : <EyeOff className="w-4 h-4 text-neutral-600" strokeWidth={1.5} />}
              </button>
              <button onClick={() => { if (confirm("Удалить?")) deleteItem(item.id); }} className="cursor-pointer p-1">
                <Trash2 className="w-4 h-4 text-neutral-600 hover:text-red-400 transition-colors" strokeWidth={1.5} />
              </button>
            </div>

            <textarea
              value={item.description}
              onChange={(e) => updateItem(item.id, "description", e.target.value)}
              placeholder="Описание"
              rows={2}
              className="w-full bg-transparent border border-white/[0.06] text-xs text-neutral-400 p-3 mb-3 focus:border-white/20 focus-visible:outline-none resize-none transition-colors"
            />

            <input
              type="text"
              value={item.meta}
              onChange={(e) => updateItem(item.id, "meta", e.target.value)}
              placeholder="от 60 мин · до 120 кв.м · от 15 000 ₽"
              className="w-full bg-transparent border border-white/[0.06] text-[11px] text-neutral-500 p-2.5 focus:border-white/20 focus-visible:outline-none transition-colors"
            />
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="w-full mt-3 flex items-center justify-center gap-2 py-3 border border-dashed border-white/10 text-xs text-neutral-500 hover:border-white/20 hover:text-neutral-300 transition-all cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
        Добавить услугу
      </button>
    </div>
  );
}
