import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/user-store";
import {
  getAllUpcomingClasses,
  getProfessionalClasses,
  saveClass,
  deleteClass,
  type UpcomingClass,
} from "@/lib/upcoming-classes-store";
import { getFollowerIds } from "@/lib/follows-store";
import { appendStudentNotification } from "@/lib/student-notifications-store";
import { appendProfessionalNotification } from "@/lib/notifications-store";

export const runtime = "nodejs";

// GET - public: all classes, or ?mine=1 for professional's own
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mine = searchParams.get("mine") === "1";

  if (mine) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ classes: [] });
    const classes = await getProfessionalClasses(session.user.id);
    return NextResponse.json({ classes });
  }

  const classes = await getAllUpcomingClasses();
  return NextResponse.json({ classes }, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}

// POST - create or update a class
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const user = await getUserById(session.user.id);
  if (!user || user.role !== "professional") {
    return NextResponse.json({ message: "Only professionals can schedule classes." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as Partial<UpcomingClass>;

  if (!body.title?.trim() || !body.date || !body.time) {
    return NextResponse.json({ message: "Title, date and time are required." }, { status: 400 });
  }

  const cls: UpcomingClass = {
    id: body.id || `class-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    professionalId: user.id,
    professionalName: user.name,
    professionalImage: user.image?.trim() || "",
    title: body.title.trim(),
    date: body.date,
    time: body.time,
    duration: body.duration?.trim() || "",
    platform: body.platform?.trim() || "Zoom",
    link: body.link?.trim() || "",
    description: body.description?.trim() || "",
    createdAt: body.createdAt || new Date().toISOString(),
  };

  const saved = await saveClass(user.id, cls);

  try {
    const ids = await getFollowerIds(user.id);
    await Promise.all(
      ids.map((sid) =>
        appendStudentNotification(sid, "announcement", `${user.name} scheduled: "${cls.title}" on ${cls.date} at ${cls.time}`),
      ),
    );
  } catch { /* fan-out must never break the main response */ }

  try {
    await appendProfessionalNotification({
      professionalId: user.id,
      professionalName: user.name,
      professionalEmail: user.email ?? "",
      summary: `Scheduled new class: "${cls.title}"`,
      details: `Date: ${cls.date} at ${cls.time} | Platform: ${cls.platform}`,
      changedFields: ["upcoming_class"],
    });
  } catch { /* notification must never break the main response */ }

  return NextResponse.json({ class: saved });
}

// DELETE - remove a class
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { id?: string };
  if (!body.id) {
    return NextResponse.json({ message: "Class ID required." }, { status: 400 });
  }

  await deleteClass(session.user.id, body.id);
  return NextResponse.json({ message: "Deleted." });
}
