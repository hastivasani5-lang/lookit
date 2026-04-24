import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { promises as fs } from "fs";

import { authOptions } from "@/lib/auth";
import { appendStudentNotification } from "@/lib/student-notifications-store";
import { getDataDir, getDataFile } from "@/lib/storage-path";
import { ensureDbSchema, getDbPool, isPostgresConfigured } from "@/lib/db";

export const runtime = "nodejs";

const SENT_KEY = "missed-goal-sent";
const FILE = getDataFile("missed-goal-sent.json");

async function readSent(): Promise<Record<string, boolean>> {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();
    const result = await db.query<{ data: unknown }>(
      `SELECT data FROM app_data WHERE key = $1 LIMIT 1`,
      [SENT_KEY],
    );
    if (result.rows.length === 0) return {};
    const payload = result.rows[0].data;
    return (payload && typeof payload === "object" && !Array.isArray(payload))
      ? (payload as Record<string, boolean>)
      : {};
  }
  try {
    await fs.mkdir(getDataDir(), { recursive: true });
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

async function writeSent(data: Record<string, boolean>) {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();
    await db.query(
      `INSERT INTO app_data (key, data, updated_at) VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      [SENT_KEY, JSON.stringify(data)],
    );
    return;
  }
  await fs.mkdir(getDataDir(), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  if (session.user.role !== "student") {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    date?: string;
    workedHours?: number;
    goalHours?: number;
  };

  const { date, workedHours = 0, goalHours = 0 } = body;

  if (!date) {
    return NextResponse.json({ message: "Missing date." }, { status: 400 });
  }

  // If goal is 0 or worked >= goal, skip
  if (goalHours <= 0 || workedHours >= goalHours) {
    return NextResponse.json({ skipped: true });
  }

  const studentId = session.user.id;
  const sentKey = `${studentId}::${date}`;

  const sent = await readSent();
  if (sent[sentKey]) {
    return NextResponse.json({ alreadySent: true });
  }

  const message = `You missed your work goal on ${date} — you worked ${workedHours} hrs but your goal was ${goalHours} hrs.`;
  const notification = await appendStudentNotification(studentId, "announcement", message);

  sent[sentKey] = true;
  await writeSent(sent);

  return NextResponse.json({ notificationId: notification.id }, { status: 201 });
}
