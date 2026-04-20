
import { promises as fs } from "fs";
import { NextResponse, NextRequest } from "next/server";

const FOLLOWS_FILE = process.cwd() + "/data/follows.json";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const professionalId = url.searchParams.get("professionalId");
  if (!professionalId) return NextResponse.json([]);
  const raw = await fs.readFile(FOLLOWS_FILE, "utf-8");
  const follows = JSON.parse(raw);
  return NextResponse.json(follows.filter((f: { professionalId: string }) => f.professionalId === professionalId));
}

export async function POST(req: NextRequest) {
  const { studentId, professionalId } = await req.json();
  if (!studentId || !professionalId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const raw = await fs.readFile(FOLLOWS_FILE, "utf-8");
  const follows = JSON.parse(raw);
  if (!follows.find((f: { studentId: string; professionalId: string }) => f.studentId === studentId && f.professionalId === professionalId)) {
    follows.push({ studentId, professionalId, followedAt: new Date().toISOString() });
    await fs.writeFile(FOLLOWS_FILE, JSON.stringify(follows, null, 2), "utf-8");
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { studentId, professionalId } = await req.json();
  if (!studentId || !professionalId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const raw = await fs.readFile(FOLLOWS_FILE, "utf-8");
  let follows = JSON.parse(raw);
  follows = follows.filter((f: { studentId: string; professionalId: string }) => !(f.studentId === studentId && f.professionalId === professionalId));
  await fs.writeFile(FOLLOWS_FILE, JSON.stringify(follows, null, 2), "utf-8");
  return NextResponse.json({ ok: true });
}
