import { randomUUID } from "crypto";
import { promises as fs } from "fs";

import type { ProfessionalApprovalStatus } from "@/types/auth";
import { getDataDir, getDataFile } from "@/lib/storage-path";
import { ensureDbSchema, getDbPool, isPostgresConfigured } from "@/lib/db";

const DATA_DIR = getDataDir();
const APPROVAL_NOTIFICATIONS_FILE = getDataFile("approval-notifications.json");
const APPROVAL_NOTIFICATIONS_DB_KEY = "approval-notifications";

type ApprovalAudience = "admin" | "professional";
type ApprovalEvent = "registration" | "login_attempt" | "decision";

export type ApprovalNotification = {
  id: string;
  audience: ApprovalAudience;
  professionalId: string;
  professionalName: string;
  professionalEmail: string;
  event: ApprovalEvent;
  title: string;
  message: string;
  status: ProfessionalApprovalStatus;
  note?: string;
  createdAt: string;
};

async function ensureApprovalNotificationsFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(APPROVAL_NOTIFICATIONS_FILE);
  } catch {
    await fs.writeFile(APPROVAL_NOTIFICATIONS_FILE, "[]", "utf-8");
  }
}

async function readApprovalNotifications(): Promise<ApprovalNotification[]> {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();
    const result = await db.query<{ data: unknown }>(
      `SELECT data FROM app_data WHERE key = $1 LIMIT 1`,
      [APPROVAL_NOTIFICATIONS_DB_KEY],
    );

    if (result.rows.length === 0) {
      return [];
    }

    const payload = result.rows[0].data;
    return Array.isArray(payload) ? (payload as ApprovalNotification[]) : [];
  }

  await ensureApprovalNotificationsFile();
  const raw = await fs.readFile(APPROVAL_NOTIFICATIONS_FILE, "utf-8");

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ApprovalNotification[]) : [];
  } catch {
    return [];
  }
}

async function writeApprovalNotifications(notifications: ApprovalNotification[]) {
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
      [APPROVAL_NOTIFICATIONS_DB_KEY, JSON.stringify(notifications)],
    );
    return;
  }

  await fs.writeFile(APPROVAL_NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2), "utf-8");
}

async function appendApprovalNotification(notification: Omit<ApprovalNotification, "id" | "createdAt">) {
  const notifications = await readApprovalNotifications();

  notifications.unshift({
    ...notification,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  });

  await writeApprovalNotifications(notifications.slice(0, 200));
}

export async function appendAdminApprovalNotification(notification: Omit<ApprovalNotification, "id" | "createdAt" | "audience">) {
  await appendApprovalNotification({
    ...notification,
    audience: "admin",
  });
}

export async function appendProfessionalApprovalNotification(
  notification: Omit<ApprovalNotification, "id" | "createdAt" | "audience">,
) {
  await appendApprovalNotification({
    ...notification,
    audience: "professional",
  });
}

export async function getApprovalNotifications(audience?: ApprovalAudience) {
  const notifications = await readApprovalNotifications();
  const filtered = audience ? notifications.filter((notification) => notification.audience === audience) : notifications;
  return filtered.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}
