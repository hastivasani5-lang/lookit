import { promises as fs } from "fs";
import path from "path";
import { ensureDbSchema, getDbPool, isPostgresConfigured } from "@/lib/db";
import { getDataFile } from "@/lib/storage-path";

const FILE = getDataFile("follows.json");
const FOLLOWS_DB_KEY = "follows";

type FollowRecord = { studentId: string; professionalId: string; followedAt: string };

async function readFollows(): Promise<FollowRecord[]> {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();
    const result = await db.query<{ data: unknown }>(
      `SELECT data FROM app_data WHERE key = $1 LIMIT 1`,
      [FOLLOWS_DB_KEY],
    );
    if (result.rows.length > 0) {
      const parsed = result.rows[0].data;
      return Array.isArray(parsed) ? (parsed as FollowRecord[]) : [];
    }
    // DB empty — seed from JSON
    try {
      const raw = await fs.readFile(FILE, "utf-8");
      const parsed = JSON.parse(raw);
      const store = Array.isArray(parsed) ? (parsed as FollowRecord[]) : [];
      if (store.length > 0) await writeFollows(store);
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

async function writeFollows(follows: FollowRecord[]): Promise<void> {
  if (isPostgresConfigured()) {
    await ensureDbSchema();
    const db = getDbPool();
    await db.query(
      `INSERT INTO app_data (key, data, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (key)
       DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      [FOLLOWS_DB_KEY, JSON.stringify(follows)],
    );
    return;
  }

  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(follows, null, 2), "utf-8");
}

export async function getFollowerIds(professionalId: string): Promise<string[]> {
  const follows = await readFollows();
  return follows.filter((f) => f.professionalId === professionalId).map((f) => f.studentId);
}

export async function addFollow(studentId: string, professionalId: string): Promise<void> {
  const follows = await readFollows();
  if (!follows.find((f) => f.studentId === studentId && f.professionalId === professionalId)) {
    follows.push({ studentId, professionalId, followedAt: new Date().toISOString() });
    await writeFollows(follows);
  }
}

export async function removeFollow(studentId: string, professionalId: string): Promise<void> {
  const follows = await readFollows();
  await writeFollows(follows.filter((f) => !(f.studentId === studentId && f.professionalId === professionalId)));
}

export async function getFollowsByStudent(studentId: string): Promise<FollowRecord[]> {
  const follows = await readFollows();
  return follows.filter((f) => f.studentId === studentId);
}

export async function getFollowsByProfessional(professionalId: string): Promise<FollowRecord[]> {
  const follows = await readFollows();
  return follows.filter((f) => f.professionalId === professionalId);
}
