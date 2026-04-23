import { promises as fs } from "fs";
import { getDataFile } from "@/lib/storage-path";
import { ensureDbSchema, getDbPool, isPostgresConfigured } from "@/lib/db";

const FILE = getDataFile("advance-bookings.json");
const DB_KEY = "advance-bookings";

export type AdvanceBooking = {
  id: string;
  classId: string;
  classTitle: string;
  classDate: string;
  classTime: string;
  platform: string;
  professionalId: string;
  professionalName: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  message: string;
  bookedAt: string;
  status: "pending" | "confirmed" | "cancelled";
};

async function readStore(): Promise<AdvanceBooking[]> {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();
    const result = await db.query<{ data: unknown }>(
      `SELECT data FROM app_data WHERE key = $1 LIMIT 1`,
      [DB_KEY],
    );
    if (result.rows.length > 0) {
      const parsed = result.rows[0].data;
      return Array.isArray(parsed) ? (parsed as AdvanceBooking[]) : [];
    }
    // DB empty — seed from JSON
    try {
      const raw = await fs.readFile(FILE, "utf-8");
      const parsed = JSON.parse(raw);
      const store = Array.isArray(parsed) ? (parsed as AdvanceBooking[]) : [];
      if (store.length > 0) await writeStore(store);
      return store;
    } catch { return []; }
  }

  try {
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeStore(data: AdvanceBooking[]): Promise<void> {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();
    await db.query(
      `INSERT INTO app_data (key, data, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (key)
       DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      [DB_KEY, JSON.stringify(data)],
    );
    return;
  }
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function getAllBookings(): Promise<AdvanceBooking[]> {
  return readStore();
}

export async function getBookingsForProfessional(professionalId: string): Promise<AdvanceBooking[]> {
  const all = await readStore();
  return all.filter((b) => b.professionalId === professionalId);
}

export async function addBooking(booking: Omit<AdvanceBooking, "id" | "bookedAt" | "status">): Promise<AdvanceBooking> {
  const all = await readStore();
  const newBooking: AdvanceBooking = {
    ...booking,
    id: `booking-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    bookedAt: new Date().toISOString(),
    status: "pending",
  };
  all.unshift(newBooking);
  await writeStore(all);
  return newBooking;
}

export async function updateBookingStatus(id: string, status: AdvanceBooking["status"]): Promise<void> {
  const all = await readStore();
  const idx = all.findIndex((b) => b.id === id);
  if (idx >= 0) {
    all[idx].status = status;
    await writeStore(all);
  }
}
