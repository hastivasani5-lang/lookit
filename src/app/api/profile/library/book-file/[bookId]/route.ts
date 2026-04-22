import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getAllLibraries } from "@/lib/content-library-store";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const { bookId } = await params;

  const libraries = await getAllLibraries();

  // Find the book across all professionals
  for (const [, library] of Object.entries(libraries.professionals)) {
    const book = library.books.find((b) => b.id === bookId);
    if (book) {
      // If fileUrl is set, redirect to it
      if (book.fileUrl && book.fileUrl.startsWith("/uploads/")) {
        return NextResponse.redirect(new URL(book.fileUrl, process.env.NEXTAUTH_URL || "http://localhost:3000"));
      }
      // If url is set
      if (book.url && book.url.startsWith("/uploads/")) {
        return NextResponse.redirect(new URL(book.url, process.env.NEXTAUTH_URL || "http://localhost:3000"));
      }
      return NextResponse.json({ message: "File not available", fileName: book.fileName }, { status: 404 });
    }
  }

  return NextResponse.json({ message: "Book not found" }, { status: 404 });
}
