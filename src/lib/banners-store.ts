import { promises as fs } from "fs";

import { ensureDbSchema, getDbPool, isPostgresConfigured } from "@/lib/db";
import { getDataDir, getDataFile } from "@/lib/storage-path";

const DATA_DIR = getDataDir();
const BANNERS_FILE = getDataFile("banners.json");
const BANNERS_DB_KEY = "banners";

export type BannerStatus = "pending" | "approved" | "rejected";

export type BannerRecord = {
  id: string;                // "banner-{timestamp}-{random}"
  professionalId: string;
  professionalName: string;
  professionalEmail: string;
  title: string;             // max 100 chars
  description: string;       // max 300 chars
  link: string;              // destination URL
  imageUrl: string;          // "/banners/{filename}"
  status: BannerStatus;
  createdAt: string;         // ISO 8601
  reviewedAt: string | null; // ISO 8601, set on approve/reject
};

type BannersStore = {
  banners: BannerRecord[];
};

const defaultStore: BannersStore = {
  banners: [],
};

async function ensureBannersFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(BANNERS_FILE);
  } catch {
    await fs.writeFile(BANNERS_FILE, JSON.stringify(defaultStore, null, 2), "utf-8");
  }
}

async function readStore(): Promise<BannersStore> {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();
    const result = await db.query<{ data: unknown }>(
      `SELECT data FROM app_data WHERE key = $1 LIMIT 1`,
      [BANNERS_DB_KEY],
    );

    if (result.rows.length > 0) {
      const parsed = result.rows[0].data as Partial<BannersStore>;
      return {
        banners: Array.isArray(parsed?.banners) ? (parsed.banners as BannerRecord[]) : [],
      };
    }

    // DB empty — seed from JSON file
    try {
      await ensureBannersFile();
      const raw = await fs.readFile(BANNERS_FILE, "utf-8");
      const parsed = JSON.parse(raw) as Partial<BannersStore>;
      const store: BannersStore = {
        banners: Array.isArray(parsed?.banners) ? (parsed.banners as BannerRecord[]) : [],
      };
      if (store.banners.length > 0) await writeStore(store);
      return store;
    } catch {
      return defaultStore;
    }
  }

  await ensureBannersFile();
  const raw = await fs.readFile(BANNERS_FILE, "utf-8");

  try {
    const parsed = JSON.parse(raw) as Partial<BannersStore>;
    return {
      banners: Array.isArray(parsed.banners) ? (parsed.banners as BannerRecord[]) : [],
    };
  } catch {
    return defaultStore;
  }
}

async function writeStore(store: BannersStore) {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();

    await db.query(
      `
        INSERT INTO app_data (key, data, updated_at)
        VALUES ($1, $2::jsonb, NOW())
        ON CONFLICT (key)
        DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
      `,
      [BANNERS_DB_KEY, JSON.stringify(store)],
    );
    return;
  }

  await fs.writeFile(BANNERS_FILE, JSON.stringify(store, null, 2), "utf-8");
}

function validateBannerInput(input: {
  title: string;
  imageUrl: string;
  link: string;
}) {
  if (!input.imageUrl || input.imageUrl.trim().length === 0) {
    throw new Error("Banner imageUrl is required.");
  }
}

export async function createBanner(
  input: Omit<BannerRecord, "id" | "status" | "createdAt" | "reviewedAt">,
): Promise<BannerRecord> {
  validateBannerInput(input);

  const id = `banner-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const record: BannerRecord = {
    ...input,
    id,
    status: "pending",
    createdAt: new Date().toISOString(),
    reviewedAt: null,
  };

  const store = await readStore();
  store.banners = [record, ...store.banners];
  await writeStore(store);
  return record;
}

export async function getBannersByProfessional(professionalId: string): Promise<BannerRecord[]> {
  const store = await readStore();
  return store.banners.filter((b) => b.professionalId === professionalId);
}

export async function getAllBanners(): Promise<BannerRecord[]> {
  const store = await readStore();
  return store.banners;
}

const BANNER_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function getApprovedBanners(): Promise<BannerRecord[]> {
  const store = await readStore();
  const now = Date.now();

  // Auto-expire approved banners older than 24hrs
  let changed = false;
  store.banners = store.banners.map((b) => {
    if (
      b.status === "approved" &&
      b.reviewedAt &&
      now - new Date(b.reviewedAt).getTime() > BANNER_EXPIRY_MS
    ) {
      changed = true;
      return { ...b, status: "rejected" as BannerStatus };
    }
    return b;
  });

  if (changed) await writeStore(store);

  return store.banners.filter((b) => b.status === "approved");
}

export async function updateBannerStatus(
  id: string,
  status: "approved" | "rejected",
): Promise<BannerRecord | null> {
  const store = await readStore();
  const index = store.banners.findIndex((b) => b.id === id);

  if (index === -1) return null;

  store.banners[index] = {
    ...store.banners[index],
    status,
    reviewedAt: new Date().toISOString(),
  };

  await writeStore(store);
  return store.banners[index];
}
