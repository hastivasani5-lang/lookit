import { promises as fs } from "fs";
import { getDataFile } from "@/lib/storage-path";
import { ensureDbSchema, getDbPool, isPostgresConfigured } from "@/lib/db";

const FILE = getDataFile("upcoming-classes.json");
const DB_KEY = "upcoming-classes";

export type UpcomingClass = {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalImage: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  platform: string;
  link: string;
  description: string;
  createdAt: string;
};

type Store = Record<string, UpcomingClass[]>;

async function readStore(): Promise<Store> {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();
    const result = await db.query<{ data: unknown }>(
      `SELECT data FROM app_data WHERE key = $1 LIMIT 1`,
      [DB_KEY],
    );
    if (result.rows.length > 0) {
      const parsed = result.rows[0].data;
      return typeof parsed === "object" && parsed !== null ? (parsed as Store) : {};
    }
    // DB empty — seed from JSON
    try {
      const raw = await fs.readFile(FILE, "utf-8");
      const parsed = JSON.parse(raw);
      const store = typeof parsed === "object" && parsed !== null ? (parsed as Store) : {};
      if (Object.keys(store).length > 0) await writeStore(store);
      return store;
    } catch { return {}; }
  }

  try {
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

async function writeStore(store: Store): Promise<void> {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();
    await db.query(
      `INSERT INTO app_data (key, data, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (key)
       DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      [DB_KEY, JSON.stringify(store)],
    );
    return;
  }
  await fs.writeFile(FILE, JSON.stringify(store, null, 2), "utf-8");
}

export async function getAllUpcomingClasses(): Promise<UpcomingClass[]> {
  const store = await readStore();
  return Object.values(store).flat().sort((a, b) => a.date.localeCompare(b.date));
}

export async function getProfessionalClasses(professionalId: string): Promise<UpcomingClass[]> {
  const store = await readStore();
  return store[professionalId] ?? [];
}

export async function saveClass(professionalId: string, cls: UpcomingClass): Promise<UpcomingClass> {
  const store = await readStore();
  const list = store[professionalId] ?? [];
  const idx = list.findIndex((c) => c.id === cls.id);
  if (idx >= 0) {
    list[idx] = cls;
  } else {
    list.unshift(cls);
  }
  store[professionalId] = list;
  await writeStore(store);
  return cls;
}

export async function deleteClass(professionalId: string, classId: string): Promise<void> {
  const store = await readStore();
  store[professionalId] = (store[professionalId] ?? []).filter((c) => c.id !== classId);
  await writeStore(store);
}
