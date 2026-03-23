"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminShellInner from "./AdminShell";
import { ToastProvider } from "@/components/ui/Toast";

declare global {
  interface Window {
    __adminPrevTheme?: string;
    __adminPrevBg?: string;
  }
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Keep dark theme enforced (in case something resets it)
  // and handle cleanup when leaving admin
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", "dark");
    html.style.background = "#0b0c0f";

    return () => {
      // Restore previous theme when leaving admin
      const prev = window.__adminPrevTheme || "";
      if (prev && prev !== "dark") {
        html.setAttribute("data-theme", prev);
        html.style.background = window.__adminPrevBg || (prev === "light" ? "#f7f7f8" : "#0b0c0f");
      }
    };
  }, []);

  // Login and recovery pages render without the shell
  if (pathname === "/admin/login" || pathname === "/admin/recovery") {
    return <ToastProvider>{children}</ToastProvider>;
  }

  return <ToastProvider><AdminShellInner>{children}</AdminShellInner></ToastProvider>;
}
