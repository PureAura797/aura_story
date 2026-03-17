"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Check, AlertCircle, Film, ImageIcon, Users, Briefcase, Wrench, Play } from "lucide-react";
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

const CATEGORY_META: Record<string, { label: string; icon: typeof Users; description: string }> = {
  team: { label: "Команда", icon: Users, description: "Аватары сотрудников (PNG, 800×800 рек.)" },
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
  isVideo,
}: {
  file: MediaFile;
  dir: string;
  onUploadDone: () => void;
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
    <div className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-3 hover:border-white/10 transition-all group">
      {/* Preview */}
      <div className="relative w-full aspect-square bg-white/[0.02] mb-3 overflow-hidden flex items-center justify-center">
        {file.exists ? (
          isVideo ? (
            <div className="flex flex-col items-center gap-1.5 text-neutral-500">
              <Play className="w-8 h-8" strokeWidth={1} />
              <span className="text-[9px] uppercase tracking-wider">видео</span>
            </div>
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

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  const totalFiles = Object.values(data).reduce((acc, cat) => acc + cat.files.length, 0);
  const existingFiles = Object.values(data).reduce(
    (acc, cat) => acc + cat.files.filter((f) => f.exists).length,
    0
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Медиа</h1>
        <p className="text-xs text-neutral-500">
          Фото и видео контент сайта • {existingFiles}/{totalFiles} файлов загружено
        </p>
      </div>

      {/* Info */}
      <div className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-4 mb-6">
        <p className="text-[11px] text-neutral-400 leading-relaxed">
          Наведите на карточку и нажмите для загрузки нового файла. Файл заменит текущий.
          Изменение вступит в силу мгновенно — перезагрузите страницу сайта для проверки.
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
              <div className="flex items-center gap-2.5 mb-4">
                <meta.icon className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
                <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-300">{meta.label}</h2>
                <span className="text-[10px] text-neutral-600">
                  {category.files.filter((f) => f.exists).length}/{category.files.length}
                </span>
              </div>
              <p className="text-[10px] text-neutral-600 mb-3">{meta.description}</p>

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
                    isVideo={isVideo}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
