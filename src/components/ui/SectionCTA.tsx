"use client";

import { PhoneCall } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useContacts } from "@/lib/contacts-context";

interface SectionCTAProps {
  variant?: "call" | "form";
  label?: string;
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function SectionCTA({ variant = "call", label }: SectionCTAProps) {
  const { t } = useTranslation();
  const contacts = useContacts();

  if (variant === "form") {
    return (
      <div className="w-full border border-[var(--border)] bg-[var(--glass-card)] backdrop-blur-sm p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
        <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-light">
          {label || t("cta.form_default")}
        </p>
        <button
          onClick={() => scrollToSection("contact")}
          className="btn-primary shrink-0 px-5 sm:px-6 py-2.5"
        >
          {t("cta.form_btn")}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full border border-[var(--border)] bg-[var(--glass-card)] backdrop-blur-sm p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
      <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-light">
        {label || t("cta.call_default")}
      </p>
      <a
        href={`tel:${contacts.phone}`}
        className="btn-primary shrink-0 px-5 sm:px-6 py-2.5"
        aria-label={contacts.phoneDisplay}
      >
        <PhoneCall className="w-3 h-3" strokeWidth={2} aria-hidden="true" />
        {contacts.phoneDisplay}
      </a>
    </div>
  );
}
