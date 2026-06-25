import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeId = "crystal" | "midnight" | "aurora" | "classic";

export const THEMES: { id: ThemeId; label: string; hint: string }[] = [
  { id: "crystal", label: "Crystal", hint: "iOS frosted glass" },
  { id: "midnight", label: "Midnight", hint: "Deep dark glass" },
  { id: "aurora", label: "Aurora", hint: "Vibrant signature" },
  { id: "classic", label: "Classic", hint: "Clean newsroom" },
];

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "aura-theme";

function applyTheme(theme: ThemeId) {
  const root = document.documentElement;
  // crystal is the :root default — clear the attribute for it
  if (theme === "crystal") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("crystal");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as ThemeId) || "crystal";
    setThemeState(saved);
    applyTheme(saved);
  }, []);

  const setTheme = (t: ThemeId) => {
    setThemeState(t);
    applyTheme(t);
    localStorage.setItem(STORAGE_KEY, t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
