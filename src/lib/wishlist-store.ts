import { promises as fs } from "fs";
import { getDataDir, getDataFile } from "@/lib/storage-path";

const DATA_DIR = getDataDir();
const FILE = getDataFile("wishlists.json");

export type WishlistItem = {
  id: string;          // shop item id
  title: string;
  price: string;
  imageUrl: string;
  contentType: "book" | "video";
  professionalName: string;
  slug: string;
  addedAt: string;
};

type WishlistStore = Record<string, WishlistItem[]>; // keyed by studentId

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try { await fs.access(FILE); } catch {
    await fs.writeFile(FILE, "{}", "utf-8");
  }
}

async function readStore(): Promise<WishlistStore> {
  await ensureFile();
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch { return {}; }
}

async function writeStore(store: WishlistStore) {
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
