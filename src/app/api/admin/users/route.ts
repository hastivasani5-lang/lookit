import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { deleteUserById, getAllUsers } from "@/lib/user-store";

export const runtime = "nodejs";

export async function GET() {

  // BYPASS admin_session check for local development
  // const cookieStore = await cookies();
  // if (cookieStore.get("admin_session")?.value !== "authorized") {
  //   return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  // }

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

export async function DELETE(request: Request) {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authorized") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { userId?: string };

  if (!body.userId) {
    return NextResponse.json({ message: "User ID is required." }, { status: 400 });
  }

  const deletedUser = await deleteUserById(body.userId);

  if (!deletedUser) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  return NextResponse.json({
    message: "User deleted.",
    user: {
      id: deletedUser.id,
      role: deletedUser.role,
    },
  });
}
