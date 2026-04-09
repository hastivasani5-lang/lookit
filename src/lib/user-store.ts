import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import { hash } from "bcryptjs";
import type { AppUser, ProfessionalApprovalStatus, UserRole } from "@/types/auth";
import {
  appendAdminApprovalNotification,
  appendProfessionalApprovalNotification,
} from "./approval-notifications-store";
import { appendProfessionalNotification } from "@/lib/notifications-store";
import { ensureDbSchema, getDbPool, isPostgresConfigured } from "@/lib/db";
import { getDataDir, getDataFile } from "@/lib/storage-path";

const DATA_DIR = getDataDir();
const USERS_FILE = getDataFile("users.json");

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string | null;
  role: UserRole;
  image: string | null;
  specialization: string | null;
  contact_number: string | null;
  location: string | null;
  certificates: string[] | null;
  reviews: string[] | null;
  profile_boosted_until: Date | null;
  approval_status: ProfessionalApprovalStatus | null;
  approval_reviewed_by: string | null;
  approval_reviewed_at: Date | null;
  approval_note: string | null;
  provider: "credentials" | "google";
  created_at: Date;
};

let postgresUsersSeedPromise: Promise<void> | null = null;

function normalizeParsedUsers(parsed: unknown): AppUser[] {
  return Array.isArray(parsed)
    ? parsed.map((user) =>
        normalizeUser({
          id: String(user.id),
          name: String(user.name ?? ""),
          email: String(user.email ?? ""),
          role: user.role === "professional" ? "professional" : "student",
          provider: user.provider === "google" ? "google" : "credentials",
          createdAt: String(user.createdAt ?? new Date().toISOString()),
          passwordHash: typeof user.passwordHash === "string" ? user.passwordHash : undefined,
          image: typeof user.image === "string" ? user.image : undefined,
          specialization: typeof user.specialization === "string" ? user.specialization : undefined,
          contactNumber: typeof user.contactNumber === "string" ? user.contactNumber : undefined,
          location: typeof user.location === "string" ? user.location : undefined,
          certificates: Array.isArray(user.certificates)
            ? user.certificates.filter((value: unknown): value is string => typeof value === "string")
            : [],
          reviews: Array.isArray(user.reviews)
            ? user.reviews.filter((value: unknown): value is string => typeof value === "string")
            : [],
          profileBoostedUntil: typeof user.profileBoostedUntil === "string" ? user.profileBoostedUntil : undefined,
          approvalStatus:
            user.approvalStatus === "pending" || user.approvalStatus === "approved" || user.approvalStatus === "rejected"
              ? user.approvalStatus
              : undefined,
          approvalReviewedBy: typeof user.approvalReviewedBy === "string" ? user.approvalReviewedBy : undefined,
          approvalReviewedAt:
            typeof user.approvalReviewedAt === "string" ? user.approvalReviewedAt : undefined,
          approvalNote: typeof user.approvalNote === "string" ? user.approvalNote : undefined,
        }),
      )
    : [];
}

async function seedPostgresUsersFromJsonIfNeeded() {
  if (!isPostgresConfigured()) {
    return;
  }

  if (postgresUsersSeedPromise) {
    return postgresUsersSeedPromise;
  }

  postgresUsersSeedPromise = (async () => {
    await ensureDbSchema();
    const db = getDbPool();

    const countResult = await db.query<{ count: string }>(`SELECT COUNT(*)::text AS count FROM users`);
    const existingCount = Number(countResult.rows[0]?.count ?? "0");

    if (existingCount > 0) {
      return;
    }

    let raw = "";
    try {
      raw = await fs.readFile(USERS_FILE, "utf-8");
    } catch {
      return;
    }

    let usersFromJson: AppUser[] = [];
    try {
      usersFromJson = normalizeParsedUsers(JSON.parse(raw));
    } catch {
      usersFromJson = [];
    }

    if (usersFromJson.length === 0) {
      return;
    }

    for (const user of usersFromJson) {
      await db.query(
        `
          INSERT INTO users (
            id, name, email, password_hash, role, image, specialization, contact_number, location,
            certificates, reviews, profile_boosted_until, approval_status, approval_reviewed_by,
            approval_reviewed_at, approval_note, provider, created_at
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9,
            $10, $11, $12, $13, $14, $15, $16, $17, $18
          )
          ON CONFLICT (id) DO NOTHING
        `,
        [
          user.id,
          user.name,
          user.email.toLowerCase().trim(),
          user.passwordHash ?? null,
          user.role,
          user.image ?? null,
          user.specialization ?? null,
          user.contactNumber ?? null,
          user.location ?? null,
          user.certificates ?? [],
          user.reviews ?? [],
          user.profileBoostedUntil ?? null,
          user.approvalStatus ?? getDefaultApprovalStatus(user.role),
          user.approvalReviewedBy ?? null,
          user.approvalReviewedAt ?? null,
          user.approvalNote ?? null,
          user.provider,
          user.createdAt,
        ],
      );
    }
  })();

  return postgresUsersSeedPromise;
}

function normalizeUser(user: Partial<AppUser> & Pick<AppUser, "id" | "name" | "email" | "role" | "provider" | "createdAt">): AppUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    role: user.role,
    image: user.image,
    specialization: user.specialization,
    contactNumber: user.contactNumber,
    location: user.location,
    certificates: user.certificates ?? [],
    reviews: user.reviews ?? [],
    profileBoostedUntil: user.profileBoostedUntil,
    approvalStatus: user.approvalStatus ?? "approved",
    approvalReviewedBy: user.approvalReviewedBy,
    approvalReviewedAt: user.approvalReviewedAt,
    approvalNote: user.approvalNote,
    provider: user.provider,
    createdAt: user.createdAt,
  };
}

function mapRowToUser(row: UserRow): AppUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash ?? undefined,
    role: row.role,
    image: row.image ?? undefined,
    specialization: row.specialization ?? undefined,
    contactNumber: row.contact_number ?? undefined,
    location: row.location ?? undefined,
    certificates: row.certificates ?? [],
    reviews: row.reviews ?? [],
    profileBoostedUntil: row.profile_boosted_until ? row.profile_boosted_until.toISOString() : undefined,
    approvalStatus: row.approval_status ?? "approved",
    approvalReviewedBy: row.approval_reviewed_by ?? undefined,
    approvalReviewedAt: row.approval_reviewed_at ? row.approval_reviewed_at.toISOString() : undefined,
    approvalNote: row.approval_note ?? undefined,
    provider: row.provider,
    createdAt: row.created_at.toISOString(),
  };
}

function getDefaultApprovalStatus(role: UserRole): ProfessionalApprovalStatus {
  return role === "professional" ? "pending" : "approved";
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
    return normalizeParsedUsers(parsed);
  } catch {
    return [];
  }
}

async function writeUsers(users: AppUser[]) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export async function getUserByEmail(email: string) {
  if (!isPostgresConfigured()) {
    const users = await readUsers();
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  await seedPostgresUsersFromJsonIfNeeded();
  await ensureDbSchema();
  const db = getDbPool();

  const result = await db.query<UserRow>(
    `SELECT * FROM users WHERE email = $1 LIMIT 1`,
    [email.toLowerCase().trim()],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapRowToUser(result.rows[0]);
}

export async function getUserById(id: string) {
  if (!isPostgresConfigured()) {
    const users = await readUsers();
    return users.find((user) => user.id === id) ?? null;
  }

  await seedPostgresUsersFromJsonIfNeeded();
  await ensureDbSchema();
  const db = getDbPool();

  const result = await db.query<UserRow>(`SELECT * FROM users WHERE id = $1 LIMIT 1`, [id]);

  if (result.rows.length === 0) {
    return null;
  }

  return mapRowToUser(result.rows[0]);
}

export async function getAllUsers() {
  if (!isPostgresConfigured()) {
    const users = await readUsers();
    return users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  await seedPostgresUsersFromJsonIfNeeded();
  await ensureDbSchema();
  const db = getDbPool();

  const result = await db.query<UserRow>(`SELECT * FROM users ORDER BY created_at DESC`);
  return result.rows.map(mapRowToUser);
}

export async function getProfessionalUsers() {
  const users = await getAllUsers();
  return users.filter((user) => user.role === "professional");
}

export async function setProfessionalApproval(
  professionalId: string,
  status: Exclude<ProfessionalApprovalStatus, "pending">,
  reviewedBy: string,
  note?: string,
) {
  const users = await getAllUsers();
  const index = users.findIndex((user) => user.id === professionalId);

  if (index === -1) {
    throw new Error("Professional not found.");
  }

  const currentUser = users[index];

  if (currentUser.role !== "professional") {
    throw new Error("Only professionals can be approved or rejected.");
  }

  const updatedUser: AppUser = {
    ...currentUser,
    approvalStatus: status,
    approvalReviewedBy: reviewedBy,
    approvalReviewedAt: new Date().toISOString(),
    approvalNote: note?.trim() || undefined,
  };

  users[index] = updatedUser;

  if (!isPostgresConfigured()) {
    await writeUsers(users);
  } else {
    await ensureDbSchema();
    const db = getDbPool();

    await db.query(
      `
        UPDATE users
        SET approval_status = $2, approval_reviewed_by = $3, approval_reviewed_at = NOW(), approval_note = $4
        WHERE id = $1
      `,
      [professionalId, status, reviewedBy, note?.trim() || null],
    );
  }

  const message =
    status === "approved"
      ? "Your professional account has been approved. You can now log in."
      : "Your professional account was rejected by the admin.";

  await appendAdminApprovalNotification({
    professionalId: updatedUser.id,
    professionalName: updatedUser.name,
    professionalEmail: updatedUser.email,
    event: "decision",
    title: status === "approved" ? "Professional approved" : "Professional rejected",
    message: `${updatedUser.name} was ${status} by ${reviewedBy}.`,
    status,
  });

  await appendProfessionalApprovalNotification({
    professionalId: updatedUser.id,
    professionalName: updatedUser.name,
    professionalEmail: updatedUser.email,
    event: "decision",
    title: status === "approved" ? "Approval granted" : "Application rejected",
    message,
    status,
    note: note?.trim() || undefined,
  });

  return updatedUser;
}

export async function recordProfessionalLoginAttempt(user: AppUser, reason: "pending" | "rejected") {
  await appendAdminApprovalNotification({
    professionalId: user.id,
    professionalName: user.name,
    professionalEmail: user.email,
    event: "login_attempt",
    title: "Professional login blocked",
    message:
      reason === "pending"
        ? `${user.name} attempted to log in before approval.`
        : `${user.name} attempted to log in after being rejected.`,
    status: user.approvalStatus === "rejected" ? "rejected" : "pending",
  });
}

export async function notifyNewProfessionalRegistration(user: AppUser) {
  await appendAdminApprovalNotification({
    professionalId: user.id,
    professionalName: user.name,
    professionalEmail: user.email,
    event: "registration",
    title: "New professional registered",
    message: `${user.name} has registered and is waiting for approval.`,
    status: "pending",
  });
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  if (!isPostgresConfigured()) {
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
      approvalStatus: getDefaultApprovalStatus(input.role),
      provider: "credentials",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeUsers(users);

    if (input.role === "professional") {
      await notifyNewProfessionalRegistration(newUser);
    }

    return newUser;
  }

  await ensureDbSchema();
  await seedPostgresUsersFromJsonIfNeeded();
  const db = getDbPool();

  const email = input.email.toLowerCase().trim();
  const existing = await db.query<{ id: string }>(`SELECT id FROM users WHERE email = $1 LIMIT 1`, [email]);

  if (existing.rows.length > 0) {
    throw new Error("An account with this email already exists.");
  }

  const id = randomUUID();
  const passwordHash = await hash(input.password, 10);

  const result = await db.query<UserRow>(
    `
      INSERT INTO users (
        id, name, email, password_hash, role, provider,
        certificates, reviews, approval_status, created_at
      )
      VALUES ($1, $2, $3, $4, $5, 'credentials', ARRAY[]::TEXT[], ARRAY[]::TEXT[], $6, NOW())
      RETURNING *
    `,
    [id, input.name.trim(), email, passwordHash, input.role, getDefaultApprovalStatus(input.role)],
  );

  const newUser = mapRowToUser(result.rows[0]);

  if (input.role === "professional") {
    await notifyNewProfessionalRegistration(newUser);
  }

  return newUser;
}

export async function upsertGoogleUser(input: {
  email: string;
  name: string;
  image?: string | null;
}) {
  if (!isPostgresConfigured()) {
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
        approvalStatus: "approved",
      provider: "google",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeUsers(users);
    return newUser;
  }

  await ensureDbSchema();
  await seedPostgresUsersFromJsonIfNeeded();
  const db = getDbPool();

  const email = input.email.toLowerCase().trim();
  const existing = await db.query<UserRow>(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [email]);

  if (existing.rows.length > 0) {
    return mapRowToUser(existing.rows[0]);
  }

  const result = await db.query<UserRow>(
    `
      INSERT INTO users (
        id, name, email, role, image, provider,
        certificates, reviews, created_at
      )
      VALUES ($1, $2, $3, 'student', $4, 'google', ARRAY[]::TEXT[], ARRAY[]::TEXT[], NOW())
      RETURNING *
    `,
    [randomUUID(), input.name || email.split("@")[0], email, input.image ?? null],
  );

  return mapRowToUser(result.rows[0]);
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
  if (!isPostgresConfigured()) {
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

  await ensureDbSchema();
  await seedPostgresUsersFromJsonIfNeeded();
  const db = getDbPool();

  const currentResult = await db.query<UserRow>(`SELECT * FROM users WHERE id = $1 LIMIT 1`, [input.id]);

  if (currentResult.rows.length === 0) {
    throw new Error("User not found.");
  }

  const currentUser = mapRowToUser(currentResult.rows[0]);
  const nextEmail = input.email?.trim().toLowerCase() || currentUser.email;

  const emailUsed = await db.query<{ id: string }>(
    `SELECT id FROM users WHERE email = $1 AND id <> $2 LIMIT 1`,
    [nextEmail, input.id],
  );

  if (emailUsed.rows.length > 0) {
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

  const result = await db.query<UserRow>(
    `
      UPDATE users
      SET
        name = $2,
        email = $3,
        image = $4,
        specialization = $5,
        contact_number = $6,
        location = $7,
        certificates = $8,
        reviews = $9,
        profile_boosted_until = $10
      WHERE id = $1
      RETURNING *
    `,
    [
      input.id,
      updatedUser.name,
      updatedUser.email,
      updatedUser.image ?? null,
      updatedUser.specialization ?? null,
      updatedUser.contactNumber ?? null,
      updatedUser.location ?? null,
      updatedUser.certificates ?? [],
      updatedUser.reviews ?? [],
      updatedUser.profileBoostedUntil ?? null,
    ],
  );

  const savedUser = mapRowToUser(result.rows[0]);

  if (currentUser.role === "professional") {
    const changedFields = getProfileChangeLabels(currentUser, savedUser);

    if (changedFields.length > 0) {
      const summary =
        changedFields.length === 1
          ? changedFields[0]
          : `${changedFields[0]} and ${changedFields.length - 1} more update${changedFields.length - 1 === 1 ? "" : "s"}`;

      await appendProfessionalNotification({
        professionalId: savedUser.id,
        professionalName: savedUser.name,
        professionalEmail: savedUser.email,
        summary,
        details: changedFields.join(" · "),
        changedFields,
      });
    }
  }

  return savedUser;
}
