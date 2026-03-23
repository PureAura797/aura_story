"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import AdminShellInner from "./AdminShell";
import { ToastProvider } from "@/components/ui/Toast";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevThemeRef = useRef<string>("");
  const prevBgRef = useRef<string>("");

  // Force dark theme for admin — store previous, restore on unmount
  useEffect(() => {
    const html = document.documentElement;
    
    // Save current state before overriding
    prevThemeRef.current = html.getAttribute("data-theme") || "light";
    prevBgRef.current = html.style.background || "";

    // Force dark immediately
    html.setAttribute("data-theme", "dark");
    html.style.background = "#0b0c0f";
    // Mark as admin for CSS scoping
    html.setAttribute("data-admin", "true");

    return () => {
      // Restore previous theme when leaving admin
      html.setAttribute("data-theme", prevThemeRef.current);
      html.style.background = prevBgRef.current || (prevThemeRef.current === "dark" ? "#0b0c0f" : "#f7f7f8");
      html.removeAttribute("data-admin");
    };
  }, []);

  // Also enforce on every navigation within admin (in case theme toggle fires)
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", "dark");
    html.style.background = "#0b0c0f";
  }, [pathname]);

  // Login and recovery pages render without the shell
  if (pathname === "/admin/login" || pathname === "/admin/recovery") {
    return <ToastProvider>{children}</ToastProvider>;
  }

  return <ToastProvider><AdminShellInner>{children}</AdminShellInner></ToastProvider>;
}
