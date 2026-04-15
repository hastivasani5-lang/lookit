import { promises as fs } from "fs";
import { getDataDir, getDataFile } from "@/lib/storage-path";
import type { ThemeSettings } from "@/lib/theme-store";
import { getDefaultThemeSettings, parseThemeSettingsFromStorage } from "@/lib/theme-store";

const THEMES_FILE = getDataFile("themes.json");

interface StoredTheme {
  userId: string;
  settings: ThemeSettings;
  updatedAt: string;
}

async function ensureThemesFile() {
  try {
    await fs.access(THEMES_FILE);
  } catch {
    await fs.writeFile(THEMES_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

async function readThemes(): Promise<StoredTheme[]> {
  await ensureThemesFile();
  try {
    const raw = await fs.readFile(THEMES_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeThemes(themes: StoredTheme[]) {
  await fs.writeFile(THEMES_FILE, JSON.stringify(themes, null, 2), "utf-8");
}

export async function getThemeSettingsForUser(userId: string): Promise<ThemeSettings | null> {
  const themes = await readThemes();
  const userTheme = themes.find((t) => t.userId === userId);

  if (!userTheme) {
    return null;
  }

  return parseThemeSettingsFromStorage(userTheme.settings);
}

export async function saveThemeSettingsForUser(userId: string, settings: ThemeSettings): Promise<void> {
  const themes = await readThemes();
  const index = themes.findIndex((t) => t.userId === userId);

  const newTheme: StoredTheme = {
    userId,
    settings,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    themes[index] = newTheme;
  } else {
    themes.push(newTheme);
  }

  await writeThemes(themes);
}

export async function deleteThemeSettingsForUser(userId: string): Promise<void> {
  const themes = await readThemes();
  const filtered = themes.filter((t) => t.userId !== userId);
  await writeThemes(filtered);
}

export async function getAllThemeSettings(): Promise<StoredTheme[]> {
  return readThemes();
}
