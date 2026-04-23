import { NextResponse, NextRequest } from "next/server";
import { addFollow, removeFollow, getFollowsByStudent, getFollowsByProfessional } from "@/lib/follows-store";
import { getAllUsers } from "@/lib/user-store";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const professionalId = url.searchParams.get("professionalId");
  const studentId = url.searchParams.get("studentId");

  try {
    const users = await getAllUsers();

    if (studentId) {
      const follows = await getFollowsByStudent(studentId);
      const enriched = follows.map((f) => {
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

    const follows = await getFollowsByProfessional(professionalId);
    const enriched = follows.map((f) => {
      const student = users.find((u) => u.id === f.studentId);
      return {
        ...f,
        studentName: student?.name ?? null,
        studentEmail: student?.email ?? null,
        studentImage: student?.image ?? null,
      };
    });
    return NextResponse.json(enriched);
  } catch (err) {
    console.error("[follows GET]", err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { studentId, professionalId } = await req.json();
    if (!studentId || !professionalId)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    await addFollow(studentId, professionalId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[follows POST]", err);
    return NextResponse.json({ error: "Failed to follow" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { studentId, professionalId } = await req.json();
    if (!studentId || !professionalId)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    await removeFollow(studentId, professionalId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[follows DELETE]", err);
    return NextResponse.json({ error: "Failed to unfollow" }, { status: 500 });
  }
}
