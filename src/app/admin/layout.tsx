import AdminLayoutClient from "./AdminLayoutClient";

/**
 * Server-side admin layout.
 * Injects a blocking <script> that forces dark theme BEFORE React hydration,
 * preventing the flash of light-themed admin panel.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(){
              var h=document.documentElement;
              window.__adminPrevTheme=h.getAttribute("data-theme")||"";
              window.__adminPrevBg=h.style.background||"";
              h.setAttribute("data-theme","dark");
              h.style.background="#0b0c0f";
            })();
          `,
        }}
      />
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </>
  );
}
