import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { hash } from "bcryptjs";
import type { AppUser, UserRole } from "@/types/auth";

import { appendProfessionalNotification } from "@/lib/notifications-store";

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

function getProfileChangeLabels(currentUser: AppUser, updatedUser: AppUser) {
  const changedFields: string[] = [];

  if (currentUser.name !== updatedUser.name) changedFields.push("Name updated");
  if (currentUser.email !== updatedUser.email) changedFields.push("Email updated");
  if (currentUser.image !== updatedUser.image) changedFields.push("Profile photo updated");
  if (currentUser.specialization !== updatedUser.specialization) changedFields.push("Specialization updated");
  if (currentUser.contactNumber !== updatedUser.contactNumber) changedFields.push("Contact number updated");
  if (currentUser.location !== updatedUser.location) changedFields.push("Location updated");
  if ((currentUser.certificates ?? []).length !== (updatedUser.certificates ?? []).length) {
    changedFields.push("Certificates uploaded");
  }
  if ((currentUser.reviews ?? []).join("\n") !== (updatedUser.reviews ?? []).join("\n")) {
    changedFields.push("Profile content updated");
  }
  if (currentUser.profileBoostedUntil !== updatedUser.profileBoostedUntil) {
    changedFields.push("Profile boost renewed");
  }

  return changedFields;
}

export async function getUserByEmail(email: string) {
  const users = await readUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function getUserById(id: string) {
  const users = await readUsers();
  return users.find((user) => user.id === id) ?? null;
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
    specialization: undefined,
    contactNumber: undefined,
    location: undefined,
    certificates: [],
    reviews: [],
    profileBoostedUntil: undefined,
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
    specialization: undefined,
    contactNumber: undefined,
    location: undefined,
    certificates: [],
    reviews: [],
    profileBoostedUntil: undefined,
    provider: "google",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeUsers(users);

  return newUser;
}

export async function updateUserProfile(input: {
  id: string;
  name?: string;
  email?: string;
  image?: string | null;
  specialization?: string;
  contactNumber?: string;
  location?: string;
  certificates?: string[];
  reviews?: string[];
  profileBoostedUntil?: string | null;
}) {
  const users = await readUsers();
  const index = users.findIndex((user) => user.id === input.id);

  if (index === -1) {
    throw new Error("User not found.");
  }

  const currentUser = users[index];
  const nextEmail = input.email?.trim().toLowerCase() || currentUser.email;

  const emailAlreadyInUse = users.some(
    (user) => user.id !== input.id && user.email.toLowerCase() === nextEmail,
  );

  if (emailAlreadyInUse) {
    throw new Error("This email is already used by another account.");
  }

  const updatedUser: AppUser = {
    ...currentUser,
    name: input.name?.trim() || currentUser.name,
    email: nextEmail,
    image: input.image === undefined ? currentUser.image : input.image ?? undefined,
    specialization:
      input.specialization === undefined
        ? currentUser.specialization
        : input.specialization.trim() || undefined,
    contactNumber:
      input.contactNumber === undefined
        ? currentUser.contactNumber
        : input.contactNumber.trim() || undefined,
    location: input.location === undefined ? currentUser.location : input.location.trim() || undefined,
    certificates:
      input.certificates && input.certificates.length > 0
        ? [...(currentUser.certificates ?? []), ...input.certificates]
        : currentUser.certificates ?? [],
    reviews:
      input.reviews === undefined
        ? currentUser.reviews ?? []
        : input.reviews.filter((review) => review.trim().length > 0),
    profileBoostedUntil:
      input.profileBoostedUntil === undefined
        ? currentUser.profileBoostedUntil
        : input.profileBoostedUntil ?? undefined,
  };

  users[index] = updatedUser;
  await writeUsers(users);

  if (currentUser.role === "professional") {
    const changedFields = getProfileChangeLabels(currentUser, updatedUser);

    if (changedFields.length > 0) {
      const summary =
        changedFields.length === 1
          ? changedFields[0]
          : `${changedFields[0]} and ${changedFields.length - 1} more update${changedFields.length - 1 === 1 ? "" : "s"}`;

      await appendProfessionalNotification({
        professionalId: updatedUser.id,
        professionalName: updatedUser.name,
        professionalEmail: updatedUser.email,
        summary,
        details: changedFields.join(" · "),
        changedFields,
      });
    }
  }

  return updatedUser;
}
