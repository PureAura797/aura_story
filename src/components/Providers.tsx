"use client";

import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { ContactsProvider } from "@/lib/contacts-context";
import ButtonEffects from "@/components/effects/ButtonEffects";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ContactsProvider>
        <ButtonEffects />
        {children}
      </ContactsProvider>
    </LanguageProvider>
  );
}
