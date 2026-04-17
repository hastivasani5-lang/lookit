import { NextResponse } from "next/server";
import fs from "fs";

const DATA_PATH = "data/follows.json";

export async function GET() {
  let follows = [];
  try {
    const file = fs.readFileSync(DATA_PATH, "utf8");
    // Remove comments and parse
    const clean = file.replace(/\/\/.*$/gm, "").trim();
    follows = clean ? JSON.parse(clean) : [];
  } catch (e) { follows = []; }
  // Only return follows from the last 24 hours
  const now = Date.now();
  follows = follows.filter((f: any) => f.followedAt && now - new Date(f.followedAt).getTime() < 24 * 60 * 60 * 1000);
  return NextResponse.json({ data: follows });
}
