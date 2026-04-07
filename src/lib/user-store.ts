import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { hash } from "bcryptjs";
import type { AppUser, UserRole } from "@/types/auth";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

async function ensureUsersFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, "[]", "utf-8");
  }
}

async function readUsers(): Promise<AppUser[]> {
  await ensureUsersFile();
  const raw = await fs.readFile(USERS_FILE, "utf-8");

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AppUser[]) : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: AppUser[]) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export async function getUserByEmail(email: string) {
  const users = await readUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  const users = await readUsers();
  const email = input.email.toLowerCase().trim();

  const alreadyExists = users.some((user) => user.email.toLowerCase() === email);
  if (alreadyExists) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await hash(input.password, 10);
  const newUser: AppUser = {
    id: randomUUID(),
    name: input.name.trim(),
    email,
    passwordHash,
    role: input.role,
    provider: "credentials",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeUsers(users);

  return newUser;
}

export async function upsertGoogleUser(input: {
  email: string;
  name: string;
  image?: string | null;
}) {
  const users = await readUsers();
  const email = input.email.toLowerCase().trim();
  const existing = users.find((user) => user.email.toLowerCase() === email);

  if (existing) {
    return existing;
  }

  const newUser: AppUser = {
    id: randomUUID(),
    name: input.name || email.split("@")[0],
    email,
    role: "student",
    image: input.image ?? undefined,
    provider: "google",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeUsers(users);

  return newUser;
}
