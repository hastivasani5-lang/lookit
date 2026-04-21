import { NextResponse } from "next/server";
import { getProfessionalLibrary } from "@/lib/content-library-store";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ message: "Invalid professional ID." }, { status: 400 });
  }

  try {
    const library = await getProfessionalLibrary(id);

    return NextResponse.json({
      books: library.books,
      videos: library.videos,
      categories: library.categories,
    });
  } catch {
    return NextResponse.json({ books: [], videos: [], categories: [] });
  }
}
