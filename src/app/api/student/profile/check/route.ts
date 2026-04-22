import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/user-store";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "student") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const user = await getUserById(session.user.id);
  // Profile is "filled" if location (country) has been set via the modal
  const filled = Boolean(user?.location?.trim());

  return NextResponse.json({ filled });
}
