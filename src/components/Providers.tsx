"use client";

import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import ButtonEffects from "@/components/effects/ButtonEffects";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ButtonEffects />
      {children}
    </LanguageProvider>
  );
}
