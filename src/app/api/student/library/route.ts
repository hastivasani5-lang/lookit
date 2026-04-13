import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getStudentLibrary } from "@/lib/content-library-store";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "student") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const library = await getStudentLibrary(session.user.id);
  return NextResponse.json({
    purchasedBooks: library.purchasedBooks,
    watchedVideos: library.watchedVideos,
  });
}
