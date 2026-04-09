import { NextResponse } from "next/server";

import { getUserById } from "@/lib/user-store";
import { getProfessionalLibrary } from "@/lib/content-library-store";

export const runtime = "nodejs";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const user = await getUserById(id);

  if (!user || user.role !== "professional" || user.approvalStatus !== "approved") {
    return NextResponse.json({ message: "Professional not found." }, { status: 404 });
  }

  const library = await getProfessionalLibrary(id);

  return NextResponse.json({
    books: library.books,
    videos: library.videos,
    categories: library.categories,
  });
}
