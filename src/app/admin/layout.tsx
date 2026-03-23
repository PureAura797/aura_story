import AdminLayoutClient from "./AdminLayoutClient";

/**
 * Server-side admin layout.
 * Sets data-admin="true" on <html> via blocking script BEFORE React hydration.
 * This activates the [data-admin] CSS override in globals.css that forces dark variables.
 * We deliberately do NOT touch data-theme to avoid corrupting the main site's
 * theme stored in localStorage by the ThemeProvider.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.setAttribute("data-admin","true");document.documentElement.style.background="#0b0c0f";`,
        }}
      />
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </>
  );
}
