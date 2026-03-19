"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Check, AlertCircle, Film, ImageIcon, Briefcase, Wrench, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

interface MediaFile {
  name: string;
  exists: boolean;
  size: number;
  url: string;
}

interface MediaCategory {
  dir: string;
  files: MediaFile[];
}

type MediaData = Record<string, MediaCategory>;

const CATEGORY_META: Record<string, { label: string; icon: typeof ImageIcon; description: string }> = {
  stories_covers: { label: "Сторис — обложки", icon: ImageIcon, description: "Обложки сторис (PNG, 1080×1920 рек.)" },
  stories_videos: { label: "Сторис — видео", icon: Film, description: "Видео сторис (MP4, до 15 сек каждое)" },
  portfolio: { label: "Портфолио", icon: Briefcase, description: "До/После фото (PNG, 1200×800 рек.)" },
  equipment: { label: "Оборудование", icon: Wrench, description: "Фото оборудования (PNG, 800×600 рек.)" },
};

function formatSize(bytes: number): string {
  if (bytes === 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function SlotCard({
  file,
  dir,
  onUploadDone,
  onDelete,
  isVideo,
}: {
  file: MediaFile;
  dir: string;
  onUploadDone: () => void;
  onDelete: (dir: string, name: string) => void;
  isVideo: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("path", `${dir}/${file.name}`);

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setUploaded(true);
        setTimeout(() => {
          setUploaded(false);
          onUploadDone();
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Ошибка загрузки");
    }
    setUploading(false);
  };

  return (
    <div className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-3 hover:border-white/10 transition-all group relative">
      {/* Delete button */}
      <button
        onClick={() => { if (confirm(`Удалить ${file.name}?`)) onDelete(dir, file.name); }}
        className="absolute top-1.5 right-1.5 p-1 bg-black/60 border border-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer hover:border-red-500/30"
      >
        <Trash2 className="w-3 h-3 text-red-400" strokeWidth={1.5} />
      </button>

      {/* Preview */}
      <div className="relative w-full aspect-square bg-white/[0.02] mb-3 overflow-hidden flex items-center justify-center">
        {file.exists ? (
          isVideo ? (
            <video
              src={file.url}
              className="w-full h-full object-cover"
              muted
              preload="metadata"
              onLoadedMetadata={(e) => {
                const video = e.currentTarget;
                video.currentTime = 0.5;
              }}
            />
          ) : (
            <Image
              src={`${file.url}?t=${Date.now()}`}
              alt={file.name}
              fill
              className="object-cover"
              unoptimized
            />
          )
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-neutral-700">
            <ImageIcon className="w-6 h-6" strokeWidth={1} />
            <span className="text-[9px]">нет файла</span>
          </div>
        )}

        {/* Upload overlay */}
        <div
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : uploaded ? (
            <Check className="w-5 h-5 text-green-400" strokeWidth={2} />
          ) : (
            <Upload className="w-5 h-5 text-white/70" strokeWidth={1.5} />
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-neutral-400 font-mono truncate">{file.name}</span>
        <span className="text-[9px] text-neutral-600">{formatSize(file.size)}</span>
      </div>

      {error && (
        <div className="flex items-center gap-1 mt-1.5 text-red-400 text-[10px]">
          <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
          {error}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={isVideo ? "video/mp4,video/*" : "image/png,image/jpeg,image/webp,image/*"}
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}

export default function MediaManager() {
  const [data, setData] = useState<MediaData | null>(null);
  const [loading, setLoading] = useState(true);
  const addInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const loadMedia = async () => {
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) setData(await res.json());
    } catch {
      console.error("Failed to load media");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleDelete = async (dir: string, name: string) => {
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: `${dir}/${name}` }),
      });
      if (res.ok) loadMedia();
    } catch {
      console.error("Failed to delete");
    }
  };

  const handleAddFile = async (category: string, dir: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", `${dir}/${file.name}`);
    try {
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      if (res.ok) loadMedia();
    } catch {
      console.error("Failed to upload");
    }
  };

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border border-white/[0.08]" />
          <div className="absolute inset-0 border border-white/[0.08] animate-ping" style={{ animationDuration: "1.5s" }} />
          <div className="absolute inset-[6px] border border-white/[0.12]" />
          <div className="absolute inset-[6px] border border-white/[0.12] animate-ping" style={{ animationDuration: "1.5s", animationDelay: "0.3s" }} />
          <div className="absolute inset-[12px] bg-[var(--accent)] opacity-40 animate-pulse" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-600 font-medium animate-pulse">Загрузка медиа</p>
      </div>
    );
  }

  const totalFiles = Object.values(data).reduce((acc, cat) => acc + cat.files.length, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Медиа</h1>
        <p className="text-xs text-neutral-500">
          Фото и видео контент сайта • {totalFiles} файлов
        </p>
      </div>

      {/* Info */}
      <div className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-4 mb-6">
        <p className="text-[11px] text-neutral-400 leading-relaxed">
          Наведите на карточку для замены файла. Используйте «+» для добавления и 🗑 для удаления.
          Фото команды управляются в разделе «Команда».
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-8">
        {Object.entries(CATEGORY_META).map(([key, meta]) => {
          const category = data[key];
          if (!category) return null;
          const isVideo = key === "stories_videos";

          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <meta.icon className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
                  <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-300">{meta.label}</h2>
                  <span className="text-[10px] text-neutral-600">
                    {category.files.length}
                  </span>
                </div>
                <button
                  onClick={() => addInputRefs.current[key]?.click()}
                  className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider border border-white/10 px-3 py-1.5 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" strokeWidth={1.5} /> Добавить
                </button>
                <input
                  ref={(el) => { addInputRefs.current[key] = el; }}
                  type="file"
                  accept={isVideo ? "video/mp4,video/*" : "image/png,image/jpeg,image/webp,image/*"}
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files) return;
                    Array.from(files).forEach((f) => handleAddFile(key, category.dir, f));
                    e.target.value = "";
                  }}
                />
              </div>
              <p className="text-[10px] text-neutral-600 mb-3">{meta.description}</p>

              {category.files.length === 0 ? (
                <div className="border border-dashed border-white/[0.06] p-8 text-center">
                  <p className="text-[11px] text-neutral-600">Нет файлов — нажмите «+ Добавить»</p>
                </div>
              ) : (
                <div
                  className={`grid gap-3 ${
                    isVideo ? "grid-cols-4 sm:grid-cols-6 md:grid-cols-8" : "grid-cols-3 sm:grid-cols-4 md:grid-cols-6"
                  }`}
                >
                  {category.files.map((file) => (
                    <SlotCard
                      key={file.name}
                      file={file}
                      dir={category.dir}
                      onUploadDone={loadMedia}
                      onDelete={handleDelete}
                      isVideo={isVideo}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
