import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getUserById } from "@/lib/user-store";
import { getStudentLibrary } from "@/lib/content-library-store";

export const runtime = "nodejs";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authorized") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const user = await getUserById(id);

  if (!user || user.role !== "student") {
    return NextResponse.json({ message: "Student not found." }, { status: 404 });
  }

  const library = await getStudentLibrary(id);

  return NextResponse.json({
    student: {
      id: user.id,
      name: user.name,
      email: user.email,
      contactNumber: user.contactNumber ?? "",
      location: user.location ?? "",
      createdAt: user.createdAt,
      purchasedBooks: library.purchasedBooks,
      watchedVideos: library.watchedVideos,
    },
  });
}
