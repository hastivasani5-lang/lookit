import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "upcoming-classes.json");

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

type Store = Record<string, UpcomingClass[]>; // keyed by professionalId

async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

async function writeStore(store: Store) {
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
