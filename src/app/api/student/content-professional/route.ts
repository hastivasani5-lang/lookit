import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllLibraries } from "@/lib/content-library-store";
import { getProfessionalUsers } from "@/lib/user-store";

export const runtime = "nodejs";

// Given a contentId OR professionalName, find the professionalId
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const contentId = request.nextUrl.searchParams.get("contentId");
  const professionalName = request.nextUrl.searchParams.get("name");

  // Strategy 1: find by contentId in professional libraries
  if (contentId) {
    const libraries = await getAllLibraries();
    for (const [professionalId, library] of Object.entries(libraries.professionals)) {
      const hasBook = library.books.some((b) => b.id === contentId);
      const hasVideo = library.videos.some((v) => v.id === contentId);
      if (hasBook || hasVideo) {
        return NextResponse.json({ professionalId });
      }
    }
  }

  // Strategy 2: find by professional name (fallback when contentId missing)
  if (professionalName) {
    const professionals = await getProfessionalUsers();
    const match = professionals.find(
      (p) => p.name.toLowerCase().trim() === professionalName.toLowerCase().trim()
    );
    if (match) {
      return NextResponse.json({ professionalId: match.id });
    }
  }

  return NextResponse.json({ message: "Professional not found." }, { status: 404 });
}
