
import { promises as fs } from "fs";
import { NextResponse, NextRequest } from "next/server";

const FOLLOWS_FILE = process.cwd() + "/data/follows.json";
const USERS_FILE   = process.cwd() + "/data/users.json";

type FollowRecord = {
  studentId: string;
  professionalId: string;
  followedAt: string;
};

type UserRecord = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const professionalId = url.searchParams.get("professionalId");
  const studentId = url.searchParams.get("studentId");

  const raw = await fs.readFile(FOLLOWS_FILE, "utf-8");
  const follows: FollowRecord[] = JSON.parse(raw);

  // If studentId provided, return professionals this student follows
  if (studentId) {
    const filtered = follows.filter((f) => f.studentId === studentId);
    // Enrich with professional info
    let users: UserRecord[] = [];
    try {
      const usersRaw = await fs.readFile(USERS_FILE, "utf-8");
      users = JSON.parse(usersRaw);
    } catch { users = []; }

    const enriched = filtered.map((f) => {
      const professional = users.find((u) => u.id === f.professionalId);
      return {
        ...f,
        professionalName: professional?.name ?? null,
        professionalEmail: professional?.email ?? null,
        professionalImage: professional?.image ?? null,
      };
    });
    return NextResponse.json(enriched);
  }

  if (!professionalId) return NextResponse.json([]);

  const filtered = follows.filter((f) => f.professionalId === professionalId);

  // Enrich with student info from users.json
  let users: UserRecord[] = [];
  try {
    const usersRaw = await fs.readFile(USERS_FILE, "utf-8");
    users = JSON.parse(usersRaw);
  } catch { users = []; }

  const enriched = filtered.map((f) => {
    const student = users.find((u) => u.id === f.studentId);
    return {
      ...f,
      studentName:  student?.name  ?? null,
      studentEmail: student?.email ?? null,
      studentImage: student?.image ?? null,
    };
  });

  return NextResponse.json(enriched);
}

export async function POST(req: NextRequest) {
  const { studentId, professionalId } = await req.json();
  if (!studentId || !professionalId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const raw = await fs.readFile(FOLLOWS_FILE, "utf-8");
  const follows: FollowRecord[] = JSON.parse(raw);
  if (!follows.find((f) => f.studentId === studentId && f.professionalId === professionalId)) {
    follows.push({ studentId, professionalId, followedAt: new Date().toISOString() });
    await fs.writeFile(FOLLOWS_FILE, JSON.stringify(follows, null, 2), "utf-8");
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { studentId, professionalId } = await req.json();
  if (!studentId || !professionalId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const raw = await fs.readFile(FOLLOWS_FILE, "utf-8");
  let follows: FollowRecord[] = JSON.parse(raw);
  follows = follows.filter((f) => !(f.studentId === studentId && f.professionalId === professionalId));
  await fs.writeFile(FOLLOWS_FILE, JSON.stringify(follows, null, 2), "utf-8");
  return NextResponse.json({ ok: true });
}
