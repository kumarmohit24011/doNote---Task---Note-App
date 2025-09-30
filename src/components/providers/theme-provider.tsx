
"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = "theme-default" | "theme-sunset" | "theme-ocean" | "theme-forest";

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "theme-default",
  setTheme: () => null,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
        return (localStorage.getItem("app-theme") as Theme) || "theme-default";
    }
    return "theme-default";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove("theme-default", "theme-sunset", "theme-ocean", "theme-forest");
    
    if (theme === "theme-default") {
        root.classList.add('theme-default');
    } else {
        root.classList.add(theme);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem("app-theme", newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
