export type ThemeMode = "light" | "dark";
export type Direction = "ltr" | "rtl";

export interface ThemeSettings {
  themeMode: ThemeMode;
  primaryColor: string;
  backgroundColor: string;
  direction: Direction;
}

const DEFAULT_SETTINGS: ThemeSettings = {
  themeMode: "light",
  primaryColor: "#1ec28e",
  backgroundColor: "#0f172a",
  direction: "ltr",
};

const THEME_STORAGE_KEY = "lookit-theme-settings";

export function getDefaultThemeSettings(): ThemeSettings {
  return { ...DEFAULT_SETTINGS };
}

export function parseThemeSettingsFromStorage(stored: unknown): ThemeSettings {
  if (!stored || typeof stored !== "object") {
    return getDefaultThemeSettings();
  }

  const data = stored as Partial<ThemeSettings>;

  return {
    themeMode: data.themeMode === "dark" ? "dark" : "light",
    primaryColor: typeof data.primaryColor === "string" ? data.primaryColor : DEFAULT_SETTINGS.primaryColor,
    backgroundColor:
      typeof data.backgroundColor === "string" ? data.backgroundColor : DEFAULT_SETTINGS.backgroundColor,
    direction: data.direction === "rtl" ? "rtl" : "ltr",
  };
}

export function applyThemeToDOM(settings: ThemeSettings) {
  if (typeof document === "undefined") {
    return;
  }

  const html = document.documentElement;

  html.setAttribute("dir", settings.direction);
  html.dataset.theme = settings.themeMode;
  html.style.setProperty("--primary-color", settings.primaryColor);

  const bgColor = settings.themeMode === "dark" ? settings.backgroundColor : "#f4f8f7";
  const fgColor = settings.themeMode === "dark" ? "#c7ced8" : "#0f172a";

  html.style.setProperty("--page-background", bgColor);
  html.style.setProperty("--page-foreground", fgColor);

  document.body.style.backgroundColor = bgColor;
  document.body.style.color = fgColor;
  document.body.style.direction = settings.direction;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export async function saveThemeSettingsToBackend(
  settings: ThemeSettings,
  userId?: string,
): Promise<boolean> {
  try {
    const response = await fetch("/api/theme/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...settings, userId }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function fetchThemeSettingsFromBackend(userId?: string): Promise<ThemeSettings | null> {
  try {
    const url = userId ? `/api/theme/get?userId=${userId}` : "/api/theme/get";
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as ThemeSettings | null;
    return data ? parseThemeSettingsFromStorage(data) : null;
  } catch {
    return null;
  }
}
