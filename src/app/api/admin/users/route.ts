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

  return NextResponse.json({
    users: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider,
      specialization: user.specialization ?? "",
      contactNumber: user.contactNumber ?? "",
      location: user.location ?? "",
      certificates: user.certificates ?? [],
      reviews: user.reviews ?? [],
      profileBoostedUntil: user.profileBoostedUntil ?? null,
      createdAt: user.createdAt,
    })),
  });
}
