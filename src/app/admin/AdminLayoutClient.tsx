"use client";

import { usePathname } from "next/navigation";
import AdminShellInner from "./AdminShell";
import { ToastProvider } from "@/components/ui/Toast";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Login and recovery pages render without the shell
  if (pathname === "/admin/login" || pathname === "/admin/recovery") {
    return <ToastProvider>{children}</ToastProvider>;
  }

  return <ToastProvider><AdminShellInner>{children}</AdminShellInner></ToastProvider>;
}
