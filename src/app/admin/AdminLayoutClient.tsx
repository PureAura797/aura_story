"use client";

import { usePathname } from "next/navigation";
import AdminShellInner from "./AdminShell";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Login and recovery pages render without the shell
  if (pathname === "/admin/login" || pathname === "/admin/recovery") {
    return <>{children}</>;
  }

  return <AdminShellInner>{children}</AdminShellInner>;
}
