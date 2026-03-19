"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Upload, Check } from "lucide-react";
import Image from "next/image";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: string;
  experience: string;
  objects: string;
  specialization: string;
  avatar: string;
  color: string;
  published: boolean;
  sort_order: number;
}

export default function TeamAdmin() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/team");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/admin/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "save_all", items }) });
    setSaving(false);
    setDirty(false);
  };

  const add = async () => {
    const res = await fetch("/api/admin/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "add" }) });
    if (res.ok) { setItems(await res.json()); setDirty(false); }
  };

  const remove = async (id: string) => {
    const res = await fetch("/api/admin/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", id }) });
    if (res.ok) { setItems(await res.json()); setDirty(false); }
  };

  const update = (id: string, field: keyof TeamMember, value: string | boolean | number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
    setDirty(true);
  };

  const move = (idx: number, dir: -1 | 1) => {
    const arr = [...items];
    const t = idx + dir;
    if (t < 0 || t >= arr.length) return;
    [arr[idx], arr[t]] = [arr[t], arr[idx]];
    arr.forEach((item, i) => (item.sort_order = i));
    setItems(arr);
    setDirty(true);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Команда</h1>
          <p className="text-xs text-neutral-500">{items.length} сотрудников</p>
        </div>
        <div className="flex gap-2">
          <button onClick={add} className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider border border-white/10 px-4 py-2 hover:bg-white/5 transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5" strokeWidth={1.5} /> Добавить
          </button>
          {dirty && (
            <button onClick={save} disabled={saving} className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider bg-[var(--accent)] text-black px-4 py-2 hover:opacity-90 transition-opacity cursor-pointer">
              {saving ? "Сохраняю..." : "Сохранить"}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {items.map((member, idx) => (
          <MemberCard key={member.id} member={member} idx={idx} total={items.length} update={update} move={move} remove={remove} />
        ))}
      </div>
    </div>
  );
}

function MemberCard({ member, idx, total, update, move, remove }: {
  member: TeamMember;
  idx: number;
  total: number;
  update: (id: string, field: keyof TeamMember, value: string | boolean | number) => void;
  move: (idx: number, dir: -1 | 1) => void;
  remove: (id: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", `team/member-${member.id}.webp`);

    const res = await fetch("/api/admin/media", { method: "POST", body: formData });
    if (res.ok) {
      update(member.id, "avatar", `/team/member-${member.id}.webp?t=${Date.now()}`);
      setUploaded(true);
      setTimeout(() => setUploaded(false), 1500);
    }
    setUploading(false);
  };

  return (
    <div className={`border bg-white/[0.02] backdrop-blur-sm p-5 transition-all ${member.published ? "border-white/[0.06]" : "border-white/[0.03] opacity-60"}`}>
      <div className="flex gap-5">
        {/* Avatar */}
        <div className="shrink-0">
          <div
            className="relative w-20 h-20 bg-white/[0.04] overflow-hidden cursor-pointer group"
            onClick={() => fileRef.current?.click()}
          >
            {member.avatar ? (
              <Image src={member.avatar} alt={member.name} fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-700">
                <Upload className="w-5 h-5" strokeWidth={1} />
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              {uploading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : uploaded ? (
                <Check className="w-4 h-4 text-green-400" strokeWidth={2} />
              ) : (
                <Upload className="w-4 h-4 text-white/70" strokeWidth={1.5} />
              )}
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
        </div>

        {/* Fields */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 min-w-0">
          <Field label="Имя" value={member.name} onChange={(v) => update(member.id, "name", v)} />
          <Field label="Должность" value={member.role} onChange={(v) => update(member.id, "role", v)} />
          <Field label="Статус" value={member.status} onChange={(v) => update(member.id, "status", v)} />
          <Field label="Опыт" value={member.experience} onChange={(v) => update(member.id, "experience", v)} />
          <Field label="Объектов" value={member.objects} onChange={(v) => update(member.id, "objects", v)} />
          <Field label="Специализация" value={member.specialization} onChange={(v) => update(member.id, "specialization", v)} />
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-[11px] uppercase tracking-wider text-neutral-600 block mb-1">Акцент</label>
              <div className="flex items-center gap-2">
                <input type="color" value={member.color} onChange={(e) => update(member.id, "color", e.target.value)} className="w-8 h-8 bg-transparent border border-white/10 cursor-pointer" />
                <span className="text-[11px] text-neutral-500 font-mono">{member.color}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <button onClick={() => update(member.id, "published", !member.published)} className="p-1.5 border border-white/[0.06] hover:bg-white/5 transition-colors cursor-pointer" title={member.published ? "Скрыть" : "Показать"}>
            {member.published ? <Eye className="w-3.5 h-3.5 text-green-400" strokeWidth={1.5} /> : <EyeOff className="w-3.5 h-3.5 text-neutral-600" strokeWidth={1.5} />}
          </button>
          <button onClick={() => move(idx, -1)} disabled={idx === 0} className="p-1.5 border border-white/[0.06] hover:bg-white/5 transition-colors disabled:opacity-20 cursor-pointer">
            <ArrowUp className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
          <button onClick={() => move(idx, 1)} disabled={idx === total - 1} className="p-1.5 border border-white/[0.06] hover:bg-white/5 transition-colors disabled:opacity-20 cursor-pointer">
            <ArrowDown className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
          <button onClick={() => { if (confirm("Удалить сотрудника?")) remove(member.id); }} className="p-1.5 border border-red-900/30 hover:bg-red-950/30 transition-colors cursor-pointer">
            <Trash2 className="w-3.5 h-3.5 text-red-400" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-wider text-neutral-600 block mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.04] border border-white/[0.06] px-3 py-2 text-sm text-white focus:border-white/20 focus-visible:outline-none transition-colors"
      />
    </div>
  );
}
