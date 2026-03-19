"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, Calculator, Star, LayoutDashboard, LogOut, ExternalLink, Image, Settings, Phone, Bell, BarChart3, Menu, X, HelpCircle, Briefcase, CreditCard, MessageCircle, Award } from "lucide-react";
import Logo from "@/components/ui/Logo";
import AdminBgLogo from "./AdminBgLogo";

const navItems = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/content", label: "Контент", icon: FileText },
  { href: "/admin/services", label: "Услуги", icon: Briefcase },
  { href: "/admin/pricing", label: "Тарифы", icon: CreditCard },
  { href: "/admin/calculator", label: "Калькулятор", icon: Calculator },
  { href: "/admin/reviews", label: "Отзывы", icon: Star },
  { href: "/admin/faq", label: "FAQ", icon: MessageCircle },
  { href: "/admin/certificates", label: "Сертификаты", icon: Award },
  { href: "/admin/media", label: "Медиа", icon: Image },
  { href: "/admin/contacts", label: "Контакты", icon: Phone },
  { href: "/admin/notifications", label: "Уведомления", icon: Bell },
  { href: "/admin/analytics", label: "Аналитика", icon: BarChart3 },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
  { href: "/admin/help", label: "Справка", icon: HelpCircle },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/admin/login");
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white relative">

      {/* ─── Cinematic 3D Logo Background ─── */}
      <div
        className="hidden lg:block fixed pointer-events-none select-none"
        style={{
          top: 0,
          right: 0,
          bottom: 0,
          left: "224px",
          zIndex: 0,
        }}
      >
        <AdminBgLogo />
      </div>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex md:hidden items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#0a0a0c]/95 backdrop-blur-xl">
        <Logo size="sm" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-neutral-400 hover:text-white transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
        </button>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar — fixed on all screen sizes */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-56 border-r border-white/[0.06] flex flex-col shrink-0 bg-[#0a0a0c]
          transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo — hidden on mobile (already in header) */}
        <div className="px-5 py-4 border-b border-white/[0.06] hidden md:block">
          <Logo size="sm" />
          <p className="text-[9px] text-neutral-600 uppercase tracking-[0.2em] mt-1.5">Админ-панель</p>
        </div>

        {/* Mobile logo spacer */}
        <div className="h-[52px] md:hidden" />

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium tracking-wide transition-all duration-200 mb-0.5 ${
                  isActive
                    ? "bg-white/[0.08] text-white border border-white/10"
                    : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03] border border-transparent"
                }`}
              >
                <item.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-white/[0.06] space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
            Открыть сайт
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-neutral-600 hover:text-red-400 transition-colors w-full cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main Content — above the 3D scene */}
      <main className="min-h-screen p-4 pt-16 md:p-8 md:pt-8 md:ml-56 relative" style={{ zIndex: 1 }}>
        {children}
      </main>
    </div>
  );
}
