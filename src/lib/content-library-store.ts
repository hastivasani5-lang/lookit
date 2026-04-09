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
  source: "file" | "amazon";
  fileName: string;
  sizeLabel: string;
  createdAt: string;
};

export type StoredVideo = {
  id: string;
  name: string;
  url: string;
  source: "file" | "youtube";
  sizeLabel: string;
  createdAt: string;
};

export type StudentBookActivity = {
  id: string;
  title: string;
  source: string;
  amount: string;
  purchasedAt: string;
};

export type StudentVideoActivity = {
  id: string;
  title: string;
  provider: string;
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
    return {
      professionals: parsed?.professionals ?? {},
      students: parsed?.students ?? {},
    };
  }

  await ensureLibraryFile();
  const raw = await fs.readFile(LIBRARY_FILE, "utf-8");

  try {
    const parsed = JSON.parse(raw) as Partial<LibraryStore>;
    return {
      professionals: parsed.professionals ?? {},
      students: parsed.students ?? {},
    };
  } catch {
    return defaultStore;
  }
}

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

  await fs.writeFile(LIBRARY_FILE, JSON.stringify(store, null, 2), "utf-8");
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

export async function addProfessionalVideo(professionalId: string, input: Omit<StoredVideo, "id" | "createdAt">) {
  const store = await readStore();
  const library = getOrCreateProfessionalLibrary(store, professionalId);

  const video: StoredVideo = {
    ...input,
    id: `video-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };

  library.videos = [video, ...library.videos];

  await writeStore(store);
  return video;
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
