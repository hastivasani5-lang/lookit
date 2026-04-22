import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getAllUsers } from "@/lib/user-store";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authorized") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const users = await getAllUsers();

   const now = new Date();
  const days: { label: string; date: string }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push({
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      date: d.toISOString().slice(0, 10),
    });
  }

  const studentValues = days.map(({ date }) =>
    users.filter((u) => u.role === "student" && u.createdAt.slice(0, 10) === date).length,
  );

  const teacherValues = days.map(({ date }) =>
    users.filter((u) => u.role === "professional" && u.createdAt.slice(0, 10) === date).length,
  );

  return NextResponse.json({
    labels: days.map((d) => d.label),
    students: studentValues,
    teachers: teacherValues,
  });
}
