import { promises as fs } from "fs";
import { NextResponse } from "next/server";

const FOLLOWS_FILE = process.cwd() + "/data/follows.json";

export async function GET(req) {
  const url = new URL(req.url);
  const professionalId = url.searchParams.get("professionalId");
  if (!professionalId) return NextResponse.json([]);
  const raw = await fs.readFile(FOLLOWS_FILE, "utf-8");
  const follows = JSON.parse(raw);
  return NextResponse.json(follows.filter(f => f.professionalId === professionalId));
}

export async function POST(req) {
  const { studentId, professionalId } = await req.json();
  if (!studentId || !professionalId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const raw = await fs.readFile(FOLLOWS_FILE, "utf-8");
  const follows = JSON.parse(raw);
  if (!follows.find(f => f.studentId === studentId && f.professionalId === professionalId)) {
    follows.push({ studentId, professionalId, followedAt: new Date().toISOString() });
    await fs.writeFile(FOLLOWS_FILE, JSON.stringify(follows, null, 2), "utf-8");
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  const { studentId, professionalId } = await req.json();
  if (!studentId || !professionalId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const raw = await fs.readFile(FOLLOWS_FILE, "utf-8");
  let follows = JSON.parse(raw);
  follows = follows.filter(f => !(f.studentId === studentId && f.professionalId === professionalId));
  await fs.writeFile(FOLLOWS_FILE, JSON.stringify(follows, null, 2), "utf-8");
  return NextResponse.json({ ok: true });
}
