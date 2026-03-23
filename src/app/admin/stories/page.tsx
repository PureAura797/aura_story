"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Check, Plus, Trash2, Eye, EyeOff, Upload, Film, ImageIcon, X } from "lucide-react";
import AdminLoader from "../AdminLoader";

interface StoryItem {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  cover: string;
  videos: string[];
  published: boolean;
  sort_order: number;
}

function FileUpload({
  label,
  value,
  accept,
  category,
  pathPrefix,
  fileName,
  onUpdate,
  preview,
}: {
  label: string;
  value: string;
  accept: string;
  category: string;
  pathPrefix: string;
  fileName: string;
  onUpdate: (url: string) => void;
  preview: "image" | "video";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || (preview === "video" ? "mp4" : "webp");
    const fullName = `${fileName}.${ext}`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", `${pathPrefix}/${fullName}`);
    formData.append("category", category);
    try {
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        onUpdate(data.url || `/${pathPrefix}/${fullName}`);
      } else { alert("Ошибка загрузки"); }
    } catch { alert("Сетевая ошибка"); }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label className="text-[11px] text-neutral-600 uppercase tracking-wider mb-1 block">{label}</label>
      <div className="flex gap-1.5 mb-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onUpdate(e.target.value)}
          placeholder={`/${pathPrefix}/...`}
          className="flex-1 bg-transparent border border-white/[0.06] text-[11px] text-neutral-400 p-2 focus:border-white/20 focus-visible:outline-none transition-colors font-mono min-w-0"
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 px-2.5 py-2 border border-white/[0.06] hover:border-white/20 transition-colors cursor-pointer flex items-center text-[11px] text-neutral-400 hover:text-white disabled:opacity-50"
        >
          {uploading ? <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-3 h-3" strokeWidth={1.5} />}
        </button>
      </div>
      {value && preview === "image" && (
        <div className="h-14 border border-white/[0.06] overflow-hidden">
          <img src={value} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      {value && preview === "video" && (
        <div className="text-[10px] font-mono text-neutral-600 truncate">{value.split("/").pop()}</div>
      )}
      <input ref={inputRef} type="file" accept={accept} onChange={handleUpload} className="hidden" />
    </div>
  );
}

export default function StoriesAdmin() {
  const [items, setItems] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/stories");
      if (res.ok) setItems(await res.json());
    } catch { console.error("Failed to load"); }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const sorted = items.map((item, i) => ({ ...item, sort_order: i }));
      const res = await fetch("/api/admin/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_all", items: sorted }),
      });
      if (res.ok) { setSaved(true); setItems(sorted); setTimeout(() => setSaved(false), 2000); }
    } catch { alert("Ошибка сохранения"); }
    setSaving(false);
  };

  const addItem = () => {
    const id = Date.now().toString();
    setItems([...items, {
      id,
      title: "",
      subtitle: "",
      color: "#5eead4",
      cover: "",
      videos: ["", "", "", ""],
      published: true,
      sort_order: items.length,
    }]);
  };

  const updateItem = (id: string, field: keyof StoryItem, value: string | boolean | string[]) => {
    setItems(items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const updateVideo = (id: string, idx: number, url: string) => {
    setItems(items.map((item) => {
      if (item.id !== id) return item;
      const videos = [...item.videos];
      videos[idx] = url;
      return { ...item, videos };
    }));
  };

  const deleteItem = (id: string) => {
    if (confirm("Удалить историю?")) setItems(items.filter((item) => item.id !== id));
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
          <h1 className="text-2xl font-bold tracking-tight mb-1">Сторис</h1>
          <p className="text-xs text-neutral-500">Видео-истории в круглых иконках на главной</p>
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

      <div className="space-y-4">
        {items.sort((a, b) => a.sort_order - b.sort_order).map((item, idx) => (
          <div key={item.id} className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-5">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveItem(idx, -1)} className="text-neutral-600 hover:text-white text-[11px] cursor-pointer p-2 min-w-[36px] min-h-[36px] flex items-center justify-center">▲</button>
                <button onClick={() => moveItem(idx, 1)} className="text-neutral-600 hover:text-white text-[11px] cursor-pointer p-2 min-w-[36px] min-h-[36px] flex items-center justify-center">▼</button>
              </div>
              <span className="text-[11px] font-mono text-neutral-600 w-6">{String(idx + 1).padStart(2, "0")}</span>
              <div className="w-5 h-5 rounded-full border border-white/10 shrink-0" style={{ background: item.color }} />
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(item.id, "title", e.target.value)}
                placeholder="Заголовок"
                className="flex-1 bg-transparent border-b border-white/10 text-sm font-bold focus:border-white/30 focus-visible:outline-none pb-1 transition-colors"
              />
              <button onClick={() => updateItem(item.id, "published", !item.published)} className="cursor-pointer p-1" title={item.published ? "Скрыть" : "Показать"}>
                {item.published ? <Eye className="w-4 h-4 text-emerald-400" strokeWidth={1.5} /> : <EyeOff className="w-4 h-4 text-neutral-600" strokeWidth={1.5} />}
              </button>
              <button onClick={() => deleteItem(item.id)} className="cursor-pointer p-1">
                <Trash2 className="w-4 h-4 text-neutral-600 hover:text-red-400 transition-colors" strokeWidth={1.5} />
              </button>
            </div>

            {/* Subtitle + Color */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                value={item.subtitle}
                onChange={(e) => updateItem(item.id, "subtitle", e.target.value)}
                placeholder="Подзаголовок"
                className="bg-transparent border border-white/[0.06] text-[11px] text-neutral-400 p-2.5 focus:border-white/20 focus-visible:outline-none transition-colors"
              />
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={item.color}
                  onChange={(e) => updateItem(item.id, "color", e.target.value)}
                  className="w-8 h-8 border border-white/[0.06] bg-transparent cursor-pointer rounded-sm"
                />
                <span className="text-[11px] font-mono text-neutral-600">{item.color}</span>
              </div>
            </div>

            {/* Cover */}
            <FileUpload
              label="Обложка"
              value={item.cover}
              accept="image/png,image/jpeg,image/webp"
              category="stories_covers"
              pathPrefix="stories/covers"
              fileName={`cover-${item.id}`}
              onUpdate={(url) => updateItem(item.id, "cover", url)}
              preview="image"
            />

            {/* Videos */}
            <div className="mt-3">
              <label className="text-[11px] text-neutral-600 uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                <Film className="w-3 h-3" strokeWidth={1.5} />
                Видео ({item.videos.filter(Boolean).length}/4)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((vi) => (
                  <FileUpload
                    key={vi}
                    label={`Видео ${vi + 1}`}
                    value={item.videos[vi] || ""}
                    accept="video/mp4,video/webm"
                    category="stories_videos"
                    pathPrefix="stories"
                    fileName={`story-${item.id}_${vi + 1}`}
                    onUpdate={(url) => updateVideo(item.id, vi, url)}
                    preview="video"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="w-full mt-3 flex items-center justify-center gap-2 py-3 border border-dashed border-white/10 text-xs text-neutral-500 hover:border-white/20 hover:text-neutral-300 transition-all cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
        Добавить историю
      </button>
    </div>
  );
}
