"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Check, Plus, Trash2, Eye, EyeOff, Upload } from "lucide-react";
import AdminLoader from "../AdminLoader";

interface PortfolioItem {
  id: string;
  type: string;
  area: string;
  time: string;
  description: string;
  beforeImg: string;
  afterImg: string;
  published: boolean;
  sort_order: number;
}

function ImageField({
  label,
  value,
  itemId,
  field,
  onUpdate,
}: {
  label: string;
  value: string;
  itemId: string;
  field: "beforeImg" | "afterImg";
  onUpdate: (id: string, field: keyof PortfolioItem, value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const suffix = field === "beforeImg" ? "before" : "after";
    const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
    const fileName = `${itemId}_${suffix}.${ext}`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", `images/portfolio/${fileName}`);
    formData.append("category", "portfolio");

    try {
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        onUpdate(itemId, field, data.url || `/images/portfolio/${fileName}`);
      } else {
        alert("Ошибка загрузки");
      }
    } catch {
      alert("Сетевая ошибка");
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label className="text-[11px] text-neutral-600 uppercase tracking-wider mb-1 block">{label}</label>
      <div className="flex gap-1.5 mb-1.5">
        <input
          type="text"
          value={value}
          onChange={(e) => onUpdate(itemId, field, e.target.value)}
          placeholder="/images/portfolio/..."
          className="flex-1 bg-transparent border border-white/[0.06] text-[11px] text-neutral-400 p-2.5 focus:border-white/20 focus-visible:outline-none transition-colors font-mono min-w-0"
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 px-3 py-2 border border-white/[0.06] hover:border-white/20 transition-colors cursor-pointer flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white disabled:opacity-50"
          title="Загрузить фото"
        >
          {uploading ? (
            <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Upload className="w-3 h-3" strokeWidth={1.5} />
          )}
        </button>
      </div>
      {value && (
        <div className="h-20 border border-white/[0.06] overflow-hidden">
          <img src={value} alt={label} className="w-full h-full object-cover" />
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}

export default function PortfolioAdmin() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/portfolio");
      if (res.ok) setItems(await res.json());
    } catch { console.error("Failed to load"); }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const sorted = items.map((item, i) => ({ ...item, sort_order: i }));
      const res = await fetch("/api/admin/portfolio", {
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
      type: "",
      area: "",
      time: "",
      description: "",
      beforeImg: "",
      afterImg: "",
      published: true,
      sort_order: items.length,
    }]);
  };

  const updateItem = (id: string, field: keyof PortfolioItem, value: string | boolean) => {
    setItems(items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const deleteItem = (id: string) => {
    if (confirm("Удалить кейс?")) setItems(items.filter((item) => item.id !== id));
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
          <h1 className="text-2xl font-bold tracking-tight mb-1">Портфолио</h1>
          <p className="text-xs text-neutral-500">Кейсы «До/После» на главной странице</p>
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
                value={item.type}
                onChange={(e) => updateItem(item.id, "type", e.target.value)}
                placeholder="Тип работ (напр. Уборка после ЧП)"
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
              <button onClick={() => deleteItem(item.id)} className="cursor-pointer p-1">
                <Trash2 className="w-4 h-4 text-neutral-600 hover:text-red-400 transition-colors" strokeWidth={1.5} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                value={item.area}
                onChange={(e) => updateItem(item.id, "area", e.target.value)}
                placeholder="Площадь (напр. 48 кв.м)"
                className="bg-transparent border border-white/[0.06] text-[11px] text-neutral-400 p-2.5 focus:border-white/20 focus-visible:outline-none transition-colors"
              />
              <input
                type="text"
                value={item.time}
                onChange={(e) => updateItem(item.id, "time", e.target.value)}
                placeholder="Срок (напр. 8 часов)"
                className="bg-transparent border border-white/[0.06] text-[11px] text-neutral-400 p-2.5 focus:border-white/20 focus-visible:outline-none transition-colors"
              />
            </div>

            <textarea
              value={item.description}
              onChange={(e) => updateItem(item.id, "description", e.target.value)}
              placeholder="Описание кейса"
              rows={2}
              className="w-full bg-transparent border border-white/[0.06] text-xs text-neutral-400 p-3 mb-3 focus:border-white/20 focus-visible:outline-none resize-none transition-colors"
            />

            <div className="grid grid-cols-2 gap-3">
              <ImageField label="Фото «До»" value={item.beforeImg} itemId={item.id} field="beforeImg" onUpdate={updateItem} />
              <ImageField label="Фото «После»" value={item.afterImg} itemId={item.id} field="afterImg" onUpdate={updateItem} />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="w-full mt-3 flex items-center justify-center gap-2 py-3 border border-dashed border-white/10 text-xs text-neutral-500 hover:border-white/20 hover:text-neutral-300 transition-all cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
        Добавить кейс
      </button>
    </div>
  );
}
