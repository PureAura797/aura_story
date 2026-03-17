"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface ContactsData {
  phone: string;
  phoneDisplay: string;
  email: string;
  telegram: string;
  max: string;
  webhookUrl: string;
  address: string;
  workHours: string;
}

const DEFAULTS: ContactsData = {
  phone: "+74951203456",
  phoneDisplay: "8 495 120-34-56",
  email: "help@auraremediation.com",
  telegram: "https://t.me/pureaura",
  max: "https://max.ru/pureaura",
  webhookUrl: "",
  address: "Москва, Россия",
  workHours: "Круглосуточно, 24/7",
};

const ContactsContext = createContext<ContactsData>(DEFAULTS);

export function ContactsProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<ContactsData>(DEFAULTS);

  useEffect(() => {
    fetch("/api/contacts")
      .then((r) => r.json())
      .then((data) => setContacts({ ...DEFAULTS, ...data }))
      .catch(() => {/* fallback to defaults */});
  }, []);

  return (
    <ContactsContext.Provider value={contacts}>
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts() {
  return useContext(ContactsContext);
}
