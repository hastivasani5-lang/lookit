import { NextResponse } from "next/server";
import fs from "fs";

const DATA_PATH = "data/content-library.json";

export async function GET() {
  let books = [];
  try {
    const file = fs.readFileSync(DATA_PATH, "utf8");
    const data = JSON.parse(file);
    if (data.professionals) {
      // Flatten all books from all professionals
      books = Object.values(data.professionals)
        .flatMap((prof: any) => Array.isArray(prof.books) ? prof.books : []);
    }
  } catch (e) { books = []; }
  // Only return books added in the last 24 hours
  const now = Date.now();
  books = books.filter((b: any) => b.createdAt && now - new Date(b.createdAt).getTime() < 24 * 60 * 60 * 1000);
  return NextResponse.json({ data: books });
}
