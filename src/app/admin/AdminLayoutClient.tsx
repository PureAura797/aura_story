"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminShellInner from "./AdminShell";
import { ToastProvider } from "@/components/ui/Toast";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Force dark theme for all admin pages
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.getAttribute("data-theme") || "light";
    html.setAttribute("data-theme", "dark");
    html.style.background = "#0b0c0f";

    return () => {
      // Restore previous theme when leaving admin
      html.setAttribute("data-theme", prev);
      html.style.background = prev === "dark" ? "#0b0c0f" : "#f7f7f8";
    };
  }, []);

  // Login and recovery pages render without the shell
  if (pathname === "/admin/login" || pathname === "/admin/recovery") {
    return <ToastProvider>{children}</ToastProvider>;
  }

  return <ToastProvider><AdminShellInner>{children}</AdminShellInner></ToastProvider>;
}
