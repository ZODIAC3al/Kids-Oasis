"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";

type Theme = "light" | "dark";
type Ctx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void };

const ThemeContext = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentTheme = (resolvedTheme || theme || "light") as Theme;

  const toggle = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: mounted ? currentTheme : "light",
        toggle,
        setTheme: (t) => setTheme(t),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  const nextTheme = useNextTheme();

  if (ctx) return ctx;

  const currentTheme = (nextTheme.resolvedTheme || nextTheme.theme || "light") as Theme;
  return {
    theme: currentTheme,
    toggle: () => nextTheme.setTheme(currentTheme === "dark" ? "light" : "dark"),
    setTheme: (t: Theme) => nextTheme.setTheme(t),
  };
}
