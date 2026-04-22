import { promises as fs } from "fs";
import { getDataDir, getDataFile } from "@/lib/storage-path";
import { ensureDbSchema, getDbPool, isPostgresConfigured } from "@/lib/db";

const DATA_DIR = getDataDir();
const LIBRARY_FILE = getDataFile("content-library.json");
const LIBRARY_DB_KEY = "content-library";

export type StoredBook = {
  id: string;
  name: string;
  category: string;
  mrp: string;
  imageUrl: string;
  url: string;
  fileUrl?: string;
  source: "file" | "amazon";
  fileName: string;
  sizeLabel: string;
  createdAt: string;
};

export type StoredVideo = {
  id: string;
  name: string;
  mrp: string;
  url: string;
  source: "file" | "youtube";
  sizeLabel: string;
  level: string;
  isPopular: boolean;
  createdAt: string;
};

export type StudentBookActivity = {
  id: string;
  contentId?: string;
  title: string;
  source: string;
  amount: string;
  accessUrl?: string;
  purchasedAt: string;
};

export type StudentVideoActivity = {
  id: string;
  contentId?: string;
  title: string;
  provider: string;
  amount: string;
  accessUrl?: string;
  watchedAt: string;
};

type ProfessionalLibrary = {
  books: StoredBook[];
  videos: StoredVideo[];
  categories: string[];
};

type StudentLibrary = {
  purchasedBooks: StudentBookActivity[];
  watchedVideos: StudentVideoActivity[];
};

type LibraryStore = {
  professionals: Record<string, ProfessionalLibrary>;
  students: Record<string, StudentLibrary>;
};

const defaultStore: LibraryStore = {
  professionals: {},
  students: {},
};

function normalizeProfessionalLibrary(library: Partial<ProfessionalLibrary> | undefined): ProfessionalLibrary {
  const books = Array.isArray(library?.books) ? (library.books as StoredBook[]) : [];
  const categories = Array.isArray(library?.categories)
    ? library.categories.filter((value): value is string => typeof value === "string")
    : [];
  const videos = Array.isArray(library?.videos)
    ? library.videos.map((video) => ({
        ...(video as StoredVideo),
        level: typeof (video as StoredVideo).level === "string" ? (video as StoredVideo).level : "",
        isPopular: typeof (video as StoredVideo).isPopular === "boolean" ? (video as StoredVideo).isPopular : false,
      }))
    : [];

  return {
    books,
    videos,
    categories,
  };
}

function normalizeStudentLibrary(library: Partial<StudentLibrary> | undefined): StudentLibrary {
  return {
    purchasedBooks: Array.isArray(library?.purchasedBooks) ? (library.purchasedBooks as StudentBookActivity[]) : [],
    watchedVideos: Array.isArray(library?.watchedVideos) ? (library.watchedVideos as StudentVideoActivity[]) : [],
  };
}

async function ensureLibraryFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(LIBRARY_FILE);
  } catch {
    await fs.writeFile(LIBRARY_FILE, JSON.stringify(defaultStore, null, 2), "utf-8");
  }
}

async function readStore(): Promise<LibraryStore> {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();
    const result = await db.query<{ data: unknown }>(
      `SELECT data FROM app_data WHERE key = $1 LIMIT 1`,
      [LIBRARY_DB_KEY],
    );

    if (result.rows.length === 0) {
      return defaultStore;
    }

    const parsed = result.rows[0].data as Partial<LibraryStore>;
    const professionals = Object.fromEntries(
      Object.entries(parsed?.professionals ?? {}).map(([professionalId, library]) => [
        professionalId,
        normalizeProfessionalLibrary(library),
      ]),
    );
    const students = Object.fromEntries(
      Object.entries(parsed?.students ?? {}).map(([studentId, library]) => [studentId, normalizeStudentLibrary(library)]),
    );

    return {
      professionals,
      students,
    };
  }

  await ensureLibraryFile();
  const raw = await fs.readFile(LIBRARY_FILE, "utf-8");

  try {
    const parsed = JSON.parse(raw) as Partial<LibraryStore>;
    const professionals = Object.fromEntries(
      Object.entries(parsed?.professionals ?? {}).map(([professionalId, library]) => [
        professionalId,
        normalizeProfessionalLibrary(library),
      ]),
    );
    const students = Object.fromEntries(
      Object.entries(parsed?.students ?? {}).map(([studentId, library]) => [studentId, normalizeStudentLibrary(library)]),
    );

    return {
      professionals,
      students,
    };
  } catch {
    return defaultStore;
  }
}

// ── Write queue to prevent race conditions ────────────────────────────────────
let writeQueue: Promise<void> = Promise.resolve();

async function writeStore(store: LibraryStore) {
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
      [LIBRARY_DB_KEY, JSON.stringify(store)],
    );
    return;
  }

  // Serialize all writes through a queue to prevent concurrent overwrites
  writeQueue = writeQueue.then(async () => {
    await fs.writeFile(LIBRARY_FILE + ".tmp", JSON.stringify(store, null, 2), "utf-8");
    await fs.rename(LIBRARY_FILE + ".tmp", LIBRARY_FILE);
  });
  await writeQueue;
}

function getOrCreateProfessionalLibrary(store: LibraryStore, professionalId: string): ProfessionalLibrary {
  if (!store.professionals[professionalId]) {
    store.professionals[professionalId] = {
      books: [],
      videos: [],
      categories: [],
    };
  }

  return store.professionals[professionalId];
}

function uniqueCategories(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

export async function getProfessionalLibrary(professionalId: string): Promise<ProfessionalLibrary> {
  const store = await readStore();
  return (
    store.professionals[professionalId] ?? {
      books: [],
      videos: [],
      categories: [],
    }
  );
}

export async function addProfessionalBook(professionalId: string, input: Omit<StoredBook, "id" | "createdAt">) {
  const store = await readStore();
  const library = getOrCreateProfessionalLibrary(store, professionalId);

  const book: StoredBook = {
    ...input,
    id: `book-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };

  library.books = [book, ...library.books];
  library.categories = uniqueCategories([...library.categories, input.category]);

  await writeStore(store);
  return book;
}

export async function getProfessionalBookById(professionalId: string, bookId: string) {
  const library = await getProfessionalLibrary(professionalId);
  return library.books.find((book) => book.id === bookId) ?? null;
}

export async function updateProfessionalBook(
  professionalId: string,
  bookId: string,
  input: Partial<Omit<StoredBook, "id" | "createdAt">>,
) {
  const store = await readStore();
  const library = getOrCreateProfessionalLibrary(store, professionalId);
  const index = library.books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    return null;
  }

  const current = library.books[index];
  const updated: StoredBook = {
    ...current,
    ...input,
  };

  library.books[index] = updated;
  library.categories = uniqueCategories([...library.categories, updated.category]);
  await writeStore(store);
  return updated;
}

export async function addProfessionalVideo(
  professionalId: string,
  input: Omit<StoredVideo, "id" | "createdAt" | "isPopular" | "level"> & { isPopular?: boolean; level?: string },
) {
  const store = await readStore();
  const library = getOrCreateProfessionalLibrary(store, professionalId);

  const video: StoredVideo = {
    ...input,
    level: input.level ?? "",
    isPopular: input.isPopular ?? false,
    id: `video-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };

  library.videos = [video, ...library.videos];

  await writeStore(store);
  return video;
}

export async function getProfessionalVideoById(professionalId: string, videoId: string) {
  const library = await getProfessionalLibrary(professionalId);
  return library.videos.find((video) => video.id === videoId) ?? null;
}

export async function updateProfessionalVideo(
  professionalId: string,
  videoId: string,
  input: Partial<Omit<StoredVideo, "id" | "createdAt">>,
) {
  const store = await readStore();
  const library = getOrCreateProfessionalLibrary(store, professionalId);
  const index = library.videos.findIndex((video) => video.id === videoId);

  if (index === -1) {
    return null;
  }

  const current = library.videos[index];
  const updated: StoredVideo = {
    ...current,
    ...input,
  };

  library.videos[index] = updated;
  await writeStore(store);
  return updated;
}

export async function deleteProfessionalBook(professionalId: string, bookId: string) {
  const store = await readStore();
  const library = getOrCreateProfessionalLibrary(store, professionalId);
  library.books = library.books.filter((book) => book.id !== bookId);
  await writeStore(store);
}

export async function deleteProfessionalVideo(professionalId: string, videoId: string) {
  const store = await readStore();
  const library = getOrCreateProfessionalLibrary(store, professionalId);
  library.videos = library.videos.filter((video) => video.id !== videoId);
  await writeStore(store);
}

export async function deleteProfessionalLibrary(professionalId: string) {
  const store = await readStore();

  if (!store.professionals[professionalId]) {
    return;
  }

  delete store.professionals[professionalId];
  await writeStore(store);
}

export async function getAllLibraries() {
  return readStore();
}

export async function getStudentLibrary(studentId: string): Promise<StudentLibrary> {
  const store = await readStore();
  return (
    store.students[studentId] ?? {
      purchasedBooks: [],
      watchedVideos: [],
    }
  );
}

function getOrCreateStudentLibrary(store: LibraryStore, studentId: string): StudentLibrary {
  if (!store.students[studentId]) {
    store.students[studentId] = {
      purchasedBooks: [],
      watchedVideos: [],
    };
  }

  return store.students[studentId];
}

export async function appendStudentBookActivity(studentId: string, input: Omit<StudentBookActivity, "id" | "purchasedAt">) {
  // Re-read inside queue to get latest state
  const store = await readStore();
  const library = getOrCreateStudentLibrary(store, studentId);

  const activity: StudentBookActivity = {
    id: `purchased-book-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    purchasedAt: new Date().toISOString(),
    ...input,
  };

  library.purchasedBooks = [activity, ...library.purchasedBooks];
  await writeStore(store);
  return activity;
}

export async function appendStudentVideoActivity(studentId: string, input: Omit<StudentVideoActivity, "id" | "watchedAt">) {
  // Re-read inside queue to get latest state
  const store = await readStore();
  const library = getOrCreateStudentLibrary(store, studentId);

  const activity: StudentVideoActivity = {
    id: `watched-video-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    watchedAt: new Date().toISOString(),
    ...input,
  };

  library.watchedVideos = [activity, ...library.watchedVideos];
  await writeStore(store);
  return activity;
}

export async function deleteStudentLibrary(studentId: string) {
  const store = await readStore();

  if (!store.students[studentId]) {
    return;
  }

  delete store.students[studentId];
  await writeStore(store);
}
