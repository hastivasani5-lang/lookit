"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { ThemeSettings } from "@/lib/theme-store";
import { applyThemeToDOM, getDefaultThemeSettings, parseThemeSettingsFromStorage, updateCSSVariablesForPrimaryColor } from "@/lib/theme-store";

interface ThemeContextValue {
  settings: ThemeSettings;
  setThemeMode: (mode: "light" | "dark") => void;
  setPrimaryColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setDirection: (direction: "ltr" | "rtl") => void;
  resetToDefaults: () => void;
  isLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(getDefaultThemeSettings());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedSettings = localStorage.getItem("lookit-theme-settings");
    const parsed = storedSettings ? parseThemeSettingsFromStorage(JSON.parse(storedSettings)) : getDefaultThemeSettings();

    setSettings(parsed);
    applyThemeToDOM(parsed);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("lookit-theme-settings", JSON.stringify(settings));
      applyThemeToDOM(settings);
    }
  }, [settings, isLoaded]);

  const setThemeMode = (mode: "light" | "dark") => {
    setSettings((prev) => ({ ...prev, themeMode: mode }));
  };

  const setPrimaryColor = (color: string) => {
    setSettings((prev) => ({ ...prev, primaryColor: color }));
    updateCSSVariablesForPrimaryColor(color);
  };

  const setBackgroundColor = (color: string) => {
    setSettings((prev) => ({ ...prev, backgroundColor: color }));
  };

  const setDirection = (direction: "ltr" | "rtl") => {
    setSettings((prev) => ({ ...prev, direction }));
  };

  const resetToDefaults = () => {
    const defaults = getDefaultThemeSettings();
    setSettings(defaults);
    localStorage.setItem("lookit-theme-settings", JSON.stringify(defaults));
  };

  return (
    <ThemeContext.Provider value={{ settings, setThemeMode, setPrimaryColor, setBackgroundColor, setDirection, resetToDefaults, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
