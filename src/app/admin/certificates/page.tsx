"use client";

import { useState, useEffect } from "react";
import { Save, Check, Plus, Trash2, Eye, EyeOff, Download } from "lucide-react";
import AdminLoader from "../AdminLoader";

interface CertificateItem {
  id: string;
  title: string;
  number: string;
  date: string;
  description: string;
  preview_url: string;
  download_url: string;
  published: boolean;
  sort_order: number;
}

export default function CertificatesAdmin() {
  const [items, setItems] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/certificates");
      if (res.ok) setItems(await res.json());
    } catch { console.error("Failed to load"); }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const sorted = items.map((item, i) => ({ ...item, sort_order: i }));
      const res = await fetch("/api/admin/certificates", {
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
      number: "",
      date: "",
      description: "",
      preview_url: "",
      download_url: "",
      published: true,
      sort_order: items.length,
    }]);
  };

  const updateItem = (id: string, field: keyof CertificateItem, value: string | boolean) => {
    setItems(items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const deleteItem = (id: string) => {
    if (confirm("Удалить?")) setItems(items.filter((item) => item.id !== id));
  };

  if (loading) return <AdminLoader label="Загрузка сертификатов" />;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Сертификаты</h1>
          <p className="text-xs text-neutral-500">Лицензии и сертификаты на главной странице</p>
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
        {items.sort((a, b) => a.sort_order - b.sort_order).map((item) => (
          <div key={item.id} className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-5">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(item.id, "title", e.target.value)}
                placeholder="Название (Лицензия на мед. деятельность)"
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
                <label className="text-[10px] text-neutral-600 uppercase tracking-wider mb-1 block">Номер</label>
                <input
                  type="text"
                  value={item.number}
                  onChange={(e) => updateItem(item.id, "number", e.target.value)}
                  placeholder="77.01.13.003.Л.000022.02.26"
                  className="w-full bg-transparent border border-white/[0.06] text-sm p-2.5 focus:border-white/20 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-600 uppercase tracking-wider mb-1 block">Дата выдачи</label>
                <input
                  type="text"
                  value={item.date}
                  onChange={(e) => updateItem(item.id, "date", e.target.value)}
                  placeholder="24.02.2026"
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-neutral-600 uppercase tracking-wider mb-1 block">URL превью (PNG)</label>
                <input
                  type="text"
                  value={item.preview_url}
                  onChange={(e) => updateItem(item.id, "preview_url", e.target.value)}
                  placeholder="/certificates/license-preview.png"
                  className="w-full bg-transparent border border-white/[0.06] text-[11px] text-neutral-500 p-2.5 focus:border-white/20 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-600 uppercase tracking-wider mb-1 block">URL скачивания (PDF)</label>
                <input
                  type="text"
                  value={item.download_url}
                  onChange={(e) => updateItem(item.id, "download_url", e.target.value)}
                  placeholder="/certificates/license.pdf"
                  className="w-full bg-transparent border border-white/[0.06] text-[11px] text-neutral-500 p-2.5 focus:border-white/20 outline-none transition-colors"
                />
              </div>
            </div>

            {item.preview_url && (
              <div className="mt-3 border border-white/[0.06] p-2">
                <img src={item.preview_url} alt={item.title} className="w-full max-h-40 object-contain opacity-70" />
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="w-full mt-3 flex items-center justify-center gap-2 py-3 border border-dashed border-white/10 text-xs text-neutral-500 hover:border-white/20 hover:text-neutral-300 transition-all cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
        Добавить сертификат
      </button>
    </div>
  );
}
