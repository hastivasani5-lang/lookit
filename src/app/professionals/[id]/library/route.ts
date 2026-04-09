import { NextResponse } from "next/server";

import { getProfessionalLibrary } from "@/lib/content-library-store";

export const runtime = "nodejs";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const library = await getProfessionalLibrary(id);

  return NextResponse.json({
    books: library.books,
    videos: library.videos,
    categories: library.categories,
  });
}