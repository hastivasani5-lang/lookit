import { promises as fs } from "fs";

import { ensureDbSchema, getDbPool, isPostgresConfigured } from "@/lib/db";
import { getDataDir, getDataFile } from "@/lib/storage-path";

const DATA_DIR = getDataDir();
const REVIEWS_FILE = getDataFile("reviews.json");
const REVIEWS_DB_KEY = "reviews";

type ReviewsStore = {
  reviews: ReviewRecord[];
};

const defaultStore: ReviewsStore = {
  reviews: [],
};

export type ReviewRecord = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  professionalId: string;
  professionalName: string;
  rating: number;
  review: string;
  createdAt: string;
};

async function ensureReviewsFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(REVIEWS_FILE);
  } catch {
    await fs.writeFile(REVIEWS_FILE, JSON.stringify(defaultStore, null, 2), "utf-8");
  }
}

async function readStore(): Promise<ReviewsStore> {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();
    const result = await db.query<{ data: unknown }>(
      `SELECT data FROM app_data WHERE key = $1 LIMIT 1`,
      [REVIEWS_DB_KEY],
    );

    if (result.rows.length === 0) {
      return defaultStore;
    }

    const parsed = result.rows[0].data as Partial<ReviewsStore>;
    return {
      reviews: Array.isArray(parsed?.reviews) ? (parsed.reviews as ReviewRecord[]) : [],
    };
  }

  await ensureReviewsFile();
  const raw = await fs.readFile(REVIEWS_FILE, "utf-8");

  try {
    const parsed = JSON.parse(raw) as Partial<ReviewsStore>;
    return {
      reviews: Array.isArray(parsed.reviews) ? (parsed.reviews as ReviewRecord[]) : [],
    };
  } catch {
    return defaultStore;
  }
}

async function writeStore(store: ReviewsStore) {
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
      [REVIEWS_DB_KEY, JSON.stringify(store)],
    );
    return;
  }

  await fs.writeFile(REVIEWS_FILE, JSON.stringify(store, null, 2), "utf-8");
}

export async function getReviews() {
  const store = await readStore();
  return store.reviews;
}

export async function addReview(review: ReviewRecord) {
  const store = await readStore();
  store.reviews = [review, ...store.reviews];
  await writeStore(store);
  return review;
}

export async function deleteReviewsByStudentId(studentId: string) {
  const store = await readStore();
  const filtered = store.reviews.filter((review) => review.studentId !== studentId);

  if (filtered.length !== store.reviews.length) {
    store.reviews = filtered;
    await writeStore(store);
  }
}

export async function deleteReviewsByProfessionalId(professionalId: string) {
  const store = await readStore();
  const filtered = store.reviews.filter((review) => review.professionalId !== professionalId);

  if (filtered.length !== store.reviews.length) {
    store.reviews = filtered;
    await writeStore(store);
  }
}

export async function deleteReviewById(reviewId: string) {
  const store = await readStore();
  const filtered = store.reviews.filter((review) => review.id !== reviewId);

  if (filtered.length === store.reviews.length) {
    return false;
  }

  store.reviews = filtered;
  await writeStore(store);
  return true;
}
