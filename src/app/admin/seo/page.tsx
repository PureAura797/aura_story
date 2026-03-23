"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Check, AlertCircle, Save } from "lucide-react";
import Image from "next/image";
import AdminLoader from "../AdminLoader";

interface SeoSettings {
  title: string;
  description: string;
  ogImage: string;
  favicon: string;
  yandexVerification: string;
  googleVerification: string;
}

export default function SeoAdmin() {
  const [seo, setSeo] = useState<SeoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const ogRef = useRef<HTMLInputElement>(null);
  const favRef = useRef<HTMLInputElement>(null);
  const [ogUploading, setOgUploading] = useState(false);
  const [favUploading, setFavUploading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/seo")
      .then((r) => r.json())
      .then((data) => { setSeo(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!seo) return;
    setSaving(true);
    await fetch("/api/admin/seo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(seo) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const uploadFile = async (file: File, path: string, setter: (v: string) => void, setUploading: (v: boolean) => void) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);
    const res = await fetch("/api/admin/media", { method: "POST", body: formData });
    if (res.ok) {
      setter(`/${path}?t=${Date.now()}`);
    }
    setUploading(false);
  };

  if (loading || !seo) return <AdminLoader />;

  const titleLen = seo.title.length;
  const descLen = seo.description.length;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">SEO</h1>
          <p className="text-xs text-neutral-500">Мета-теги, Open Graph, фавикон</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {saved ? <Check className="w-3.5 h-3.5" strokeWidth={2} /> : <Save className="w-3.5 h-3.5" strokeWidth={1.5} />}
          {saved ? "Сохранено" : saving ? "Сохраняю..." : "Сохранить"}
        </button>
      </div>

      {/* Title */}
      <div className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5 mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold">Title</label>
          <span className={`text-[11px] font-mono ${titleLen > 70 ? "text-red-400" : titleLen > 60 ? "text-yellow-400" : "text-neutral-600"}`}>
            {titleLen}/70
          </span>
        </div>
        <input
          type="text"
          value={seo.title}
          onChange={(e) => setSeo({ ...seo, title: e.target.value })}
          className="w-full bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white focus:border-white/20 focus-visible:outline-none transition-colors"
          placeholder="Не более 70 символов, без бренда"
        />
        {titleLen > 70 && (
          <div className="flex items-center gap-1 mt-2 text-red-400 text-[11px]">
            <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
            Превышен лимит символов — поисковик обрежет
          </div>
        )}
        <p className="text-[11px] text-neutral-600 mt-2">Заголовок страницы в поисковой выдаче. Без бренда, максимум ключевых слов.</p>
      </div>

      {/* Description */}
      <div className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5 mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold">Description</label>
          <span className={`text-[11px] font-mono ${descLen > 320 ? "text-red-400" : descLen > 280 ? "text-yellow-400" : "text-neutral-600"}`}>
            {descLen}/320
          </span>
        </div>
        <textarea
          value={seo.description}
          onChange={(e) => setSeo({ ...seo, description: e.target.value })}
          rows={4}
          className="w-full bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white focus:border-white/20 focus-visible:outline-none transition-colors resize-none"
          placeholder="Не более 320 символов, без бренда"
        />
        {descLen > 320 && (
          <div className="flex items-center gap-1 mt-2 text-red-400 text-[11px]">
            <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
            Превышен лимит символов
          </div>
        )}
        <p className="text-[11px] text-neutral-600 mt-2">Описание страницы в поисковой выдаче. Без бренда, максимум ключевых слов.</p>
      </div>

      {/* OG Image */}
      <div className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5 mb-4">
        <label className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold block mb-3">OG Image</label>
        <p className="text-[11px] text-neutral-600 mb-3">Превью при шаринге ссылки в соцсетях и мессенджерах. Рекомендуемый размер: 1200×630 px.</p>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div
            className="relative w-48 h-24 bg-white/[0.04] border border-white/[0.08] overflow-hidden cursor-pointer group shrink-0"
            onClick={() => ogRef.current?.click()}
          >
            {seo.ogImage ? (
              <Image src={seo.ogImage} alt="OG Image" fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-700"><Upload className="w-5 h-5" strokeWidth={1} /></div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              {ogUploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-4 h-4 text-white/70" strokeWidth={1.5} />}
            </div>
          </div>
          <input
            type="text"
            value={seo.ogImage}
            onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
            className="flex-1 bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-xs text-neutral-400 font-mono focus:border-white/20 focus-visible:outline-none"
            placeholder="/og-image.png"
          />
        </div>
        <input ref={ogRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadFile(f, "og-image.png", (v) => setSeo({ ...seo, ogImage: v }), setOgUploading);
        }} />
      </div>

      {/* Favicon */}
      <div className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5 mb-4">
        <label className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold block mb-3">Фавикон</label>
        <p className="text-[11px] text-neutral-600 mb-3">Иконка во вкладке браузера. Рекомендуемый формат: .ico или .png 32×32.</p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div
            className="relative w-12 h-12 bg-white/[0.04] border border-white/[0.08] overflow-hidden cursor-pointer group shrink-0"
            onClick={() => favRef.current?.click()}
          >
            {seo.favicon ? (
              <Image src={seo.favicon} alt="Favicon" fill className="object-contain p-1" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-700"><Upload className="w-4 h-4" strokeWidth={1} /></div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              {favUploading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-3 h-3 text-white/70" strokeWidth={1.5} />}
            </div>
          </div>
          <input
            type="text"
            value={seo.favicon}
            onChange={(e) => setSeo({ ...seo, favicon: e.target.value })}
            className="flex-1 bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-xs text-neutral-400 font-mono focus:border-white/20 focus-visible:outline-none"
            placeholder="/favicon.ico"
          />
        </div>
        <input ref={favRef} type="file" accept="image/x-icon,image/png,image/svg+xml" className="hidden" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadFile(f, "favicon.ico", (v) => setSeo({ ...seo, favicon: v }), setFavUploading);
        }} />
      </div>

      {/* Webmaster Verification */}
      <div className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5 mb-4">
        <label className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold block mb-3">Верификация в поисковиках</label>
        <p className="text-[11px] text-neutral-600 mb-4">Коды подтверждения владения сайтом из Яндекс.Вебмастер и Google Search Console. Вставляются как мета-теги в &lt;head&gt;.</p>
        
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <label className="text-xs text-neutral-300">Яндекс.Вебмастер</label>
            </div>
            <input
              type="text"
              value={seo.yandexVerification || ""}
              onChange={(e) => setSeo({ ...seo, yandexVerification: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-white/20 focus-visible:outline-none transition-colors font-mono text-xs"
              placeholder="abc123def456"
            />
            <p className="text-[11px] text-neutral-600 mt-1">Код из <a href="https://webmaster.yandex.ru" target="_blank" rel="noopener" className="text-red-400/60 hover:text-red-400 underline">webmaster.yandex.ru</a> → Права доступа → HTML-тег → значение content</p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <label className="text-xs text-neutral-300">Google Search Console</label>
            </div>
            <input
              type="text"
              value={seo.googleVerification || ""}
              onChange={(e) => setSeo({ ...seo, googleVerification: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-white/20 focus-visible:outline-none transition-colors font-mono text-xs"
              placeholder="xyz789abc012"
            />
            <p className="text-[11px] text-neutral-600 mt-1">Код из <a href="https://search.google.com/search-console" target="_blank" rel="noopener" className="text-blue-400/60 hover:text-blue-400 underline">Search Console</a> → Настройки → Подтверждение → Тег HTML → значение content</p>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5">
        <label className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold block mb-3">Превью в поисковой выдаче</label>
        <div className="bg-white/[0.04] border border-white/[0.06] p-4">
          <p className="text-[13px] text-[#8ab4f8] truncate mb-0.5">{seo.title || "Заголовок не указан"}</p>
          <p className="text-[11px] text-green-400/70 mb-1 font-mono">pureaura.ru</p>
          <p className="text-[11px] text-neutral-500 line-clamp-2">{seo.description || "Описание не указано"}</p>
        </div>
      </div>
    </div>
  );
}
