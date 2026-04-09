import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const LIBRARY_FILE = path.join(DATA_DIR, "content-library.json");

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
  mrp: string;
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

function getOrCreateStudentLibrary(store: LibraryStore, studentId: string): StudentLibrary {
  if (!store.students[studentId]) {
    store.students[studentId] = {
      purchasedBooks: [],
      watchedVideos: [],
    };
  }

  return store.students[studentId];
}

function uniqueCategories(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

export async function addProfessionalCategory(professionalId: string, category: string) {
  const trimmedCategory = category.trim();

  if (!trimmedCategory) {
    return [];
  }

  const store = await readStore();
  const library = getOrCreateProfessionalLibrary(store, professionalId);
  library.categories = uniqueCategories([...library.categories, trimmedCategory]);
  await writeStore(store);

  return library.categories;
}

export async function deleteProfessionalCategory(professionalId: string, category: string) {
  const trimmedCategory = category.trim();

  if (!trimmedCategory) {
    return [];
  }

  const store = await readStore();
  const library = getOrCreateProfessionalLibrary(store, professionalId);
  library.categories = library.categories.filter((value) => value !== trimmedCategory);
  await writeStore(store);

  return library.categories;
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

export async function recordStudentBookPurchase(
  studentId: string,
  input: { title: string; source: string; amount: string },
) {
  const store = await readStore();
  const library = getOrCreateStudentLibrary(store, studentId);

  const purchase: StudentBookActivity = {
    id: `purchase-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: input.title.trim(),
    source: input.source.trim() || "Library",
    amount: input.amount.trim(),
    purchasedAt: new Date().toLocaleString(),
  };

  library.purchasedBooks = [purchase, ...library.purchasedBooks];
  await writeStore(store);
  return purchase;
}

export async function recordStudentVideoActivity(
  studentId: string,
  input: { title: string; provider: string },
) {
  const store = await readStore();
  const library = getOrCreateStudentLibrary(store, studentId);

  const activity: StudentVideoActivity = {
    id: `watch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: input.title.trim(),
    provider: input.provider.trim() || "Library",
    watchedAt: new Date().toLocaleString(),
  };

  library.watchedVideos = [activity, ...library.watchedVideos];
  await writeStore(store);
  return activity;
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
