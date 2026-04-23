import { randomUUID } from "crypto";
import { promises as fs } from "fs";

import type { StudentNotification } from "@/types/notifications";
import { getDataDir, getDataFile } from "@/lib/storage-path";
import { ensureDbSchema, getDbPool, isPostgresConfigured } from "@/lib/db";

const DATA_DIR = getDataDir();
const FILE = getDataFile("student-notifications.json");
const DB_KEY = "student-notifications";

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, "[]", "utf-8");
  }
}

async function readAll(): Promise<StudentNotification[]> {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();
    const result = await db.query<{ data: unknown }>(
      `SELECT data FROM app_data WHERE key = $1 LIMIT 1`,
      [DB_KEY],
    );
    if (result.rows.length === 0) return [];
    const payload = result.rows[0].data;
    return Array.isArray(payload) ? (payload as StudentNotification[]) : [];
  }
  await ensureFile();
  const raw = await fs.readFile(FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StudentNotification[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(notifications: StudentNotification[]) {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();
    await db.query(
      `INSERT INTO app_data (key, data, updated_at) VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      [DB_KEY, JSON.stringify(notifications)],
    );
    return;
  }
  await fs.writeFile(FILE, JSON.stringify(notifications, null, 2), "utf-8");
}

export async function getStudentNotifications(studentId: string): Promise<StudentNotification[]> {
  const all = await readAll();
  return all
    .filter((n) => n.studentId === studentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// Write queue to prevent concurrent read-modify-write races
let writeQueue: Promise<void> = Promise.resolve();

export async function appendStudentNotification(
  studentId: string,
  type: StudentNotification["type"],
  message: string,
): Promise<StudentNotification> {
  const notification: StudentNotification = {
    id: randomUUID(),
    studentId,
    type,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };
  writeQueue = writeQueue.then(async () => {
    const all = await readAll();
    all.unshift(notification);
    await writeAll(all);
  });
  await writeQueue;
  return notification;
}

export async function markAllStudentNotificationsRead(studentId: string): Promise<void> {
  const all = await readAll();
  const updated = all.map((n) =>
    n.studentId === studentId ? { ...n, read: true } : n,
  );
  await writeAll(updated);
}

export async function deleteStudentNotification(studentId: string, notificationId: string): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    const all = await readAll();
    await writeAll(all.filter((n) => !(n.id === notificationId && n.studentId === studentId)));
  });
  await writeQueue;
}
