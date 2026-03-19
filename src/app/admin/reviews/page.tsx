"use client";

import { useState, useEffect } from "react";
import { Save, Check, Plus, Trash2, Star, Eye, EyeOff } from "lucide-react";

interface Review {
  id: string;
  author: string;
  service: string;
  text: string;
  date_label: string;
  rating: number;
  published: boolean;
  sort_order: number;
}

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) setReviews(await res.json());
    } catch {
      console.error("Failed to load reviews");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_all", reviews }),
      });
      if (res.ok) {
        setSaved(true);
        setEditingId(null);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      alert("Ошибка сохранения");
    }
    setSaving(false);
  };

  const addReview = () => {
    const newReview: Review = {
      id: Date.now().toString(),
      author: "",
      service: "",
      text: "",
      date_label: new Date().toLocaleDateString("ru-RU", { month: "long", year: "numeric" }),
      rating: 5,
      published: true,
      sort_order: reviews.length,
    };
    setReviews([...reviews, newReview]);
    setEditingId(newReview.id);
  };

  const removeReview = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const updateReview = (id: string, field: keyof Review, value: string | number | boolean) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const togglePublished = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, published: !r.published } : r)));
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Отзывы</h1>
          <p className="text-xs text-neutral-500">{reviews.length} отзывов • {reviews.filter((r) => r.published).length} опубликовано</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={addReview}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border border-white/10 text-neutral-300 hover:bg-white/[0.04] hover:border-white/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> Добавить
          </button>
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
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {reviews.map((review) => {
          const isEditing = editingId === review.id;

          return (
            <div
              key={review.id}
              className={`border bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-5 transition-all ${
                isEditing ? "border-white/20" : "border-white/[0.06]"
              } ${!review.published ? "opacity-50" : ""}`}
            >
              {isEditing ? (
                /* Edit mode */
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-neutral-500 block mb-1">Автор</label>
                      <input
                        type="text"
                        value={review.author}
                        onChange={(e) => updateReview(review.id, "author", e.target.value)}
                        placeholder="Имя или организация"
                        className="w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white focus-visible:outline-none focus:border-white/25"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-neutral-500 block mb-1">Услуга</label>
                      <input
                        type="text"
                        value={review.service}
                        onChange={(e) => updateReview(review.id, "service", e.target.value)}
                        placeholder="Название услуги"
                        className="w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white focus-visible:outline-none focus:border-white/25"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-neutral-500 block mb-1">Дата</label>
                      <input
                        type="text"
                        value={review.date_label}
                        onChange={(e) => updateReview(review.id, "date_label", e.target.value)}
                        placeholder="Февраль 2026"
                        className="w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white focus-visible:outline-none focus:border-white/25"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-500 block mb-1">Текст отзыва</label>
                    <textarea
                      value={review.text}
                      onChange={(e) => updateReview(review.id, "text", e.target.value)}
                      rows={3}
                      placeholder="Текст отзыва клиента..."
                      className="w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white focus-visible:outline-none focus:border-white/25 resize-y"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => updateReview(review.id, "rating", star)}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${star <= review.rating ? "fill-current text-amber-400" : "text-neutral-700"}`}
                            strokeWidth={1.5}
                          />
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-[11px] text-neutral-500 hover:text-white transition-colors cursor-pointer"
                    >
                      Готово
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setEditingId(review.id)}>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                      <span className="text-sm font-bold text-white">{review.author || "Без имени"}</span>
                      <span className="text-[11px] uppercase tracking-wider" style={{ color: "var(--accent, #5eead4)" }}>
                        {review.service}
                      </span>
                      <span className="text-[11px] text-neutral-600">{review.date_label}</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                      {review.text || "Нажмите для редактирования..."}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => togglePublished(review.id)}
                      className={`p-1.5 transition-colors cursor-pointer ${
                        review.published ? "text-green-400 hover:text-green-300" : "text-neutral-600 hover:text-neutral-400"
                      }`}
                      title={review.published ? "Опубликован" : "Скрыт"}
                    >
                      {review.published ? <Eye className="w-3.5 h-3.5" strokeWidth={1.5} /> : <EyeOff className="w-3.5 h-3.5" strokeWidth={1.5} />}
                    </button>
                    <button
                      onClick={() => { if (confirm("Удалить отзыв?")) removeReview(review.id); }}
                      className="p-1.5 text-neutral-700 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-16">
          <p className="text-neutral-600 text-sm mb-4">Нет отзывов</p>
          <button
            onClick={addReview}
            className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            + Добавить первый отзыв
          </button>
        </div>
      )}
    </div>
  );
}
