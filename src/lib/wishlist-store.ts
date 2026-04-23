import { promises as fs } from "fs";
import { getDataDir, getDataFile } from "@/lib/storage-path";
import { ensureDbSchema, getDbPool, isPostgresConfigured } from "@/lib/db";

const DATA_DIR = getDataDir();
const FILE = getDataFile("wishlists.json");
const DB_KEY = "wishlists";

export type WishlistItem = {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  contentType: "book" | "video";
  professionalName: string;
  slug: string;
  addedAt: string;
};

type WishlistStore = Record<string, WishlistItem[]>;

async function readStore(): Promise<WishlistStore> {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();
    const result = await db.query<{ data: unknown }>(
      `SELECT data FROM app_data WHERE key = $1 LIMIT 1`,
      [DB_KEY],
    );
    if (result.rows.length === 0) return {};
    const parsed = result.rows[0].data;
    return typeof parsed === "object" && parsed !== null ? (parsed as WishlistStore) : {};
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  try { await fs.access(FILE); } catch {
    await fs.writeFile(FILE, "{}", "utf-8");
  }
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch { return {}; }
}

async function writeStore(store: WishlistStore): Promise<void> {
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

export async function getWishlist(studentId: string): Promise<WishlistItem[]> {
  const store = await readStore();
  return store[studentId] ?? [];
}

export async function toggleWishlistItem(studentId: string, item: Omit<WishlistItem, "addedAt">): Promise<{ wishlisted: boolean }> {
  const store = await readStore();
  const list = store[studentId] ?? [];
  const idx = list.findIndex((w) => w.id === item.id);
  if (idx >= 0) {
    list.splice(idx, 1);
    store[studentId] = list;
    await writeStore(store);
    return { wishlisted: false };
  }
  list.unshift({ ...item, addedAt: new Date().toISOString() });
  store[studentId] = list;
  await writeStore(store);
  return { wishlisted: true };
}

export async function isWishlisted(studentId: string, itemId: string): Promise<boolean> {
  const list = await getWishlist(studentId);
  return list.some((w) => w.id === itemId);
}
