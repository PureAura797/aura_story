"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, Send, MessageSquare, MapPin, Clock, Link2, Check, AlertCircle, Save } from "lucide-react";

interface ContactsData {
  phone: string;
  phoneDisplay: string;
  email: string;
  telegram: string;
  max: string;
  webhookUrl: string;
  address: string;
  workHours: string;
}

const FIELDS: {
  key: keyof ContactsData;
  label: string;
  icon: typeof Phone;
  placeholder: string;
  hint: string;
}[] = [
  { key: "phone", label: "Телефон (tel: формат)", icon: Phone, placeholder: "+74951203456", hint: "Для ссылок tel: — без пробелов и скобок" },
  { key: "phoneDisplay", label: "Телефон (отображение)", icon: Phone, placeholder: "8 495 120-34-56", hint: "Как телефон видит посетитель на сайте" },
  { key: "email", label: "Email", icon: Mail, placeholder: "help@auraremediation.com", hint: "Для ссылок mailto: и отображения" },
  { key: "telegram", label: "Telegram", icon: Send, placeholder: "https://t.me/pureaura", hint: "Ссылка на Telegram аккаунт/бот" },
  { key: "max", label: "MAX Мессенджер", icon: MessageSquare, placeholder: "https://max.ru/pureaura", hint: "Ссылка на MAX аккаунт" },
  { key: "webhookUrl", label: "Webhook заявок (n8n)", icon: Link2, placeholder: "https://n8n.example.com/webhook/...", hint: "URL куда уходят заявки с формы обратной связи" },
  { key: "address", label: "Адрес", icon: MapPin, placeholder: "Москва, Россия", hint: "Отображается в подвале и SEO-разметке" },
  { key: "workHours", label: "Часы работы", icon: Clock, placeholder: "Круглосуточно, 24/7", hint: "Отображается в подвале" },
];

export default function ContactsAdmin() {
  const [data, setData] = useState<ContactsData | null>(null);
  const [original, setOriginal] = useState<ContactsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/contacts")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setOriginal(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const hasChanges = data && original && JSON.stringify(data) !== JSON.stringify(original);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setOriginal({ ...data });
        setMessage({ type: "success", text: "Контакты сохранены. Обновите страницы сайта для применения." });
      } else {
        setMessage({ type: "error", text: "Ошибка сохранения" });
      }
    } catch {
      setMessage({ type: "error", text: "Ошибка сервера" });
    }
    setSaving(false);
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Контакты</h1>
          <p className="text-xs text-neutral-500">
            Телефон, мессенджеры, email — всё, что видит клиент на сайте
          </p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-[0.1em] hover:bg-neutral-200 disabled:opacity-50 transition-all shrink-0"
          >
            <Save className="w-3.5 h-3.5" strokeWidth={2} />
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div
          className={`flex items-center gap-2 py-2.5 px-3 text-xs mb-6 ${
            message.type === "success"
              ? "text-green-400 bg-green-400/5 border border-green-400/10"
              : "text-red-400 bg-red-400/5 border border-red-400/10"
          }`}
        >
          {message.type === "success" ? (
            <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
          )}
          {message.text}
        </div>
      )}

      {/* Info */}
      <div className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 p-4 mb-6">
        <p className="text-[11px] text-neutral-400 leading-relaxed">
          Эти данные используются на кнопках «Позвонить», в мессенджер-виджете, в форме обратной связи,
          в подвале, навбаре и SEO-разметке сайта. Изменение здесь обновит все эти места.
        </p>
      </div>

      {/* Fields */}
      <div className="space-y-1">
        {FIELDS.map(({ key, label, icon: Icon, placeholder, hint }) => (
          <div key={key} className="border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl backdrop-saturate-150 px-5 py-4 hover:bg-white/[0.03] transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-3.5 h-3.5 text-neutral-500" strokeWidth={1.5} />
              <label className="text-[10px] text-neutral-400 uppercase tracking-[0.15em] font-medium">{label}</label>
            </div>
            <input
              type="text"
              value={data[key]}
              onChange={(e) => setData({ ...data, [key]: e.target.value })}
              placeholder={placeholder}
              className="w-full bg-transparent text-sm text-white placeholder-neutral-700 focus:outline-none py-1"
            />
            <p className="text-[9px] text-neutral-700 mt-1">{hint}</p>
          </div>
        ))}
      </div>

      {/* Bottom save bar */}
      {hasChanges && (
        <div className="sticky bottom-0 mt-6 p-4 bg-[#0a0a0a]/95 backdrop-blur border border-white/[0.06] flex items-center justify-between">
          <span className="text-[11px] text-amber-400/80">Есть несохранённые изменения</span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-[0.1em] hover:bg-neutral-200 disabled:opacity-50 transition-all"
          >
            <Save className="w-3.5 h-3.5" strokeWidth={2} />
            {saving ? "..." : "Сохранить"}
          </button>
        </div>
      )}
    </div>
  );
}
