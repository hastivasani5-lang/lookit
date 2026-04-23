import { NextResponse } from "next/server";
import { getAllLibraries } from "@/lib/content-library-store";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const { bookId } = await params;

  const libraries = await getAllLibraries();

  for (const [, library] of Object.entries(libraries.professionals)) {
    const book = library.books.find((b) => b.id === bookId);
    if (book) {
      const fileUrl = book.fileUrl || book.url || "";
      if (fileUrl) {
        // If it's a relative path, make it absolute using NEXTAUTH_URL
        if (fileUrl.startsWith("/")) {
          const base = process.env.NEXTAUTH_URL || "https://lookit-gold.vercel.app";
          return NextResponse.redirect(new URL(fileUrl, base));
        }
        // If it's already an absolute URL (Vercel Blob), redirect directly
        return NextResponse.redirect(fileUrl);
      }
      return NextResponse.json({ message: "File not available", fileName: book.fileName }, { status: 404 });
    }
  }

  return NextResponse.json({ message: "Book not found" }, { status: 404 });
}
