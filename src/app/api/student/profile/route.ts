import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { updateUserProfile } from "@/lib/user-store";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "student") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    country?: string;
    profession?: string;
    source?: string;
    studyTime?: string;
  };

  if (!body.country && !body.profession && !body.source && !body.studyTime) {
    return NextResponse.json({ message: "No data provided." }, { status: 400 });
  }

  // Map modal answers to existing user fields:
  // location  → country
  // contactNumber → profession
  // specialization → "source | studyTime"
  const specialization = [body.source, body.studyTime].filter(Boolean).join(" | ");

  const updatedUser = await updateUserProfile({
    id: session.user.id,
    location: body.country,
    contactNumber: body.profession,
    specialization: specialization || undefined,
  });

  return NextResponse.json({ success: true, user: { id: updatedUser.id } });
}
