import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getFollowsByProfessional } from "@/lib/follows-store";
import { getAllUsers } from "@/lib/user-store";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "professional") {
      return NextResponse.json({ data: [] });
    }

    const follows = await getFollowsByProfessional(session.user.id);

    // Enrich with student names
    const allUsers = await getAllUsers();
    const userMap = new Map(allUsers.map((u) => [u.id, u.name]));

    const enriched = follows.map((f) => ({
      studentId: f.studentId,
      studentName: userMap.get(f.studentId) ?? "A student",
      followedAt: f.followedAt,
    }));

    // Sort newest first
    enriched.sort((a, b) => new Date(b.followedAt).getTime() - new Date(a.followedAt).getTime());

    return NextResponse.json({ data: enriched });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
