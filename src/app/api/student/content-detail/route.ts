import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStudentLibrary } from "@/lib/content-library-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "student") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "Missing id." }, { status: 400 });

  const library = await getStudentLibrary(session.user.id);

  const book = library.purchasedBooks.find((b) => b.id === id);
  if (book) {
    return NextResponse.json({
      item: {
        id: book.id,
        title: book.title,
        amount: book.amount,
        contentId: book.contentId,
        accessUrl: book.accessUrl,
        source: book.source,
        purchasedAt: book.purchasedAt,
        type: "book",
      },
    });
  }

  const video = library.watchedVideos.find((v) => v.id === id);
  if (video) {
    return NextResponse.json({
      item: {
        id: video.id,
        title: video.title,
        amount: video.amount,
        contentId: video.contentId,
        accessUrl: video.accessUrl,
        provider: video.provider,
        watchedAt: video.watchedAt,
        type: "video",
      },
    });
  }

  return NextResponse.json({ message: "Content not found." }, { status: 404 });
}
