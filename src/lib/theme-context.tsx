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
      // First visit — default to light
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);

  const toggleTheme = useCallback((e?: React.MouseEvent) => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    // If no mouse event or transitions not supported — instant switch
    if (!e || isTransitioning.current) {
      setTheme(nextTheme);
      return;
    }

    // Get click coordinates for ripple origin
    const x = e.clientX;
    const y = e.clientY;

    // Calculate the max radius needed to cover the entire viewport
    const maxRadius = Math.ceil(
      Math.sqrt(
        Math.max(x, window.innerWidth - x) ** 2 +
        Math.max(y, window.innerHeight - y) ** 2
      )
    );

    // Create ripple overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 99999;
      pointer-events: none;
      background: ${nextTheme === "light" ? "#f7f7f8" : "#0b0c0f"};
      clip-path: circle(0px at ${x}px ${y}px);
      transition: clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: clip-path;
    `;
    document.body.appendChild(overlay);

    isTransitioning.current = true;

    // Trigger the ripple expansion (next frame for transition to fire)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.clipPath = `circle(${maxRadius}px at ${x}px ${y}px)`;

        // Switch theme at ~40% of animation (when ripple covers enough area)
        setTimeout(() => {
          setTheme(nextTheme);
        }, 240);

        // Remove overlay after animation completes
        setTimeout(() => {
          overlay.remove();
          isTransitioning.current = false;
        }, 650);
      });
    });
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
