import { promises as fs } from "fs";

import { ensureDbSchema, getDbPool, isPostgresConfigured } from "@/lib/db";
import { getDataDir, getDataFile } from "@/lib/storage-path";

const DATA_DIR = getDataDir();
const PAYMENTS_FILE = getDataFile("payments.json");
const PAYMENTS_DB_KEY = "payments";

type PaymentStore = {
  payments: PaymentRecord[];
};

const defaultStore: PaymentStore = {
  payments: [],
};

export type PaymentRecord = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  professionalName: string;
  professionalId: string;
  plan: string;
  amount: string;
  transactionId: string;
  paidAt: string;
  status: "completed";
  items: Array<{
    title: string;
    contentType: "book" | "video" | "course" | "lecture";
    price: string;
  }>;
};

async function ensurePaymentsFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(PAYMENTS_FILE);
  } catch {
    await fs.writeFile(PAYMENTS_FILE, JSON.stringify(defaultStore, null, 2), "utf-8");
  }
}

async function readStore(): Promise<PaymentStore> {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();

    const result = await db.query<{ data: unknown }>(
      `SELECT data FROM app_data WHERE key = $1 LIMIT 1`,
      [PAYMENTS_DB_KEY],
    );

    if (result.rows.length === 0) {
      return defaultStore;
    }

    const parsed = result.rows[0].data as Partial<PaymentStore>;
    return {
      payments: Array.isArray(parsed?.payments) ? (parsed.payments as PaymentRecord[]) : [],
    };
  }

  await ensurePaymentsFile();
  const raw = await fs.readFile(PAYMENTS_FILE, "utf-8");

  try {
    const parsed = JSON.parse(raw) as Partial<PaymentStore>;
    return {
      payments: Array.isArray(parsed.payments) ? (parsed.payments as PaymentRecord[]) : [],
    };
  } catch {
    return defaultStore;
  }
}

async function writeStore(store: PaymentStore) {
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
      [PAYMENTS_DB_KEY, JSON.stringify(store)],
    );
    return;
  }

  await fs.writeFile(PAYMENTS_FILE, JSON.stringify(store, null, 2), "utf-8");
}

export async function getPayments() {
  const store = await readStore();
  return store.payments;
}

export async function appendPayment(payment: PaymentRecord) {
  const store = await readStore();
  store.payments = [payment, ...store.payments];
  await writeStore(store);
  return payment;
}
