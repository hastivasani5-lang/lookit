import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "follows.json");

type FollowRecord = { studentId: string; professionalId: string; followedAt: string };

async function readFollows(): Promise<FollowRecord[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Returns all studentIds that follow the given professional */
export async function getFollowerIds(professionalId: string): Promise<string[]> {
  const follows = await readFollows();
  return follows.filter((f) => f.professionalId === professionalId).map((f) => f.studentId);
}
