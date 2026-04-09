import { randomUUID } from "crypto";
import { promises as fs } from "fs";

import type { ProfessionalNotification } from "@/types/notifications";
import { getDataDir, getDataFile } from "@/lib/storage-path";
import { ensureDbSchema, getDbPool, isPostgresConfigured } from "@/lib/db";

const DATA_DIR = getDataDir();
const NOTIFICATIONS_FILE = getDataFile("notifications.json");
const NOTIFICATIONS_DB_KEY = "notifications";

async function ensureNotificationsFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(NOTIFICATIONS_FILE);
  } catch {
    await fs.writeFile(NOTIFICATIONS_FILE, "[]", "utf-8");
  }
}

async function readNotifications(): Promise<ProfessionalNotification[]> {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();
    const result = await db.query<{ data: unknown }>(
      `SELECT data FROM app_data WHERE key = $1 LIMIT 1`,
      [NOTIFICATIONS_DB_KEY],
    );

    if (result.rows.length === 0) {
      return [];
    }

    const payload = result.rows[0].data;
    return Array.isArray(payload) ? (payload as ProfessionalNotification[]) : [];
  }

  await ensureNotificationsFile();
  const raw = await fs.readFile(NOTIFICATIONS_FILE, "utf-8");

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ProfessionalNotification[]) : [];
  } catch {
    return [];
  }
}

async function writeNotifications(notifications: ProfessionalNotification[]) {
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
      [NOTIFICATIONS_DB_KEY, JSON.stringify(notifications)],
    );
    return;
  }

  await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2), "utf-8");
}

export async function appendProfessionalNotification(notification: Omit<ProfessionalNotification, "id" | "createdAt">) {
  const notifications = await readNotifications();

  notifications.unshift({
    ...notification,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  });

  await writeNotifications(notifications.slice(0, 100));
}

export async function getProfessionalNotifications() {
  const notifications = await readNotifications();
  return notifications.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}