import { randomUUID } from "crypto";
import { promises as fs } from "fs";

import { ensureDbSchema, getDbPool, isPostgresConfigured } from "@/lib/db";
import { getDataDir, getDataFile } from "@/lib/storage-path";

const DATA_DIR = getDataDir();
const CONTACT_MESSAGES_FILE = getDataFile("contact-messages.json");
const CONTACT_MESSAGES_DB_KEY = "contact-messages";

export type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  agreedToTerms: boolean;
  createdAt: string;
};

async function ensureContactMessagesFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(CONTACT_MESSAGES_FILE);
  } catch {
    await fs.writeFile(CONTACT_MESSAGES_FILE, "[]", "utf-8");
  }
}

async function readContactMessages(): Promise<ContactMessage[]> {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();
    const result = await db.query<{ data: unknown }>(
      `SELECT data FROM app_data WHERE key = $1 LIMIT 1`,
      [CONTACT_MESSAGES_DB_KEY],
    );

    if (result.rows.length === 0) {
      return [];
    }

    const payload = result.rows[0].data;
    return Array.isArray(payload) ? (payload as ContactMessage[]) : [];
  }

  await ensureContactMessagesFile();
  const raw = await fs.readFile(CONTACT_MESSAGES_FILE, "utf-8");

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ContactMessage[]) : [];
  } catch {
    return [];
  }
}

async function writeContactMessages(messages: ContactMessage[]) {
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
      [CONTACT_MESSAGES_DB_KEY, JSON.stringify(messages)],
    );

    return;
  }

  await fs.writeFile(CONTACT_MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf-8");
}

export async function addContactMessage(input: Omit<ContactMessage, "id" | "createdAt">) {
  const messages = await readContactMessages();

  const nextMessage: ContactMessage = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  messages.unshift(nextMessage);
  await writeContactMessages(messages.slice(0, 500));

  return nextMessage;
}

export async function getContactMessages() {
  const messages = await readContactMessages();
  return messages.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}
