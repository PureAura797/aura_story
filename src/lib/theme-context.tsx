"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: (e?: React.MouseEvent) => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const isTransitioning = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved === "light" || saved === "dark") {
      setThemeState(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);

  const toggleTheme = useCallback((e?: React.MouseEvent) => {
    // Read current theme from DOM to avoid stale closure
    const current = (document.documentElement.getAttribute("data-theme") || "light") as Theme;
    const nextTheme: Theme = current === "dark" ? "light" : "dark";

    if (isTransitioning.current) return;

    // Safety: auto-reset transitioning after 1.5s in case of errors
    const safetyTimer = setTimeout(() => {
      isTransitioning.current = false;
      document.getElementById("vt-freeze")?.remove();
    }, 1500);

    // --- Strategy 1: View Transitions API (Chrome/Edge) ---
    if (e && "startViewTransition" in document) {
      const x = e.clientX;
      const y = e.clientY;

      const maxRadius = Math.ceil(
        Math.sqrt(
          Math.max(x, window.innerWidth - x) ** 2 +
          Math.max(y, window.innerHeight - y) ** 2
        )
      );

      isTransitioning.current = true;

      // Inject the animation styles
      let styleEl = document.getElementById("vt-ripple-styles");
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "vt-ripple-styles";
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = `
        ::view-transition-image-pair(root) {
          isolation: auto;
        }
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
        }
        ::view-transition-new(root) {
          clip-path: circle(0px at ${x}px ${y}px);
          animation: ripple-expand 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          z-index: 9999;
        }
        ::view-transition-old(root) {
          z-index: 1;
        }
        @keyframes ripple-expand {
          to {
            clip-path: circle(${maxRadius}px at ${x}px ${y}px);
          }
        }
      `;

      // Freeze CSS transitions during view transition
      const freezeStyle = document.createElement("style");
      freezeStyle.id = "vt-freeze";
      freezeStyle.textContent = `* { transition: none !important; }`;
      document.head.appendChild(freezeStyle);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transition = (document as any).startViewTransition(() => {
        setTheme(nextTheme);
      });

      const cleanup = () => {
        clearTimeout(safetyTimer);
        // Delay freeze removal — body/main have transition-colors 500ms
        // which would animate CSS vars if we remove freeze immediately
        setTimeout(() => {
          freezeStyle.remove();
          isTransitioning.current = false;
        }, 50);
      };

      transition.finished.then(cleanup).catch(cleanup);
      return;
    }

    // --- Strategy 2: Blur Dissolve fallback (Safari/Firefox) ---
    if (e) {
      isTransitioning.current = true;
      const root = document.documentElement;

      root.style.transition = "filter 0.3s ease, opacity 0.3s ease";
      root.style.filter = "blur(6px)";
      root.style.opacity = "0.7";

      setTimeout(() => {
        setTheme(nextTheme);

        requestAnimationFrame(() => {
          root.style.filter = "blur(0px)";
          root.style.opacity = "1";

          setTimeout(() => {
            root.style.transition = "";
            root.style.filter = "";
            root.style.opacity = "";
            clearTimeout(safetyTimer);
            isTransitioning.current = false;
          }, 350);
        });
      }, 300);

      return;
    }

    // --- No event — instant switch ---
    clearTimeout(safetyTimer);
    setTheme(nextTheme);
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
