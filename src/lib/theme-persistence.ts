import { promises as fs } from "fs";
import { getDataFile } from "@/lib/storage-path";
import type { ThemeSettings } from "@/lib/theme-store";
import { getDefaultThemeSettings, parseThemeSettingsFromStorage } from "@/lib/theme-store";
import { ensureDbSchema, getDbPool, isPostgresConfigured } from "@/lib/db";

const THEMES_FILE = getDataFile("themes.json");
const THEMES_DB_KEY = "themes";

interface StoredTheme {
  userId: string;
  settings: ThemeSettings;
  updatedAt: string;
}

async function readThemes(): Promise<StoredTheme[]> {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();
    const result = await db.query<{ data: unknown }>(
      `SELECT data FROM app_data WHERE key = $1 LIMIT 1`,
      [THEMES_DB_KEY],
    );
    if (result.rows.length === 0) return [];
    const parsed = result.rows[0].data;
    return Array.isArray(parsed) ? (parsed as StoredTheme[]) : [];
  }

  try {
    await fs.access(THEMES_FILE);
  } catch {
    await fs.writeFile(THEMES_FILE, JSON.stringify([], null, 2), "utf-8");
  }

  try {
    const raw = await fs.readFile(THEMES_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeThemes(themes: StoredTheme[]): Promise<void> {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();
    await db.query(
      `INSERT INTO app_data (key, data, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (key)
       DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      [THEMES_DB_KEY, JSON.stringify(themes)],
    );
    return;
  }

  await fs.writeFile(THEMES_FILE, JSON.stringify(themes, null, 2), "utf-8");
}

export async function getThemeSettingsForUser(userId: string): Promise<ThemeSettings | null> {
  const themes = await readThemes();
  const userTheme = themes.find((t) => t.userId === userId);
  if (!userTheme) return null;
  return parseThemeSettingsFromStorage(userTheme.settings);
}

export async function saveThemeSettingsForUser(userId: string, settings: ThemeSettings): Promise<void> {
  const themes = await readThemes();
  const index = themes.findIndex((t) => t.userId === userId);
  const newTheme: StoredTheme = { userId, settings, updatedAt: new Date().toISOString() };
  if (index >= 0) {
    themes[index] = newTheme;
  } else {
    themes.push(newTheme);
  }
  await writeThemes(themes);
}

export async function deleteThemeSettingsForUser(userId: string): Promise<void> {
  const themes = await readThemes();
  await writeThemes(themes.filter((t) => t.userId !== userId));
}

export async function getAllThemeSettings(): Promise<StoredTheme[]> {
  return readThemes();
}
