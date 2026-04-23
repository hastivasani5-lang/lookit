import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllLibraries } from "@/lib/content-library-store";

export const runtime = "nodejs";

// Given a contentId (book/video id), find which professional owns it
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const contentId = request.nextUrl.searchParams.get("contentId");
  const professionalName = request.nextUrl.searchParams.get("name");

  if (!contentId && !professionalName) {
    return NextResponse.json({ message: "Missing contentId or name." }, { status: 400 });
  }

  const libraries = await getAllLibraries();

  for (const [professionalId, library] of Object.entries(libraries.professionals)) {
    if (contentId) {
      const hasBook = library.books.some((b) => b.id === contentId);
      const hasVideo = library.videos.some((v) => v.id === contentId);
      if (hasBook || hasVideo) {
        return NextResponse.json({ professionalId });
      }
    }
  }

  return NextResponse.json({ message: "Professional not found." }, { status: 404 });
}
